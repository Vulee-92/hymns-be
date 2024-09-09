const Product = require("../models/ProductModel");
const Category = require("../models/CateProductModel");
const Brand = require("../models/BrandProductModel");
const Collection = require('../models/CollectionsModel');
const Notification = require('../models/NotificationProductModel');
const { sendEmailNotification,sendRestockNotification } = require('./EmailProductNotificationService');
const NotificationService = require('./NotificationService');
const SearchKeyword = require('../models/SearchKeywordModel');
const slugify = require('slugify');

// Hàm tiện ích để xử lý lỗi
const handleError = (error,message = 'Đã xảy ra lỗi') => {
	console.error(message,error);
	return { status: 'ERR',message: message };
};

// Hàm tiện ích để trả về kết quả thành công
const handleSuccess = (data,message = 'Thành công') => {
	return { status: 'OK',message,data };
};
const createProduct = async (newProduct) => {
	try {
		const {
			name,
			mainImage,
			image,
			countInStock,
			price,
			rating,
			description,
			discount,
			fee,
			category,
			brand,
			collections
		} = newProduct;

		const slug = slugify(name,{ lower: true });

		// Tính toán phần trăm giảm giá nếu có giá giảm giá
		let discountPercentage = 0;
		if (discount && price) {
			discountPercentage = Math.round(((price - discount) / price) * 100);
		}

		const newProductInstance = new Product({
			name,
			mainImage, // Hình ảnh chính của sản phẩm
			image,
			countInStock: Number(countInStock),
			price,
			rating,
			fee,
			category,
			collections,
			brand,
			description,
			discount: Number(discount),
			discountPercentage, // Lưu phần trăm giảm giá
			slug
		});

		const createdProduct = await newProductInstance.save();

		if (createdProduct) {
			await Promise.all([
				Brand.updateOne({ brand_id: brand },{ $inc: { count: 1 } }),
				Category.updateOne({ cate_id: category },{ $inc: { count: 1 } })
			]);

			return handleSuccess(createdProduct,'Tạo sản phẩm thành công');
		}
	} catch (error) {
		return handleError(error,'Lỗi khi tạo sản phẩm');
	}
};

const deleteProduct = async (id) => {
	try {
		const deletedProduct = await Product.findByIdAndDelete(id);
		if (!deletedProduct) {
			return handleError(null,'Không tìm thấy sản phẩm');
		}
		return handleSuccess(null,'Xóa sản phẩm thành công');
	} catch (error) {
		return handleError(error,'Lỗi khi xóa sản phẩm');
	}
};

const deleteManyProduct = async (ids) => {
	try {
		await Product.deleteMany({ _id: { $in: ids } });
		return handleSuccess(null,'Xóa nhiều sản phẩm thành công');
	} catch (error) {
		return handleError(error,'Lỗi khi xóa nhiều sản phẩm');
	}
};

const updateProduct = async (slug,data) => {
	try {
		const updatedProduct = await Product.findOneAndUpdate(
			{ slug },
			{ ...data,category: data.cate_id,brand: data.brand_id },
			{ new: true }
		);
		if (!updatedProduct) {
			return handleError(null,'Không tìm thấy sản phẩm');
		}

		// Kiểm tra nếu countInStock > 0 và gửi email thông báo
		if (data.countInStock > 0) {
			const notifications = await Notification.find({ productId: updatedProduct._id,notified: false });
			for (const notification of notifications) {
				await sendRestockNotification(notification.email,updatedProduct.name);
				notification.notified = true;
				await notification.save();
				// Gửi thông báo cho người dùng
				await NotificationService.sendProductRestockedNotification(notification.userId,updatedProduct._id,updatedProduct.name,updatedProduct.mainImage);
			}
		}
		return handleSuccess(updatedProduct,'Cập nhật sản phẩm thành công');
	} catch (error) {
		return handleError(error,'Lỗi khi cập nhật sản phẩm');
	}
};

