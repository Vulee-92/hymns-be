const FeatureService = require('../services/FeatureService');

const createFeature = async (req, res) => {
  try {
    const response = await FeatureService.createFeature(req.body);
    res.status(201).json(response);
  } catch (error) {
    res.status(500).json({ status: 'ERR', message: error.message });
  }
};

const updateFeature = async (req, res) => {
  try {
    const { id } = req.params;
    const response = await FeatureService.updateFeature(id, req.body);
    res.status(200).json(response);
  } catch (error) {
    res.status(500).json({ status: 'ERR', message: error.message });
  }
};

const deleteFeature = async (req, res) => {
  try {
    const { id } = req.params;
    const response = await FeatureService.deleteFeature(id);
    res.status(200).json(response);
  } catch (error) {
    res.status(500).json({ status: 'ERR', message: error.message });
  }
};

const getAllFeatures = async (req, res) => {
  try {
    const response = await FeatureService.getAllFeatures();
    res.status(200).json(response);
  } catch (error) {
    res.status(500).json({ status: 'ERR', message: error.message });
  }
};

const getFeatureById = async (req, res) => {
  try {
    const { id } = req.params;
    const response = await FeatureService.getFeatureById(id);
    res.status(200).json(response);
  } catch (error) {
    res.status(500).json({ status: 'ERR', message: error.message });
  }
};

const getFeatureTree = async (req, res) => {
  try {
    const response = await FeatureService.getFeatureTree();
    res.status(200).json(response);
  } catch (error) {
    res.status(500).json({ status: 'ERR', message: error.message });
  }
};

module.exports = { 
  createFeature, 
  updateFeature, 
  deleteFeature, 
  getAllFeatures, 
  getFeatureById, 
  getFeatureTree 
};
