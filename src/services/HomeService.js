const Product = require("../models/ProductModel");
const Blog = require("../models/BlogModel");

const getBestSellers = async () => {
  try {
    const bestSellers = await Product.find()
      .sort({ selled: -1 }) // Giả sử bạn có trường 'sold' để lưu số lượng đã bán
      .limit(10)
      .select('name price image selled');

    return {
      status: "OK",
      data: bestSellers
    };
  } catch (e) {
    throw new Error(e.message || e);
  }
};

const getNewArrivals = async () => {
  try {
    const newArrivals = await Product.find()
      .sort({ createdAt: -1 })
      .limit(10)
      .select('name price image createdAt');

    return {
      status: "OK",
      data: newArrivals
    };
  } catch (e) {
    throw new Error(e.message || e);
  }
};

const getSpecials = async () => {
  try {
    const specials = await Product.find({ discount: { $gt: 0 } })
      .sort({ discount: -1 })
      .limit(10)
      .select('name price image discount');

    return {
      status: "OK",
      data: specials
    };
  } catch (e) {
    throw new Error(e.message || e);
  }
};
const getLatestBlogs = async () => {
    try {
      const latestBlogs = await Blog.find()
        .sort({ createdAt: -1 })
        .limit(5)
        .select('title summary image createdAt');
  
      return {
        status: "OK",
        data: latestBlogs
      };
    } catch (e) {
      throw new Error(e.message || e);
    }
  };
  
module.exports = {
  getBestSellers,
  getNewArrivals,
  getSpecials,
  getLatestBlogs
};