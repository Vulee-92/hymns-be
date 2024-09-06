const ProductService = require("../services/ProductService");
const Product = require("../models/ProductModel");
const Notification = require('../models/NotificationProductModel');
const { sendRegistrationNotification } = require("../services/EmailProductNotificationService");
// Thêm hàm handleResponse
const handleResponse = (res, data, statusCode = 200) => {
  const success = statusCode >= 200 && statusCode < 300;
  return res.status(statusCode).json({
    success,
    status: success ? "OK" : "ERR",
    ...data
  });
};
const createProduct = async (req,res) => {
	try {
		const {
			name,
			mainImage, 
			image, // Thay đổi tên trường
			countInStock,
			price,
			collection,
			rating,
			discount,
			category,brand,
		} = req.body;

		if (
			!name || !mainImage

		) {
			return res.status(500).json({
				status: "ERR",
				message: "The input is required",
			});
		}
		const response = await ProductService.createProduct(req.body);

		return res.status(200).json(response);
	} catch (e) {
		return res.status(404).json({
			message: e,
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
    handleResponse(res, response);
  } catch (e) {
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


const getAllCategory = async (req, res) => {
  try {
    const response = await ProductService.getAllCategory();
    return res.status(200).json(response);
  } catch (e) {
    return res.status(404).json({
      message: e,
    });
  }
};

const getAllBrand = async (req, res) => {
  try {
    const { selectedTypes } = req.query;
    const typesArray = selectedTypes ? selectedTypes.split(',') : [];
    const response = await ProductService.getAllBrand(typesArray);
    return res.status(200).json(response);
  } catch (e) {
    return res.status(404).json({
      message: e,
    });
  }
};

const searchProduct = async (req,res) => {
	try {
		const { filter } = req.query;

		if (!filter) {
			return res.status(400).json({
				message: "Filter parameter is required",
			});
		}

		const searchResult = await ProductService.searchProduct(filter);

		return res.status(200).json(searchResult);
	} catch (e) {
		return res.status(500).json({
			message: e.message || "Internal Server Error",
		});
	}
};
const getAllProduct = async (req, res) => {
  try {
    const { 
      collection_slug,
      brand_slug,
      category_slug,
      sort,
      page = 1,
      pageSize = 10,
      minPrice,
      maxPrice
    } = req.query;

    const result = await ProductService.getAllProduct({
      collection_slug,
      brand_slug,
      category_slug,
      sort,
      page: parseInt(page),
      pageSize: parseInt(pageSize),
      minPrice: minPrice ? parseFloat(minPrice) : undefined,
      maxPrice: maxPrice ? parseFloat(maxPrice) : undefined
    });

    return res.status(200).json(result);
  } catch (error) {
    console.error('Error in getAllProduct controller:', error);
    return res.status(500).json({
      status: "ERR",
      message: "Internal server error"
    });
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


const decryptData = (req, res) => {
  try {
    const { encryptedData } = req.body;
    console.log('Received encrypted data:', encryptedData); // Thêm log này

    if (!encryptedData) {
      return res.status(400).json({ error: 'No encrypted data provided' });
    }

    const decryptedData = decrypt(encryptedData);
    console.log('Decrypted data:', decryptedData); // Thêm log này

    res.json(JSON.parse(decryptedData));
  } catch (error) {
    console.error('Error in decryptData:', error);
    res.status(400).json({ error: 'Decryption failed', details: error.message });
  }
};
const registerNotification = async (req, res) => {
  try {
    const { email, productId } = req.body;
    if (!email || !productId) {
      return res.status(400).json({
        status: "ERR",
        message: "Email và productId là bắt buộc",
      });
    }

    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({
        status: "ERR",
        message: "Không tìm thấy sản phẩm",
      });
    }
    const notification = new Notification({ email, productId });
    await notification.save();

    // Gửi email thông báo đăng ký thành công
    await sendRegistrationNotification(email, product.name);

    return res.status(200).json({
      status: "OK",
      message: "Đăng ký nhận thông báo thành công",
    });
  } catch (error) {
    console.error('Error:', error);
    return res.status(500).json({
      status: "ERR",
      message: "Lỗi khi đăng ký nhận thông báo",
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
	// deleteMany,
	getAllBrand,
	getAllCategory,
	searchProduct,
  registerNotification
};
