const homeService = require('../services/HomeService');

const getBestSellers = async (req, res) => {
  try {
    const response = await homeService.getBestSellers();
    return res.status(200).json(response);
  } catch (e) {
    return res.status(500).json({
      status: "ERR",
      message: e.message || e,
    });
  }
};

const getNewArrivals = async (req, res) => {
  try {
    const response = await homeService.getNewArrivals();
    return res.status(200).json(response);
  } catch (e) {
    return res.status(500).json({
      status: "ERR",
      message: e.message || e,
    });
  }
};

const getSpecials = async (req, res) => {
  try {
    const response = await homeService.getSpecials();
    return res.status(200).json(response);
  } catch (e) {
    return res.status(500).json({
      status: "ERR",
      message: e.message || e,
    });
  }
};
const getLatestBlogs = async (req, res) => {
    try {
      const response = await homeService.getLatestBlogs();
      return res.status(200).json(response);
    } catch (e) {
      return res.status(500).json({
        status: "ERR",
        message: e.message || e,
      });
    }
  };
module.exports = {
  getBestSellers,
  getNewArrivals,
  getSpecials,
  getLatestBlogs
};