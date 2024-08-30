const Product = require("../models/ProductModel");
const Category = require("../models/CateProductModel");
const Brand = require("../models/BrandProductModel");
const Collections = require("../models/CollectionsModel");
const slugify = require('slugify');
const logger = require('../utils/logger');
const { encrypt } = require('../utils/encryption');

const handleResponse = (data) => {
  if (process.env.NODE_ENV === 'production') {
    console.log('Encrypting data for production environment');
    return { encryptedData: encrypt(JSON.stringify(data)) };
  } else {
    console.log('Returning unencrypted data for non-production environment');
    return data;
  }
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

const deleteProduct = async (id) => {
  try {
    const product = await Product.findById(id);
    if (!product) {
      return handleResponse({
        status: "ERR",
        message: "Product not found",
      });
    }

    await Product.findByIdAndDelete(id);
    return handleResponse({
      status: "OK",
      message: "Product deleted successfully",
    });
  } catch (error) {
    logger.error("Error deleting product:", error);
    throw error;
  }
};

const deleteManyProduct = async (ids) => {
  try {
    await Product.deleteMany({ _id: { $in: ids } });
    return handleResponse({
      status: "OK",
      message: "Products deleted successfully",
    });
  } catch (error) {
    logger.error("Error deleting multiple products:", error);
    throw error;
  }
};

const updateProduct = async (slug, data) => {
  try {
    const product = await Product.findOne({ slug });
    if (!product) {
      return handleResponse({
        status: "ERR",
        message: "Product not found",
      });
    }

    const updatedProduct = await Product.findOneAndUpdate(
      { slug },
      { ...data, category: data.cate_id, brand: data.brand_id },
      { new: true }
    );

    return handleResponse({
      status: "OK",
      message: "Product updated successfully",
      data: updatedProduct,
    });
  } catch (error) {
    logger.error("Error updating product:", error);
    throw error;
  }
};

const getDetailsProduct = async (slug) => {
  try {
    const product = await Product.findOne({ slug });
    if (!product) {
      return handleResponse({
        status: "ERR",
        message: "Product not found",
      });
    }
    return handleResponse({
      status: 'OK',
      message: 'Success',
      data: product,
    });
  } catch (error) {
    logger.error("Error fetching product details:", error);
    throw error;
  }
};

const getAllProduct = async (limit, page, sort, vendor, type, collections) => {
  try {
    const filter = {};
    let collectionsFilter = [];

    const limitNumber = parseInt(limit) || 10;
    const pageNumber = parseInt(page) || 0;

    if (collections) {
      const collectionsSlug = await Collections.findOne({ slug: collections });
      if (collectionsSlug) {
        filter.collections = collectionsSlug.collection_id;
        collectionsFilter = [{ name: collectionsSlug.name, description: collectionsSlug.description }];
      }
    }

    if (vendor) {
      const brandIds = await Brand.find({ slug: { $in: vendor.split(',') } }).distinct('brand_id');
      filter.brand = { $in: brandIds };
    }

    if (type) {
      const categoryIds = await Category.find({ slug: { $in: type.split(',') } }).distinct('cate_id');
      filter.category = { $in: categoryIds };
    }

    let sortQuery = { createdAt: -1, updatedAt: -1 };
    if (sort) {
      const [field, order] = sort.split('_');
      sortQuery = { [field]: order === 'asc' ? 1 : -1 };
    }

    const totalProduct = await Product.countDocuments(filter);
    const totalPage = Math.ceil(totalProduct / limitNumber);

    const products = await Product.find(filter)
      .sort(sortQuery)
      .skip(pageNumber * limitNumber)
      .limit(limitNumber);

    const brandsFromCollections = await getBrandsFromCollections(filter);
    const catesFromCollections = await getCategoriesFromCollections(filter);

    const appliedFilters = {
      type: type ? type.split(',') : [],
      vendor: vendor ? vendor.split(',') : [],
      collections: collections ? [collections] : []
    };

    return handleResponse({
      status: "OK",
      message: "Success",
      data: products,
      total: totalProduct,
      pageCurrent: pageNumber + 1,
      totalPage: totalPage,
      brands: brandsFromCollections,
      categories: catesFromCollections,
      collections: collectionsFilter,
      appliedFilters,
      limit: limitNumber
    });
  } catch (error) {
    logger.error("Error fetching all products:", error);
    throw error;
  }
};

const getBrandsFromCollections = async (filter) => {
  if (!filter.collections) return [];
  const productsInCollection = await Product.find({ collections: filter.collections });
  const brandsId = [...new Set(productsInCollection.map(product => product.brand))];
  const brandNames = await Brand.find({ brand_id: { $in: brandsId } });
  return brandNames.map(item => ({ slug: item.slug, brand: item.brand, count: item.count }));
};

const getCategoriesFromCollections = async (filter) => {
  if (!filter.collections) return [];
  const productsInCollection = await Product.find({ collections: filter.collections });
  const catesId = [...new Set(productsInCollection.map(product => product.category))];
  const categoryNames = await Category.find({ cate_id: { $in: catesId } });
  return categoryNames.map(item => ({ slug: item.slug, category: item.category, count: item.count }));
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

const getAllBrand = async (selectedTypes) => {
  try {
    let aggregationPipeline = [];

    if (selectedTypes && selectedTypes.length > 0) {
      aggregationPipeline.push({
        $match: { type: { $in: selectedTypes } },
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

    return handleResponse({
      status: 'OK',
      message: 'Success',
      data: allBrands.map(brand => ({
        brand: brand._id,
        count: brand.count,
      })),
    });
  } catch (error) {
    logger.error("Error fetching all brands:", error);
    throw error;
  }
};

// Thêm các hàm khác như getAllType, getAllProductAllowBrand ở đây nếu cần

module.exports = {
  createProduct,
  updateProduct,
  getDetailsProduct,
  deleteProduct,
  getAllProduct,
  deleteManyProduct,
  getAllBrand,
  searchProduct,
  // Thêm các hàm khác vào đây nếu cần
};