const ReviewService = require('../services/ReviewService');

const addReview = async (req, res) => {
  try {
    const { userId, productId, rating, comment } = req.body;
    const review = await ReviewService.addReview(userId, productId, rating, comment);
    res.status(200).json(review);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const deleteReview = async (req, res) => {
  try {
    const { reviewId } = req.body;
    const review = await ReviewService.deleteReview(reviewId);
    res.status(200).json(review);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const updateReview = async (req, res) => {
  try {
    const { reviewId, rating, comment } = req.body;
    const review = await ReviewService.updateReview(reviewId, rating, comment);
    res.status(200).json(review);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getReviewsByProduct = async (req, res) => {
  try {
    const { productId } = req.query;
    const reviews = await ReviewService.getReviewsByProduct(productId);
    res.status(200).json(reviews);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  addReview,
  deleteReview,
  updateReview,
  getReviewsByProduct,
};