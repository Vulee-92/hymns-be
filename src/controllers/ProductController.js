const { sendRegistrationNotification } = require('../services/EmailProductNotificationService');
const ProductService = require('../services/ProductService');
const Product = require("../models/ProductModel");
const NotificationProductModel = require('../models/NotificationProductModel');
// Hàm tiện ích để xử lý phản hồi
const handleResponse = (res, data, statusCode = 200) => {
  const success = statusCode >= 200 && statusCode < 300;
  return res.status(statusCode).json({
    success,
    status: success ? "OK" : "ERR",
    ...data
  });
};

const createProduct = async (req, res) => {
  try {
    const response = await ProductService.createProduct(req.body);
    return res.status(200).json(response);
  } catch (e) {
    return res.status(500).json({ message: e.message });
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
      maxPrice,
      keyword
    } = req.query;

    const result = await ProductService.getAllProduct({
      collection_slug,
      brand_slug,
      category_slug,
      sort,
      page: parseInt(page),
      pageSize: parseInt(pageSize),
      minPrice: minPrice ? parseFloat(minPrice) : undefined,
      maxPrice: maxPrice ? parseFloat(maxPrice) : undefined,
      keyword 
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

const getProductDetail = async (req, res) => {
  try {
    const { slug } = req.params;
    const response = await ProductService.getDetailsProduct(slug);
    return res.status(200).json(response);
  } catch (e) {
    return res.status(500).json({ message: e.message });
  }
};

const updateProduct = async (req, res) => {
  try {
    const { slug } = req.params.id;
    console.log("slug", slug);
    const response = await ProductService.updateProduct(req.params.id, req.body);
    return res.status(200).json(response);
  } catch (e) {
    return res.status(500).json({ message: e.message });
  }
};

const deleteProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const response = await ProductService.deleteProduct(id);
    return res.status(200).json(response);
  } catch (e) {
    return res.status(500).json({ message: e.message });
  }
};

const deleteManyProduct = async (req, res) => {
  try {
    const { ids } = req.body;
    const response = await ProductService.deleteManyProduct(ids);
    return res.status(200).json(response);
  } catch (e) {
    return res.status(500).json({ message: e.message });
  }
};

const searchProduct = async (req, res) => {
  try {
    const { filter } = req.query;
    const response = await ProductService.searchProduct(filter);
    return res.status(200).json(response);
  } catch (e) {
    return res.status(500).json({ message: e.message });
  }
};

const updateAllProductsBrand = async (req, res) => {
  const result = await ProductService.updateAllProductsBrand();
  res.status(result.status === 'OK' ? 200 : 500).json(result);
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

    if (product.countInStock > 0) {
      return res.status(200).json({
        status: "OK",
        message: `${product.name} hiện vẫn còn hàng, có thể đặt hàng ngay`,
      });
    }

    const notification = new NotificationProductModel({ email, productId });
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
// Hàm lấy thông tin chi tiết sản phẩm
const getDetailsProduct = async (req, res) => {
  try {
    const product = await ProductService.getDetailsProduct(req.params.id);
    res.status(200).json(product);
  } catch (error) {
    res.status(500).json({ message: 'Lỗi khi lấy thông tin sản phẩm', error: error.message });
  }
};

// Hàm lấy tất cả sản phẩm theo thương hiệu
const getAllProductAllowBrand = async (req, res) => {
  try {
    const { brand } = req.params;
    const queryOptions = req.query;

    const result = await ProductService.getAllProductAllowBrand(brand, queryOptions);
    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({ message: 'Lỗi khi lấy danh sách sản phẩm', error: error.message });
  }
};

module.exports = {  createProduct,
  updateProduct,
  getDetailsProduct,
  deleteProduct,
  deleteManyProduct,
  getAllProduct,
  getAllProductAllowBrand,
  searchProduct,
  registerNotification,
  updateAllProductsBrand}