const ProductService = require("../services/ProductService");
const logger = require("../utils/logger");
const { encrypt, decrypt } = require("../utils/encryption");

const handleResponse = (res, data, statusCode = 200) => {
  if (process.env.NODE_ENV === 'production') {
    res.status(statusCode).json({ encryptedData: encrypt(JSON.stringify(data)) });
  } else {
    res.status(statusCode).json(data);
  }
};

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
    handleResponse(res, response, 201);
  } catch (e) {
    logger.error('Error in createProduct:', e);
    handleResponse(res, {
      status: "ERR",
      message: e.message || "Internal Server Error",
    }, 500);
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
    handleResponse(res, response);
  } catch (e) {
    logger.error('Error in updateProduct:', e);
    handleResponse(res, {
      status: "ERR",
      message: e.message || "Internal Server Error",
    }, 500);
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
    handleResponse(res, response);
  } catch (e) {
    logger.error('Error in getDetailsProduct:', e);
    handleResponse(res, {
      status: "ERR",
      message: e.message || "Internal Server Error",
    }, 500);
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
    handleResponse(res, response);
  } catch (e) {
    logger.error('Error in deleteProduct:', e);
    handleResponse(res, {
      status: "ERR",
      message: e.message || "Internal Server Error",
    }, 500);
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
    handleResponse(res, response);
  } catch (e) {
    logger.error('Error in deleteMany:', e);
    handleResponse(res, {
      status: "ERR",
      message: e.message || "Internal Server Error",
    }, 500);
  }
};

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
    handleResponse(res, result);
  } catch (error) {
    logger.error('Error in getAllProduct:', error);
    handleResponse(res, { status: "ERR", message: error.message }, 500);
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
    handleResponse(res, response);
  } catch (e) {
    logger.error('Error in getAllProductAllowBrand:', e);
    handleResponse(res, {
      status: "ERR",
      message: e.message || "Internal Server Error",
    }, 500);
  }
};

const getAllType = async (req, res) => {
  try {
    const response = await ProductService.getAllType();
    handleResponse(res, response);
  } catch (e) {
    logger.error('Error in getAllType:', e);
    handleResponse(res, {
      status: "ERR",
      message: e.message || "Internal Server Error",
    }, 500);
  }
};

const getAllBrand = async (req, res) => {
  try {
    const response = await ProductService.getAllBrand();
    handleResponse(res, response);
  } catch (e) {
    logger.error('Error in getAllBrand:', e);
    handleResponse(res, {
      status: "ERR",
      message: e.message || "Internal Server Error",
    }, 500);
  }
};

const getAllCategory = async (req, res) => {
  try {
    const response = await ProductService.getAllCategory();
    handleResponse(res, response);
  } catch (e) {
    logger.error('Error in getAllCategory:', e);
    handleResponse(res, {
      status: "ERR",
      message: e.message || "Internal Server Error",
    }, 500);
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
    handleResponse(res, searchResult);
  } catch (e) {
    logger.error('Error in searchProduct:', e);
    handleResponse(res, {
      status: "ERR",
      message: e.message || "Internal Server Error",
    }, 500);
  }
};

const decryptData = (req, res) => {
	try {
		const { encryptedData } = req.body;
		const decryptedData = decrypt(encryptedData); // Sử dụng hàm decrypt của bạn
		console.log('Decrypted data on backend:', decryptedData); // Log để kiểm tra
		res.json(JSON.parse(decryptedData));
	} catch (error) {
		console.error('Error in decryptData:', error);
		res.status(400).json({ error: 'Decryption failed' });
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
  searchProduct,
  decryptData
};