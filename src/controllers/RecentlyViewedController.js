const RecentlyViewedService = require('../services/RecentlyViewedService');

const updateRecentlyViewed = async (req, res) => {
  try {
    const productSlug = req.params.id;
    const userId = req.params.userId;

    if (!productSlug || !userId) {
      return res.status(400).json({
        status: "ERR",
        message: "Product slug and user ID are required",
      });
    }

    const response = await RecentlyViewedService.updateRecentlyViewed(userId, productSlug);
    return res.status(200).json(response);
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      status: "ERR",
      message: "An error occurred while updating recently viewed products",
    });
  }
};

const getRecentlyViewed = async (req, res) => {
  try {
    const userId = req.params.id;
    if (!userId) {
      return res.status(400).json({
        status: "ERR",
        message: "User ID is required",
      });
    }
    const response = await RecentlyViewedService.getRecentlyViewed(userId);
    return res.status(200).json(response);
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      status: "ERR",
      message: "An error occurred while fetching recently viewed products",
    });
  }
};

module.exports = {
  updateRecentlyViewed,
  getRecentlyViewed,
};