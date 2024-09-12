const FeaturePackageService = require('../services/FeaturePackageService');

const createFeaturePackage = async (req, res) => {
  try {
    const response = await FeaturePackageService.createFeaturePackage(req.body);
    res.status(200).json(response);
  } catch (error) {
    res.status(500).json({ status: 'ERR', message: error.message });
  }
};

const updateFeaturePackage = async (req, res) => {
  try {
    const { id } = req.params;
    const response = await FeaturePackageService.updateFeaturePackage(id, req.body);
    res.status(200).json(response);
  } catch (error) {
    res.status(500).json({ status: 'ERR', message: error.message });
  }
};

const getAllFeaturePackages = async (req, res) => {
  try {
    const response = await FeaturePackageService.getAllFeaturePackages();
    res.status(200).json(response);
  } catch (error) {
    res.status(500).json({ status: 'ERR', message: error.message });
  }
};

module.exports = { createFeaturePackage, updateFeaturePackage, getAllFeaturePackages };