const getDetailsProduct = async (slug) => {
	try {
		const product = await Product.findOne({ slug });
		if (!product) {
			return handleError(null,'Không tìm thấy sản phẩm');
		}
		return handleSuccess(product,'Lấy thông tin sản phẩm thành công');
	} catch (error) {
		return handleError(error,'Lỗi khi lấy thông tin sản phẩm');
	}
};

const updateBrandAndCategoryCount = async () => {
	try {
		const brandAggregation = await Product.aggregate([
			{ $group: { _id: '$brand',count: { $sum: 1 } } }
		]);
		const categoryAggregation = await Product.aggregate([
			{ $group: { _id: '$category',count: { $sum: 1 } } }
		]);

		await Promise.all([
			...brandAggregation.map(item => Brand.updateOne({ brand_id: item._id },{ count: item.count })),
			...categoryAggregation.map(item => Category.updateOne({ cate_id: item._id },{ count: item.count }))
		]);

		return handleSuccess(null,'Cập nhật số lượng sản phẩm cho thương hiệu và danh mục thành công');
	} catch (error) {
		return handleError(error,'Lỗi khi cập nhật số lượng sản phẩm cho thương hiệu và danh mục');
	}
};
const getAllProduct = async ({
  collection_slug,
  brand_slug,
  category_slug,
  sort,
  page,
  pageSize,
  minPrice,
  maxPrice,
  keyword
}) => {
  try {
    let query = {};
    let collectionsFilter = [];

    // 1. Xử lý lọc theo collection
    if (collection_slug) {
      const collection = await Collection.findOne({ slug: collection_slug });
      if (collection) {
        query.collections = collection.collection_id;
        collectionsFilter = [{ name: collection.name, description: collection.description }];
      }
    }

    // 2. Xử lý lọc theo brand
    if (brand_slug) {
      const brandArray = brand_slug.split(',');
      const brandIds = await Brand.find({ slug: { $in: brandArray } }).distinct('brand_id');
      query.brand = { $in: brandIds.map(id => Number(id)) }; // Chuyển đổi sang Number nếu cần
    }

    // 3. Xử lý lọc theo category
    if (category_slug) {
      const categoryArray = category_slug.split(',');
      const categoryIds = await Category.find({ slug: { $in: categoryArray } }).distinct('cate_id');
      query.category = { $in: categoryIds.map(id => Number(id)) }; // Chuyển đổi sang Number nếu cần
    }

    // 4. Xử lý lọc theo giá
    if (minPrice !== undefined || maxPrice !== undefined) {
      query.price = {};
      if (minPrice !== undefined) query.price.$gte = minPrice;
      if (maxPrice !== undefined) query.price.$lte = maxPrice;
    }

    // 5. Xử lý tìm kiếm theo keyword
    if (keyword) {
      const keywordRegex = keyword.split(' ').map(word => `(?=.*${word})`).join('');
      query.name = { $regex: new RegExp(keywordRegex, 'i') };
    }

    // 6. Lấy sản phẩm theo query
    const products = await Product.find(query)
      .sort(getSortOption(sort))
      .skip((page - 1) * pageSize)
      .limit(pageSize)
      .populate('brand', 'brand slug brand_id')
      .populate('category', 'category slug cate_id')
      .populate('collections', 'collection slug')
      .lean();

    const totalProducts = await Product.countDocuments(query);

    // 7. Lấy tất cả brand, category và collection nếu không có bộ lọc nào được áp dụng
    let brandsData, categoriesData, collectionsData;

    if (!collection_slug && !brand_slug && !category_slug && !keyword) {
      [brandsData, categoriesData, collectionsData] = await Promise.all([
        Brand.find().select('brand slug brand_id'),
        Category.find().select('category slug cate_id'),
        Collection.find().select('name collection slug description')
      ]);
    } else {
      // Nếu có bộ lọc, chỉ lấy các giá trị liên quan
      const productIds = products.map(p => p._id);
      [brandsData, categoriesData, collectionsData] = await Promise.all([
        Brand.find({ brand_id: { $in: products.map(p => p.brand) } }).select('brand slug brand_id'),
        Category.find({ cate_id: { $in: products.map(p => p.category) } }).select('category slug cate_id'),
        Collection.find({ collection_id: { $in: products.flatMap(p => p.collections) } }).select('name collection slug description image')
      ]);
    }

    // 8. Tính toán số lượng sản phẩm cho mỗi brand, category và collection
    const brandCounts = await getFilterCounts(query, 'brand');
    const categoryCounts = await getFilterCounts(query, 'category');
    const collectionCounts = await getFilterCounts(query, 'collections');

    // 9. Kết hợp thông tin và số lượng
    const brandsWithCount = combineWithCounts(brandsData, brandCounts, 'brand_id');
    const categoriesWithCount = combineWithCounts(categoriesData, categoryCounts, 'cate_id');
    const collectionsWithCount = combineWithCounts(collectionsData, collectionCounts, 'collection_id');

    // 10. Lấy từ khóa tìm kiếm phổ biến
    const searchedKeywords = await getSearchedKeywords(keyword);
 // Thêm mới: Tính toán các mức giá gợi ý
 const suggestedPrices = await getSuggestedPrices(query);
    // 11. Trả về kết quả
    return {
      status: "OK",
      message: "Success",
      data: products,
      pagination: {
        currentPage: Number(page),
        pageSize: Number(pageSize),
        totalPages: Math.ceil(totalProducts / Number(pageSize)),
        totalItems: totalProducts
      },
			collections: collectionsWithCount
			,
      filters: [
        {
          id: "brand",
          title: "Thương hiệu",
          data: brandsWithCount
        },
        {
          id: "category",
          title: "Loại sản phẩm",
          data: categoriesWithCount
        },
        // {
        //   id: "collection",
        //   title: "Bộ sưu tập",
        //   data: collectionsWithCount
        // },
        {
          id: "keyword",
          title: "Từ khóa",
          data: searchedKeywords
        },
				
        {
          id: "price",
          title: "Mức giá",
          data: suggestedPrices
        }
      ]
    };
  } catch (error) {
    console.error('Error in getAllProduct service:', error);
    throw new Error("Error getting products: " + error.message);
  }
};

