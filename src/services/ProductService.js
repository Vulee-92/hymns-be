const Product = require("../models/ProductModel");
const Category = require("../models/CateProductModel");
const Brand = require("../models/BrandProductModel");
const Collection = require('../models/CollectionsModel');
const Combo = require('../models/ComboModel');
const Notification = require('../models/NotificationProductModel');
const { sendEmailNotification, sendRestockNotification } = require('./EmailProductNotificationService');
const NotificationService = require('./NotificationService');
const SearchKeyword = require('../models/SearchKeywordModel');
const slugify = require('slugify');

// Hàm tiện ích để xử lý lỗi
const handleError = (error, message = 'Đã xảy ra lỗi') => {
  console.error(message, error);
  return { status: 'ERR', message: message };
};

// Hàm tiện ích để trả về kết quả thành công
const handleSuccess = (data, message = 'Thành công') => {
  return { status: 'OK', message, data };
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

    const slug = slugify(name, { lower: true });

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
        Brand.updateOne({ _id: brand }, { $inc: { count: 1 } }),
        Category.updateOne({ _id: category }, { $inc: { count: 1 } })
      ]);

      return handleSuccess(createdProduct, 'Tạo sản phẩm thành công');
    }
  } catch (error) {
    return handleError(error, 'Lỗi khi tạo sản phẩm');
  }
};

const deleteProduct = async (id) => {
  try {
    const deletedProduct = await Product.findByIdAndDelete(id);
    if (!deletedProduct) {
      return handleError(null, 'Không tìm thấy sản phẩm');
    }
    return handleSuccess(null, 'Xóa sản phẩm thành công');
  } catch (error) {
    return handleError(error, 'Lỗi khi xóa sản phẩm');
  }
};

const deleteManyProduct = async (ids) => {
  try {
    await Product.deleteMany({ _id: { $in: ids } });
    return handleSuccess(null, 'Xóa nhiều sản phẩm thành công');
  } catch (error) {
    return handleError(error, 'Lỗi khi xóa nhiều sản phẩm');
  }
};

const updateProduct = async (slug, data) => {
  try {
    const updatedProduct = await Product.findOneAndUpdate(
      { slug },
      { ...data, category: data.category, brand: data.brand },
      { new: true }
    );
    if (!updatedProduct) {
      return handleError(null, 'Không tìm thấy sản phẩm');
    }

    // Kiểm tra nếu countInStock > 0 và gửi email thông báo
    if (data.countInStock > 0) {
      const notifications = await Notification.find({ productId: updatedProduct._id, notified: false });
      for (const notification of notifications) {
        await sendRestockNotification(notification.email, updatedProduct.name);
        notification.notified = true;
        await notification.save();
        // Gửi thông báo cho người dùng
        await NotificationService.sendProductRestockedNotification(notification.userId, updatedProduct._id, updatedProduct.name, updatedProduct.mainImage);
      }
    }
    return handleSuccess(updatedProduct, 'Cập nhật sản phẩm thành công');
  } catch (error) {
    return handleError(error, 'Lỗi khi cập nhật sản phẩm');
  }
};

