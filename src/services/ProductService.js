const Product = require("../models/ProductModel");
const Category = require("../models/CateProductModel");
const Brand = require("../models/BrandProductModel");
const Collections = require("../models/CollectionsModel");
const slugify = require('slugify');
const logger = require('../utils/logger');
const { encrypt } = require('../utils/encryption');

const handleResponse = (data) => {
  if (process.env.NODE_ENV === 'production') {
    return { encryptedData: encrypt(JSON.stringify(data)) };
  }
  return data;
};

const createProduct = async (newProduct) => {
  try {
    const { name, image, countInStock, price, rating, description, discount, fee, category, brand, collections } = newProduct;
    logger.info("Creating new product:", { name });

    const slug = slugify(name, { lower: true });
    const newProductInstance = new Product({
      name,
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
      slug,
    });

    const createdProduct = await newProductInstance.save();

    if (createdProduct) {
      await Promise.all([
        Brand.updateOne({ brand_id: brand }, { $inc: { count: 1 } }),
        Category.updateOne({ cate_id: category }, { $inc: { count: 1 } })
      ]);

      return handleResponse({
        status: 'OK',
        message: 'SUCCESS',
        data: createdProduct,
      });
    }
  } catch (error) {
    logger.error("Error creating product:", error);
    throw error;
  }
};

const updateProduct = async (slug, data) => {
  try {
    const product = await Product.findOne({ slug });
    if (!product) {
      return handleResponse({
        status: "ERR",
        message: "The product is not defined",
      });
    }

    const updatedProduct = await Product.findOneAndUpdate(
      { slug },
      { ...data, category: data.cate_id, brand: data.brand_id },
      { new: true }
    );

    return handleResponse({
      status: "OK",
      message: "SUCCESS",
      data: updatedProduct,
    });
  } catch (error) {
    logger.error("Error updating product:", error);
    throw error;
  }
};

const getDetailsProduct = async (idSlug) => {
  try {
    const product = await Product.findOne({ slug: idSlug });
    if (!product) {
      return handleResponse({
        status: "ERR",
        message: "The product is not defined",
      });
    }
    return handleResponse({
      status: 'OK',
      message: 'SUCCESS',
      data: product,
    });
  } catch (error) {
    logger.error("Error getting product details:", error);
    throw error;
  }
};

const deleteProduct = async (id) => {
  try {
    const product = await Product.findById(id);
    if (!product) {
      return handleResponse({
        status: "ERR",
        message: "The product is not defined",
      });
    }

    await Product.findByIdAndDelete(id);
    return handleResponse({
      status: "OK",
      message: "Delete product success",
    });
  } catch (error) {
    logger.error("Error deleting product:", error);
    throw error;
  }
};

