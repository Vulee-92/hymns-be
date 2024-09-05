const Product = require("../models/ProductModel");
const Category = require("../models/CateProductModel");
const Brand = require("../models/BrandProductModel");
const Collections = require("../models/CollectionsModel");
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

const getAllProduct = async (limit, page, sort, vendor, type, collections) => {
  try {
	  // Gán giá trị mặc định cho limit và page nếu không có giá trị truyền vào
	  limit = Number(limit) || 10; // Mặc định hiển thị 10 sản phẩm mỗi trang
	  page = Number(page) || 0; // Mặc định trang đầu tiên là 0
  
	  let filter = {};
	  let collectionsFilter = [];
  
	  // Lọc theo collections
    if (collections) {
      const collectionsSlug = await Collections.findOne({ slug: collections });
			collectionsFilter = [{ name: collectionsSlug?.name,description: collectionsSlug?.description }]
      if (collectionsSlug) {
        filter.collections = collectionsSlug.collection_id;
      }
    }
		// Lấy danh sách các brand và cate từ collections (nếu có)
	  let brandsFromCollections = [];
	  let catesFromCollections = [];
	  if (filter.collections) {
		const productsInCollection = await Product.find({ collections: filter.collections });
  
			const brandsId = [...new Set(productsInCollection.map(product => product.brand))];
  
			// const categoryName = await Brand.find({ brand_id: brandsId });

			catesId = [...new Set(productsInCollection.map(product => product.category))];
			const [brandNames,categoryNames] = await Promise.all([
		  Brand.find({ brand_id: { $in: brandsId } }),
		  Category.find({ cate_id: { $in: catesId } })
		]);
			// const cateName = await Category.find({ cate_id: catesId })
			brandsFromCollections = brandNames.map(item => ({ slug: item.slug,brand: item.brand,count: item.count }));
			catesFromCollections = categoryNames.map(item => ({ slug: item.slug,category: item.category,count: item.count }));
	  }
  
	  // Lọc theo vendor
	  if (vendor && vendor.length > 0) {
		const brandArray = vendor.split(',');
		const brandIds = await Brand.find({ slug: { $in: brandArray } }).distinct('brand_id');
      filter.brand = { $in: brandIds };
    }

	  // Lọc theo type
	  if (type && type.length > 0) {
		const categoryArray = type.split(',');
		const categoryIds = await Category.find({ slug: { $in: categoryArray } }).distinct('cate_id');
      filter.category = { $in: categoryIds };
    }
		// Lọc theo type
		if (type && type.length > 0) {
			const categoryArray = type.split(',');
			const categoryIds = await Category.find({ slug: { $in: categoryArray } }).distinct('cate_id');
			filter.category = { $in: categoryIds };
  
		}
	  // Truy vấn dữ liệu với các điều kiện lọc và sắp xếp
		let query = Product.find(filter).sort({ createdAt: -1,updatedAt: -1 });
  
	  // Áp dụng phân trang nếu có
		if (limit) {
	  query = query.limit(limit).skip(page * limit);
		}
  

    if (vendor && vendor.length > 0) {
      const brandArray = vendor.split(',');
      const brandIds = await Brand.find({ slug: { $in: brandArray } }).distinct('brand_id');
      filter.brand = { $in: brandIds };
    }
    
    if (type && type.length > 0) {
      const categoryArray = type.split(',');
      const categoryIds = await Category.find({ slug: { $in: categoryArray } }).distinct('cate_id');
      filter.category = { $in: categoryIds };
    }
    
    const sortOptions = sort ? { [sort]: -1 } : { createdAt: -1, updatedAt: -1 };
    
    const limitNumber = Number(limit) || 10;
    const pageNumber = Number(page) || 0;
    
    const [allProduct, totalProduct] = await Promise.all([
      Product.find(filter)
        .sort(sortOptions)
        .limit(limitNumber)
        .skip(pageNumber * limitNumber),
      Product.countDocuments(filter)
    ]);



		if (filter.collections && vendor) {
			const productsInCollection = await Product.find({ collections: filter.collections,brand: filter.brand });

			const categoriesId = [...new Set(productsInCollection.map(product => product.category))];
			const cateName = await Category.find({ cate_id: { $in: categoriesId } });
			catesFromCollections = cateName.map(item => ({ slug: item.slug,category: item.category,count: item.count }));
		} else if (filter.collections && type) {
			const productsInCollection = await Product.find({ collections: filter.collections,category: filter.category });

      const brandsId = [...new Set(productsInCollection.map(product => product.brand))];
			const brandName = await Brand.find({ brand_id: { $in: brandsId } });
			brandsFromCollections = brandName.map(item => ({ slug: item.slug,brand: item.brand,count: item.count }));
		}
		// await updateProductsInCates();
		// await updateProductsInBrands();
		// Update brand count
		// await updateBrandAndCategoryCount();
		// Gọi hàm để cập nhật sản phẩm
	  return {
		status: "OK",
		message: "Success",
		data: allProduct,
		total: totalProduct,
			pageCurrent: Number(page) + 1,
			totalPage: Math.ceil(totalProduct / Number(limit) || 1),
		brands: brandsFromCollections,
		categories: catesFromCollections,
		collections: collectionsFilter
	  };
	} catch (e) {
	  throw e;
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