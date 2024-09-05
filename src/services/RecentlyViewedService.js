const Product = require("../models/ProductModel");
const RecentlyViewed = require("../models/RecentlyViewedModel");

const updateRecentlyViewed = async (userId, productSlug) => {
  try {
    const product = await Product.findOne({ slug: productSlug });
    if (!product) {
      throw new Error("Product not found");
    }

    let recentlyViewed = await RecentlyViewed.findOne({ userId });

    if (!recentlyViewed) {
      recentlyViewed = new RecentlyViewed({
        userId,
        products: [{
          product: product._id,
          name: product.name,
          image: product.image,
          price: product.price,
          slug: product.slug,
          countInStock: product.countInStock
        }]
      });
    } else {
      const existingProductIndex = recentlyViewed.products.findIndex(
        p => p.slug === product.slug
      );

      if (existingProductIndex > -1) {
        recentlyViewed.products[existingProductIndex].viewCount += 1;
        recentlyViewed.products[existingProductIndex].timestamp = new Date();
      } else {
        recentlyViewed.products.unshift({
          product: product._id,
          name: product.name,
          image: product.image,
          price: product.price,
          slug: product.slug,
          countInStock: product.countInStock
        });

        if (recentlyViewed.products.length > 5) {
          recentlyViewed.products.pop();
        }
      }
    }

    await recentlyViewed.save();

    return {
      status: "OK",
      message: "Recently viewed updated successfully",
      data: recentlyViewed
    };
  } catch (error) {
    throw error;
  }
};

const getRecentlyViewed = async (userId) => {
  try {
    const recentlyViewed = await RecentlyViewed.findOne({ userId }).populate('products.product');
    if (!recentlyViewed) {
      return {
        status: "ERR",
        message: "No recently viewed products found for this user",
      };
    }

    return {
      status: "OK",
      message: "Recently viewed products retrieved successfully",
      data: recentlyViewed,
    };
  } catch (error) {
    throw error;
  }
};

module.exports = {
  updateRecentlyViewed,
  getRecentlyViewed
};