// Hàm mới để tính toán các mức giá gợi ý
const getSuggestedPrices = async (baseQuery) => {
  const priceStats = await Product.aggregate([
    { $match: baseQuery },
    {
      $group: {
        _id: null,
        minPrice: { $min: "$price" },
        maxPrice: { $max: "$price" }
      }
    }
  ]);

  if (priceStats.length === 0) {
    return [];
  }

  const { minPrice, maxPrice } = priceStats[0];
  const range = maxPrice - minPrice;
  const step = range / 5; // Chia thành 5 khoảng giá

  const suggestedPrices = [];
  for (let i = 0; i < 5; i++) {
    const start = Math.round((minPrice + step * i) / 1000) * 1000; // Làm tròn đến hàng nghìn
    const end = Math.round((minPrice + step * (i + 1)) / 1000) * 1000;
    suggestedPrices.push({
      label: `${formatPrice(start)} - ${formatPrice(end)}`,
      min: start,
      max: end
    });
  }

  return suggestedPrices;
};

// Hàm hỗ trợ để định dạng giá
const formatPrice = (price) => {
  return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(price);
};
// Hàm hỗ trợ để lấy số lượng sản phẩm cho mỗi giá trị của trường filter
const getFilterCounts = async (baseQuery, field) => {
  const counts = await Product.aggregate([
    { $match: baseQuery },
    { $group: { _id: `$${field}`, count: { $sum: 1 } } }
  ]);
  return counts.reduce((acc, curr) => {
    acc[curr._id] = curr.count;
    return acc;
  }, {});
};

// Hàm hỗ trợ để kết hợp thông tin và số lượng
const combineWithCounts = (items, counts, idField) => {
  return items.map(item => ({
    ...item.toObject(),
    count: counts[item[idField]] || 0
  }));
};

// Các hàm hỗ trợ khác (getSortOption, getSearchedKeywords) giữ nguyên

