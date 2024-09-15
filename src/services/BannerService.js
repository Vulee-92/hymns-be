const Banner = require('../models/BannerModel');

const createBanner = async (bannerData) => {
  try {
    const newBanner = new Banner(bannerData);
    await newBanner.save();
    return { status: 'OK', message: 'Banner created successfully', data: newBanner };
  } catch (error) {
    throw new Error(error.message);
  }
};

const updateBanner = async (bannerId, updateData) => {
  try {
    const updatedBanner = await Banner.findByIdAndUpdate(bannerId, updateData, { new: true });
    if (!updatedBanner) {
      return { status: 'ERR', message: 'Banner not found' };
    }
    return { status: 'OK', message: 'Banner updated successfully', data: updatedBanner };
  } catch (error) {
    throw new Error(error.message);
  }
};

const getAllBanners = async () => {
  try {
    const banners = await Banner.find();
    return { status: 'OK', data: banners };
  } catch (error) {
    throw new Error(error.message);
  }
};

const getActiveBanner = async () => {
  try {
    const activeBanner = await Banner.findOne({ isActive: true });
    if (!activeBanner) {
      return { status: 'ERR', message: 'No active banner found' };
    }
    return { status: 'OK', data: activeBanner };
  } catch (error) {
    throw new Error(error.message);
  }
};

const deleteBanner = async (bannerId) => {
  try {
    const deletedBanner = await Banner.findByIdAndDelete(bannerId);
    if (!deletedBanner) {
      return { status: 'ERR', message: 'Banner not found' };
    }
    return { status: 'OK', message: 'Banner deleted successfully' };
  } catch (error) {
    throw new Error(error.message);
  }
};

module.exports = {
  createBanner,
  updateBanner,
  getAllBanners,
  getActiveBanner,
  deleteBanner
};