const getDetailsProduct = async (slug) => {
  try {
    const product = await Product.findOne({ slug });
    if (!product) {
      return handleError(null, 'Không tìm thấy sản phẩm');
    }
    return handleSuccess(product, 'Lấy thông tin sản phẩm thành công');
  } catch (error) {
    return handleError(error, 'Lỗi khi lấy thông tin sản phẩm');
  }
};
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
  const getFilterCounts = async (query, field) => {
	const aggregationPipeline = [
	  { $match: query },
	  { $group: { _id: `$${field}`, count: { $sum: 1 } } }
	];
  
	const counts = await Product.aggregate(aggregationPipeline);
	return counts.reduce((acc, item) => {
	  acc[item._id] = item.count;
	  return acc;
	}, {});
  };
  const combineWithCounts = (items, counts, key) => {
	return items.map(item => ({
	  ...item._doc,
	  count: counts[item[key]] || 0
	}));
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
      let productQuery = {};
      let comboQuery = {};
      let collectionsFilter = [];
  
      // 1. Xử lý lọc theo collection
      if (collection_slug) {
        const collection = await Collection.findOne({ slug: collection_slug });
				console.log("collection", collection);
        if (collection) {
          productQuery.collections = collection._id;
          comboQuery.collection = collection._id;
          collectionsFilter = [{ name: collection.name, description: collection.description }];
        }
      }
  
      // 2. Xử lý lọc theo brand
      if (brand_slug) {
        const brandArray = brand_slug.split(',');
        const brandIds = await Brand.find({ slug: { $in: brandArray } }).distinct('_id');
        productQuery.brand = { $in: brandIds };
        comboQuery.brand = { $in: brandIds };
      }
  
      // 3. Xử lý lọc theo category
      if (category_slug) {
        const categoryArray = category_slug.split(',');
        const categoryIds = await Category.find({ slug: { $in: categoryArray } }).distinct('_id');
        productQuery.category = { $in: categoryIds };
        comboQuery.category = { $in: categoryIds };
      }
  
      // 4. Xử lý lọc theo giá
      if (minPrice !== undefined || maxPrice !== undefined) {
        productQuery.price = {};
        comboQuery.comboPrice = {};
        if (minPrice !== undefined) {
          productQuery.price.$gte = minPrice;
          comboQuery.comboPrice.$gte = minPrice;
        }
        if (maxPrice !== undefined) {
          productQuery.price.$lte = maxPrice;
          comboQuery.comboPrice.$lte = maxPrice;
        }
      }
  
      // 5. Xử lý tìm kiếm theo keyword
      if (keyword) {
        const keywordRegex = keyword.split(' ').map(word => `(?=.*${word})`).join('');
        productQuery.name = { $regex: new RegExp(keywordRegex, 'i') };
        comboQuery.name = { $regex: new RegExp(keywordRegex, 'i') };
      }
  
      // 6. Lấy sản phẩm theo query
      const products = await Product.find(productQuery)
        .sort(getSortOption(sort))
        .skip((page - 1) * pageSize)
        .limit(pageSize)
        .populate('brand', 'brand slug')
        .populate('category', 'category slug')
        .populate('collections', 'name slug');
  
      const totalProducts = await Product.countDocuments(productQuery);
  
      // 7. Lấy combo theo query
      const combos = await Combo.find(comboQuery)
        .sort(getSortOption(sort))
        .skip((page - 1) * pageSize)
        .limit(pageSize)
        .populate('products.product')
        .populate('collections')
        .populate('brand')
        .populate('category');
  
      const totalCombos = await Combo.countDocuments(comboQuery);
  
      // 8. Kết hợp sản phẩm và combo
      const combinedResults = [...products, ...combos];
  
      // 9. Lấy tất cả brand, category và collection nếu không có bộ lọc nào được áp dụng
      let brandsData, categoriesData, collectionsData;
      if (!collection_slug && !brand_slug && !category_slug && !keyword) {
        [brandsData, categoriesData, collectionsData] = await Promise.all([
          Brand.find().select('brand slug'),
          Category.find().select('category slug'),
          Collection.find().select('name slug description')
        ]);
      } else {
        // Nếu có bộ lọc, chỉ lấy các giá trị liên quan
        const productIds = products.map(p => p._id);
        const comboIds = combos.map(c => c._id);
        [brandsData, categoriesData, collectionsData] = await Promise.all([
          Brand.find({ _id: { $in: products.map(p => p.brand) } }).select('brand slug'),
          Category.find({ _id: { $in: products.map(p => p.category) } }).select('category slug'),
          Collection.find({ _id: { $in: products.flatMap(p => p.collections) } }).select('name slug description image backgroundImage')
        ]);
      }
  
      // 10. Tính toán số lượng sản phẩm cho mỗi brand, category và collection
      const brandCounts = await getFilterCounts(productQuery, 'brand');
      const categoryCounts = await getFilterCounts(productQuery, 'category');
      const collectionCounts = await getFilterCounts(productQuery, 'collections');
			console.log("collectionCounts",collectionCounts);
      // 11. Kết hợp thông tin và số lượng
      const brandsWithCount = combineWithCounts(brandsData, brandCounts, '_id');
      const categoriesWithCount = combineWithCounts(categoriesData, categoryCounts, '_id');
      const collectionsWithCount = combineWithCounts(collectionsData, collectionCounts, '_id');
  
      // 12. Lấy từ khóa tìm kiếm phổ biến
      const searchedKeywords = await getSearchedKeywords(keyword);
  
      // 13. Trả về kết quả
      return {
        status: "OK",
        message: "Success",
        data: combinedResults,
        pagination: {
          currentPage: Number(page),
          pageSize: Number(pageSize),
          totalPages: Math.ceil((totalProducts + totalCombos) / Number(pageSize)),
          totalItems: totalProducts + totalCombos
        },
        collections: collection_slug ? collectionsWithCount.filter(collection => collection.slug === collection_slug) : collectionsWithCount,
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
          {
            id: "collection",
            title: "Bộ sưu tập",
            data: collectionsWithCount
          },
          {
            id: "keyword",
            title: "Từ khóa",
            data: searchedKeywords
          }
        ]
      };
    } catch (error) {
      return handleError(error, 'Lỗi khi lấy danh sách sản phẩm');
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
      query.name = { $regex: new RegExp(keywordRegex, 'i') };
    }

    // Tìm kiếm sản phẩm theo từ khóa và giới hạn kết quả là 4
    const searchResult = await Product.find(query)
      .sort({ createdAt: -1 }) // Sắp xếp theo thời gian tạo mới nhất, bạn có thể thay đổi tiêu chí sắp xếp nếu cần
      .limit(4)
      .populate('brand', 'brand slug')
      .populate('category', 'category slug')
      .populate('collections', 'name slug');

    // Đếm tổng số sản phẩm khớp với từ khóa (không giới hạn)
    const totalProduct = await Product.countDocuments(query);

    return handleSuccess({
      data: searchResult,
      total: totalProduct,
      limitedResultCount: searchResult.length
    });
  } catch (error) {
    return handleError(error, 'Lỗi khi tìm kiếm sản phẩm');
  }
};