// Hàm hỗ trợ để lấy tùy chọn sắp xếp
const getSortOption = (sort) => {
  switch (sort) {
    case 'price_asc': return { price: 1 };
    case 'price_desc': return { price: -1 };
    case 'newest': return { createdAt: -1 };
    case 'oldest': return { createdAt: 1 };
    case 'best_selling': return { selled: -1 };
    default: return { createdAt: -1, updatedAt: -1 };
  }
};

// Hàm hỗ trợ để lấy từ khóa tìm kiếm phổ biến
const getSearchedKeywords = async (keyword) => {
  const searchedKeywords = await SearchKeyword.find()
    .sort({ count: -1, lastSearched: -1 })
    .limit(5)
    .select('keyword count');

  if (keyword) {
    // Thêm từ khóa hiện tại vào đầu danh sách
    const currentKeywordCount = await Product.countDocuments({ name: { $regex: keyword, $options: 'i' } });
    return [{ name: keyword, count: currentKeywordCount }, ...searchedKeywords];
  }

  return searchedKeywords;
};





const searchProduct = async (filter) => {
	try {
		let query = {};

		// Thêm điều kiện tìm kiếm theo từ khóa
		if (filter) {
			const keywordRegex = filter.split(' ').map(word => `(?=.*${word})`).join('');
			query.name = { $regex: new RegExp(keywordRegex,'i') };
		}

		// Tìm kiếm sản phẩm theo từ khóa và giới hạn kết quả là 4
		const searchResult = await Product.find(query)
			.sort({ createdAt: -1 }) // Sắp xếp theo thời gian tạo mới nhất, bạn có thể thay đổi tiêu chí sắp xếp nếu cần
			.limit(4)
			.populate('brand','brand slug brand_id')
			.populate('category','category slug cate_id')
			.populate('collections','collection slug');

		// Đếm tổng số sản phẩm khớp với từ khóa (không giới hạn)
		const totalProduct = await Product.countDocuments(query);

		return handleSuccess({
			data: searchResult,
			total: totalProduct,
			limitedResultCount: searchResult.length
		});
	} catch (error) {
		return handleError(error,'Lỗi khi tìm kiếm sản phẩm');
	}
};

const getAllType = async (selectedTypes) => {
	try {
		let aggregationPipeline = [
			{ $group: { _id: '$type',count: { $sum: 1 } } }
		];

		if (selectedTypes.length > 0) {
			aggregationPipeline.unshift({
				$match: { type: { $in: selectedTypes } }
			});
		}

		const allType = await Product.aggregate(aggregationPipeline);
		const result = allType.map(type => ({ type: type._id,count: type.count }));

		return handleSuccess(result);
	} catch (error) {
		return handleError(error,'Lỗi khi lấy danh sách loại sản phẩm');
	}
};

const getAllBrand = async (selectedTypes) => {
	console.log("selectedTypes",selectedTypes);
	try {
		if (!Array.isArray(selectedTypes)) {
			throw new Error('Loại sản phẩm được chọn không hợp lệ');
		}

		let aggregationPipeline = [
			{
				$lookup: {
					from: 'brandproducts',
					localField: 'brand',
					foreignField: '_id',
					as: 'brandInfo'
				}
			},
			{ $unwind: '$brandInfo' },
			{
				$group: {
					_id: '$brandInfo.brand',
					count: { $sum: 1 }
				}
			}
		];

		if (selectedTypes.length > 0) {
			aggregationPipeline.unshift({
				$match: { type: { $in: selectedTypes } }
			});
		}

		const allBrands = await Product.aggregate(aggregationPipeline);
		const result = allBrands.map(brand => ({ brand: brand._id,count: brand.count }));

		return handleSuccess(result);
	} catch (error) {
		return handleError(error,'Lỗi khi lấy danh sách thương hiệu');
	}
};

module.exports = {
	createProduct,
	updateProduct,
	getDetailsProduct,
	deleteProduct,
	getAllProduct,
	deleteManyProduct,
	getAllType,
	getAllBrand,
	searchProduct,
	updateBrandAndCategoryCount
};