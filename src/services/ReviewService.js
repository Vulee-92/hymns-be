const Review = require('../models/ReviewModel');

const addReview = async (userId, productId, rating, comment) => {
  const review = new Review({ userId, productId, rating, comment });
  await review.save();
  return review;
};

const deleteReview = async (reviewId) => {
  const review = await Review.findByIdAndDelete(reviewId);
  if (!review) {
    throw new Error('Review not found');
  }
  return review;
};

const updateReview = async (reviewId, rating, comment) => {
  const review = await Review.findByIdAndUpdate(
    reviewId,
    { rating, comment },
    { new: true }
  );
  if (!review) {
    throw new Error('Review not found');
  }
  return review;
};

const getReviewsByProduct = async (productId) => {
  const reviews = await Review.find({ productId }).populate('userId', 'name');
  return reviews;
};

module.exports = {
  addReview,
  deleteReview,
  updateReview,
  getReviewsByProduct,
};