const getAllType = async (selectedTypes) => {
  try {
    let aggregationPipeline = [
      { $group: { _id: '$type', count: { $sum: 1 } } }
    ];

    if (selectedTypes.length > 0) {
      aggregationPipeline.unshift({
        $match: { type: { $in: selectedTypes } }
      });
    }

    const allType = await Product.aggregate(aggregationPipeline);
    const result = allType.map(type => ({ type: type._id, count: type.count }));

    return handleSuccess(result);
  } catch (error) {
    return handleError(error, 'Lỗi khi lấy danh sách loại sản phẩm');
  }
};

const getAllBrand = async (selectedTypes) => {
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
    const result = allBrands.map(brand => ({ brand: brand._id, count: brand.count }));

    return handleSuccess(result);
  } catch (error) {
    return handleError(error, 'Lỗi khi lấy danh sách thương hiệu');
  }
};

const updateAllProductsBrand = async () => {
  try {
    const products = await Product.find();
    for (const product of products) {
      const brand = await Brand.findOne({ brand_id: product.brand });
      if (brand) {
        product.brand = brand._id;
        await product.save();
      }
    }
    return handleSuccess(null, 'Cập nhật tất cả sản phẩm thành công');
  } catch (error) {
    return handleError(error, 'Lỗi khi cập nhật tất cả sản phẩm');
  }
};

// Hàm lấy thông tin chi tiết sản phẩm
  // Hàm lấy tất cả sản phẩm theo thương hiệu
  const getAllProductAllowBrand = async (brandSlug, queryOptions) => {
	try {
	  const { limit = 10, page = 1, sort, type } = queryOptions;
  
	  const query = {};
	  if (brandSlug) {
		const brandDoc = await Brand.findOne({ slug: brandSlug });
		if (brandDoc) {
		  query.brand = brandDoc._id;
		}
	  }
	  if (type) {
		query.type = type;
	  }
  
	  const sortOption = getSortOption(sort);
  
	  const products = await Product.find(query)
		.sort(sortOption)
		.skip((page - 1) * limit)
		.limit(Number(limit))
		.populate('brand', 'name')
		.populate('category', 'name')
		.populate('collections', 'name');
  
	  const totalItems = await Product.countDocuments(query);
  
	  return {
		data: products,
		pagination: {
		  currentPage: Number(page),
		  pageSize: Number(limit),
		  totalPages: Math.ceil(totalItems / limit),
		  totalItems,
		},
	  };
	} catch (error) {
	  throw error;
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
  updateAllProductsBrand,
  getDetailsProduct,
  getAllProductAllowBrand
};