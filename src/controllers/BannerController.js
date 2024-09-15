const BannerService = require('../services/BannerService');

const createBanner = async (req, res) => {
  try {
    const response = await BannerService.createBanner(req.body);
    res.status(201).json(response);
  } catch (error) {
    res.status(500).json({ status: 'ERR', message: error.message });
  }
};

const updateBanner = async (req, res) => {
  try {
    const { id } = req.params;
    const response = await BannerService.updateBanner(id, req.body);
    res.status(200).json(response);
  } catch (error) {
    res.status(500).json({ status: 'ERR', message: error.message });
  }
};

const getAllBanners = async (req, res) => {
  try {
    const response = await BannerService.getAllBanners();
    res.status(200).json(response);
  } catch (error) {
    res.status(500).json({ status: 'ERR', message: error.message });
  }
};

const getActiveBanner = async (req, res) => {
  try {
    const response = await BannerService.getActiveBanner();
    res.status(200).json(response);
  } catch (error) {
    res.status(500).json({ status: 'ERR', message: error.message });
  }
};

const deleteBanner = async (req, res) => {
  try {
    const { id } = req.params;
    const response = await BannerService.deleteBanner(id);
    res.status(200).json(response);
  } catch (error) {
    res.status(500).json({ status: 'ERR', message: error.message });
  }
};

module.exports = {
  createBanner,
  updateBanner,
  getAllBanners,
  getActiveBanner,
  deleteBanner
};