const getAllProduct = async (limit, page, sort, vendor, type, collections) => {
  try {
    let filter = {};
    let collectionsFilter = [];

    if (collections) {
      const collectionsSlug = await Collections.findOne({ slug: collections });
      if (collectionsSlug) {
        filter.collections = collectionsSlug.collection_id;
        collectionsFilter = [{ name: collectionsSlug.name, description: collectionsSlug.description }];
      }
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

    const [brandsFromCollections, catesFromCollections] = await Promise.all([
      getBrandsFromCollections(filter),
      getCategoriesFromCollections(filter)
    ]);

    return handleResponse({
      status: "OK",
      message: "Success",
      data: allProduct,
      total: totalProduct,
      pageCurrent: pageNumber + 1,
      totalPage: Math.ceil(totalProduct / limitNumber),
      brands: brandsFromCollections,
      categories: catesFromCollections,
      collections: collectionsFilter
    });
  } catch (error) {
    logger.error("Error getting all products:", error);
    throw error;
  }
};

const deleteManyProduct = async (ids) => {
  try {
    await Product.deleteMany({ _id: { $in: ids } });
    return handleResponse({
      status: "OK",
      message: "Delete products success",
    });
  } catch (error) {
    logger.error("Error deleting multiple products:", error);
    throw error;
  }
};

const getAllType = async (selectedTypes) => {
  try {
    let aggregationPipeline = [
      {
        $group: {
          _id: "$type",
          count: { $sum: 1 },
        },
      },
    ];

    if (selectedTypes && selectedTypes.length > 0) {
      aggregationPipeline.unshift({
        $match: {
          type: { $in: selectedTypes },
        },
      });
    }

    const allType = await Product.aggregate(aggregationPipeline);

    const result = allType.map((type) => ({
      type: type._id,
      count: type.count,
    }));

    return handleResponse({
      status: "OK",
      message: "Success",
      data: result,
    });
  } catch (error) {
    logger.error("Error getting all types:", error);
    throw error;
  }
};

const getAllBrand = async (selectedTypes) => {
  try {
    let aggregationPipeline = [];

    if (selectedTypes && selectedTypes.length > 0) {
      aggregationPipeline.push({
        $match: {
          type: { $in: selectedTypes },
        },
      });
    }

    aggregationPipeline.push(
      {
        $lookup: {
          from: 'brandproducts',
          localField: 'brand',
          foreignField: '_id',
          as: 'brandInfo',
        },
      },
      { $unwind: '$brandInfo' },
      {
        $group: {
          _id: '$brandInfo.brand',
          count: { $sum: 1 },
        },
      }
    );

    const allBrands = await Product.aggregate(aggregationPipeline);

    const result = allBrands.map((brand) => ({
      brand: brand._id,
      count: brand.count,
    }));

    return handleResponse({
      status: 'OK',
      message: 'Success',
      data: result,
    });
  } catch (error) {
    logger.error("Error getting all brands:", error);
    throw error;
  }
};

const searchProduct = async (filter) => {
  try {
    const keywords = filter.split(' ');
    const regexArray = keywords.map(keyword => new RegExp(keyword, 'i'));
    const combinedRegex = regexArray.map(regex => `(?=.*${regex.source})`).join('');
    const searchResult = await Product.find({ name: { '$regex': `^${combinedRegex}.*$`, $options: 'i' } })
      .sort({ createdAt: -1, updatedAt: -1 });

    return handleResponse({
      status: 'OK',
      message: 'Success',
      data: searchResult,
      total: await Product.countDocuments(),
    });
  } catch (error) {
    logger.error("Error searching products:", error);
    throw error;
  }
};

const getAllProductAllowBrand = async (limit, page, sort, type, brand) => {
  try {
    let filter = {};
    let BrandFilter = [];

    if (brand) {
      const brandSlug = await Brand.findOne({ slug: brand });
      if (brandSlug) {
        filter.brand = brandSlug.brand_id;
        BrandFilter = [{ name: brandSlug.brand }];
      }
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

    const catesFromCollections = await getCategoriesFromCollections(filter);

    return handleResponse({
      status: "OK",
      message: "Success",
      data: allProduct,
      total: totalProduct,
      pageCurrent: pageNumber + 1,
      totalPage: Math.ceil(totalProduct / limitNumber),
      categories: catesFromCollections,
      brand: BrandFilter
    });
  } catch (error) {
    logger.error("Error getting all products allowed by brand:", error);
    throw error;
  }
};

// Helper functions
const getBrandsFromCollections = async (filter) => {
  if (!filter.collections) return [];
  const productsInCollection = await Product.find({ collections: filter.collections });
  const brandsId = [...new Set(productsInCollection.map(product => product.brand))];
  const brandNames = await Brand.find({ brand_id: { $in: brandsId } });
  return brandNames.map(item => ({ slug: item.slug, brand: item.brand, count: item.count }));
};

const getCategoriesFromCollections = async (filter) => {
  if (!filter.collections && !filter.brand) return [];
  const query = filter.collections ? { collections: filter.collections } : { brand: filter.brand };
  const productsInCollection = await Product.find(query);
  const catesId = [...new Set(productsInCollection.map(product => product.category))];
  const categoryNames = await Category.find({ cate_id: { $in: catesId } });
  return categoryNames.map(item => ({ slug: item.slug, category: item.category, count: item.count }));
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
  getAllProductAllowBrand
};