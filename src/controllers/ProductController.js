const productService = require("../services/ProductService");


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

const ProductService = require("../services/ProductService");

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

module.exports = {
	createProduct,
	updateProduct,
	getDetailsProduct,
	deleteProduct,
	getAllProduct,
	getAllProductAllowBrand,
	deleteMany,
	getAllBrand,
	getAllCategory,
	searchProduct
};
