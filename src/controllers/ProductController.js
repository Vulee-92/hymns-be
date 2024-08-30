const ProductService = require("../services/ProductService");
const logger = require("../utils/logger"); // Giả sử bạn đã cài đặt một hệ thống logging

const createProduct = async (req, res) => {
  try {
    const { name, image, countInStock, price, collection, rating, discount, category, brand } = req.body;

    const requiredFields = ['name', 'image', 'price', 'category', 'brand'];
    const missingFields = requiredFields.filter(field => !req.body[field]);

    if (missingFields.length > 0) {
      return res.status(400).json({
        status: "ERR",
        message: `Missing required fields: ${missingFields.join(', ')}`,
      });
    }

    const response = await ProductService.createProduct(req.body);
    logger.info(`Product created: ${name}`);
    return res.status(201).json(response);
  } catch (e) {
    logger.error('Error in createProduct:', e);
    return res.status(500).json({
      status: "ERR",
      message: e.message || "Internal Server Error",
    });
  }
};

const updateProduct = async (req, res) => {
  try {
    const productIdSlug = req.params.id;
    const data = req.body;
    if (!productIdSlug) {
      return res.status(400).json({
        status: "ERR",
        message: "The productId is required",
      });
    }

    const response = await ProductService.updateProduct(productIdSlug, data);
    logger.info(`Product updated: ${productIdSlug}`);
    return res.status(200).json(response);
  } catch (e) {
    logger.error('Error in updateProduct:', e);
    return res.status(500).json({
      status: "ERR",
      message: e.message || "Internal Server Error",
    });
  }
};

const getDetailsProduct = async (req, res) => {
  try {
    const productIdSlug = req.params.id;
    if (!productIdSlug) {
      return res.status(400).json({
        status: "ERR",
        message: "The productId is required",
      });
    }
    const response = await ProductService.getDetailsProduct(productIdSlug);
    return res.status(200).json(response);
  } catch (e) {
    logger.error('Error in getDetailsProduct:', e);
    return res.status(500).json({
      status: "ERR",
      message: e.message || "Internal Server Error",
    });
  }
};

const deleteProduct = async (req, res) => {
  try {
    const productId = req.params.id;
    if (!productId) {
      return res.status(400).json({
        status: "ERR",
        message: "The productId is required",
      });
    }
    const response = await ProductService.deleteProduct(productId);
    logger.info(`Product deleted: ${productId}`);
    return res.status(200).json(response);
  } catch (e) {
    logger.error('Error in deleteProduct:', e);
    return res.status(500).json({
      status: "ERR",
      message: e.message || "Internal Server Error",
    });
  }
};

const deleteMany = async (req, res) => {
  try {
    const ids = req.body.ids;
    if (!ids || !Array.isArray(ids) || ids.length === 0) {
      return res.status(400).json({
        status: "ERR",
        message: "Valid ids array is required",
      });
    }
    const response = await ProductService.deleteManyProduct(ids);
    logger.info(`Multiple products deleted: ${ids.join(', ')}`);
    return res.status(200).json(response);
  } catch (e) {
    logger.error('Error in deleteMany:', e);
    return res.status(500).json({
      status: "ERR",
      message: e.message || "Internal Server Error",
    });
  }
};

// Trong ProductController.js
const getAllProduct = async (req, res) => {
  try {
    const result = await ProductService.getAllProduct(
      req.query.limit,
      req.query.page,
      req.query.sort,
      req.query.vendor,
      req.query.type,
      req.params.collections
    );

    if (result.encryptedData) {
      // Dữ liệu đã được mã hóa (môi trường production)
      res.json({ encryptedData: result.encryptedData });
    } else {
      // Dữ liệu không được mã hóa (môi trường development)
      res.json(result);
    }
  } catch (error) {
    res.status(500).json({ status: "ERR", message: error.message });
  }
};

const getAllProductAllowBrand = async (req, res) => {
  try {
    const { brand } = req.params;
    const { limit, page, sort, type } = req.query;
    const parsedLimit = Number(limit) || null;
    const parsedPage = Number(page) || 0;

    if ((parsedLimit && parsedLimit < 0) || (parsedPage < 0)) {
      return res.status(400).json({
        status: "ERR",
        message: "Invalid limit or page value",
      });
    }

    const response = await ProductService.getAllProductAllowBrand(
      parsedLimit,
      parsedPage,
      sort,
      type,
      brand
    );
    return res.status(200).json(response);
  } catch (e) {
    logger.error('Error in getAllProductAllowBrand:', e);
    return res.status(500).json({
      status: "ERR",
      message: e.message || "Internal Server Error",
    });
  }
};

const getAllType = async (req, res) => {
  try {
    const response = await ProductService.getAllType();
    return res.status(200).json(response);
  } catch (e) {
    logger.error('Error in getAllType:', e);
    return res.status(500).json({
      status: "ERR",
      message: e.message || "Internal Server Error",
    });
  }
};

const getAllBrand = async (req, res) => {
  try {
    const response = await ProductService.getAllBrand();
    return res.status(200).json(response);
  } catch (e) {
    logger.error('Error in getAllBrand:', e);
    return res.status(500).json({
      status: "ERR",
      message: e.message || "Internal Server Error",
    });
  }
};

const getAllCategory = async (req, res) => {
  try {
    const response = await ProductService.getAllCategory();
    return res.status(200).json(response);
  } catch (e) {
    logger.error('Error in getAllCategory:', e);
    return res.status(500).json({
      status: "ERR",
      message: e.message || "Internal Server Error",
    });
  }
};

const searchProduct = async (req, res) => {
  try {
    const { filter } = req.query;

    if (!filter) {
      return res.status(400).json({
        status: "ERR",
        message: "Filter parameter is required",
      });
    }

    const searchResult = await ProductService.searchProduct(filter);
    return res.status(200).json(searchResult);
  } catch (e) {
    logger.error('Error in searchProduct:', e);
    return res.status(500).json({
      status: "ERR",
      message: e.message || "Internal Server Error",
    });
  }
};

module.exports = {
  createProduct,
  updateProduct,
  getDetailsProduct,
  deleteProduct,
  getAllProduct,
  getAllProductAllowBrand,
  deleteMany,
  getAllType,
  getAllBrand,
  getAllCategory,
  searchProduct
};