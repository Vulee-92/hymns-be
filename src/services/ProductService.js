const Product = require("../models/ProductModel");
const Category = require("../models/CateProductModel");
const Brand = require("../models/BrandProductModel");
const Collection = require('../models/CollectionsModel');

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
        Brand.updateOne({ brand_id: brand }, { $inc: { count: 1 } }),
        Category.updateOne({ cate_id: category }, { $inc: { count: 1 } })
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
      { ...data, category: data.cate_id, brand: data.brand_id },
      { new: true }
    );
    if (!updatedProduct) {
      return handleError(null, 'Không tìm thấy sản phẩm');
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

const updateBrandAndCategoryCount = async () => {
  try {
    const brandAggregation = await Product.aggregate([
      { $group: { _id: '$brand', count: { $sum: 1 } } }
    ]);
    const categoryAggregation = await Product.aggregate([
      { $group: { _id: '$category', count: { $sum: 1 } } }
    ]);

    await Promise.all([
      ...brandAggregation.map(item => Brand.updateOne({ brand_id: item._id }, { count: item.count })),
      ...categoryAggregation.map(item => Category.updateOne({ cate_id: item._id }, { count: item.count }))
    ]);

    return handleSuccess(null, 'Cập nhật số lượng sản phẩm cho thương hiệu và danh mục thành công');
  } catch (error) {
    return handleError(error, 'Lỗi khi cập nhật số lượng sản phẩm cho thương hiệu và danh mục');
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
  maxPrice
}) => {
	
  try {
    let query = {};

    if (collection_slug) {
      const collection = await Collection.findOne({ slug: collection_slug });
      if (collection) {
				
        query.collections = collection.collection_id;
      }
    }

    if (brand_slug) {
      const brand = await Brand.findOne({ slug: brand_slug });
      if (brand) {
        query.brand = brand.brand_id; // Sử dụng brand_id thay vì _id
      }
    }

    if (category_slug) {
      const category = await Category.findOne({ slug: category_slug });
      if (category) {
        query.category = category.cate_id; // Sử dụng cate_id thay vì _id
      }
    }

    if (minPrice !== undefined || maxPrice !== undefined) {
      query.price = {};
      if (minPrice !== undefined) query.price.$gte = minPrice;
      if (maxPrice !== undefined) query.price.$lte = maxPrice;
    }

    let sortOption = {};
    switch (sort) {
      case 'price_asc':
        sortOption = { price: 1 };
        break;
      case 'price_desc':
        sortOption = { price: -1 };
        break;
      case 'newest':
        sortOption = { createdAt: -1 };
        break;
      case 'oldest':
        sortOption = { createdAt: 1 };
        break;
      case 'best_selling':
        sortOption = { selled: -1 };
        break;
      default:
        sortOption = { createdAt: -1 };
    }

    const totalProducts = await Product.countDocuments(query);
    const totalPages = Math.ceil(totalProducts / pageSize);

		const products = await Product.find(query)
		.sort(sortOption)
		.skip((page - 1) * pageSize)
		.limit(pageSize)
		.populate('brand', 'brand slug brand_id')
		.populate('category', 'category slug cate_id')
		.populate('collections', 'collection slug')
		.lean();  // Thêm .lean() để chuyển đổi document thành plain JavaScript object
	


    // Lấy danh sách unique brand_id và cate_id từ kết quả tìm kiếm
    const uniqueBrandIds = [...new Set(products.map(product => product.brand).filter(Boolean))];
    const uniqueCategoryIds = [...new Set(products.map(product => product.category).filter(Boolean))];
		const uniqueCollectionIds = [...new Set(products.map(product => product.collections).filter(Boolean))];


    // Đếm tổng số sản phẩm cho mỗi brand và category trong toàn bộ collection
    const brandCounts = await Product.aggregate([
      { $match: { brand: { $in: uniqueBrandIds } } },
      { $group: { _id: "$brand", count: { $sum: 1 } } }
    ]);

    const categoryCounts = await Product.aggregate([
      { $match: { category: { $in: uniqueCategoryIds } } },
      { $group: { _id: "$category", count: { $sum: 1 } } }
    ]);


    // Lấy thông tin chi tiết của các brand và category
    const [brands, categories, collections] = await Promise.all([
      Brand.find({ $or: [
        { brand_id: { $in: uniqueBrandIds.filter(id => typeof id === 'number') } },
        { _id: { $in: uniqueBrandIds.filter(id => typeof id === 'object') } }
      ]}).select('brand slug brand_id'),
      Category.find({ $or: [
        { cate_id: { $in: uniqueCategoryIds.filter(id => typeof id === 'number') } },
        { _id: { $in: uniqueCategoryIds.filter(id => typeof id === 'object') } }
      ]}).select('category slug cate_id'),
			Collection.find({ $or: [
        { collection_id: { $in: uniqueCollectionIds.filter(id => typeof id === 'number') } },
        { _id: { $in: uniqueCollectionIds.filter(id => typeof id === 'object') } }
      ]}).select('collection slug description backgroundImage')
    ]);


    // Kết hợp thông tin chi tiết với số lượng sản phẩm
    const brandsWithCount = brands.map(brand => ({
      ...brand.toObject(),
      count: brandCounts.find(b => b._id.toString() === brand._id.toString() || b._id === brand.brand_id)?.count || 0
    }));

    const categoriesWithCount = categories.map(category => ({
      ...category.toObject(),
      count: categoryCounts.find(c => c._id.toString() === category._id.toString() || c._id === category.cate_id)?.count || 0
    }));

    return {
      status: "OK",
      message: "Success",
      data: products,
      pagination: {
        currentPage: page,
        pageSize,
        totalPages,
        totalItems: totalProducts
      },
      brands: brandsWithCount,
      categories: categoriesWithCount,
      collections
    };
  } catch (error) {
    console.error('Error in getAllProduct service:', error);
    throw new Error("Error getting products: " + error.message);
  }
};




const getAllProductAllowBrand = async (limit,page,sort,type,brand) => {
	try {
		let filter = {};
		let BrandFilter = [];

		// Lọc theo collections
		if (brand) {
			const brandSlug = await Brand.findOne({ slug: brand });
			BrandFilter = [{ name: brandSlug?.brand }]
			if (brandSlug) {
				filter.brand = brandSlug.brand_id;
			}
		}
		// Lấy danh sách các brand và cate từ collections (nếu có)
		let catesFromCollections = [];
		if (filter.brand) {
			const productsInBrand = await Product.find({ brand: filter.brand });

			const brandsId = [...new Set(productsInBrand.map(product => product.brand))];


			catesId = [...new Set(productsInBrand.map(product => product.category))];
			const [brandNames,categoryNames] = await Promise.all([
        Brand.find({ brand_id: { $in: brandsId } }),
        Category.find({ cate_id: { $in: catesId } })
      ]);

      brandsFromCollections = brandNames.map(item => ({ slug: item.slug, brand: item.brand, count: item.count }));
      catesFromCollections = categoryNames.map(item => ({ slug: item.slug, category: item.category, count: item.count }));
    }

    return handleSuccess({
      data: allProduct,
      total: totalProduct,
      pageCurrent: page + 1,
      totalPage: Math.ceil(totalProduct / limit),
      brands: brandsFromCollections,
      categories: catesFromCollections,
      collections: filter.collections ? [{ name: collectionsSlug.name, description: collectionsSlug.description }] : []
    });
  } catch (error) {
    return handleError(error, 'Lỗi khi lấy danh sách sản phẩm');
  }
};

const searchProduct = async (filter) => {
  console.log("filter", filter);
  try {
    // Tạo chỉ mục văn bản trên trường 'name' nếu chưa có
    await Product.collection.createIndex({ name: 'text' });

    // Tìm kiếm sản phẩm theo từ khóa
    const searchResult = await Product.find(
      { $text: { $search: filter } },
      { score: { $meta: 'textScore' } }
    ).sort({ score: { $meta: 'textScore' } });

    // Đếm tổng số sản phẩm khớp với từ khóa
    const totalProduct = await Product.countDocuments({ $text: { $search: filter } });

    return handleSuccess({
      data: searchResult,
      total: totalProduct,
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
    const result = allBrands.map(brand => ({ brand: brand._id, count: brand.count }));

    return handleSuccess(result);
  } catch (error) {
    return handleError(error, 'Lỗi khi lấy danh sách thương hiệu');
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