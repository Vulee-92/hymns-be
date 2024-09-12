const Feature = require('../models/FeatureModel');

const createFeature = async (featureData) => {
  try {
    const newFeature = new Feature(featureData);
    await newFeature.save();
    return { status: 'OK', message: 'Feature created successfully', data: newFeature };
  } catch (error) {
    throw new Error(error.message);
  }
};

const updateFeature = async (featureId, updateData) => {
  try {
    const updatedFeature = await Feature.findByIdAndUpdate(featureId, updateData, { new: true });
    if (!updatedFeature) {
      return { status: 'ERR', message: 'Feature not found' };
    }
    return { status: 'OK', message: 'Feature updated successfully', data: updatedFeature };
  } catch (error) {
    throw new Error(error.message);
  }
};

const deleteFeature = async (featureId) => {
  try {
    const deletedFeature = await Feature.findByIdAndDelete(featureId);
    if (!deletedFeature) {
      return { status: 'ERR', message: 'Feature not found' };
    }
    return { status: 'OK', message: 'Feature deleted successfully' };
  } catch (error) {
    throw new Error(error.message);
  }
};

const getAllFeatures = async () => {
  try {
    const features = await Feature.find().sort('order');
    return { status: 'OK', data: features };
  } catch (error) {
    throw new Error(error.message);
  }
};

const getFeatureById = async (featureId) => {
  try {
    const feature = await Feature.findById(featureId);
    if (!feature) {
      return { status: 'ERR', message: 'Feature not found' };
    }
    return { status: 'OK', data: feature };
  } catch (error) {
    throw new Error(error.message);
  }
};

const getFeatureTree = async () => {
  try {
    const features = await Feature.find().sort('order');
    const featureTree = buildFeatureTree(features);
    return { status: 'OK', data: featureTree };
  } catch (error) {
    throw new Error(error.message);
  }
};

const buildFeatureTree = (features, parentId = null) => {
  return features
    .filter(feature => feature.parentId === parentId)
    .map(feature => ({
      ...feature.toObject(),
      children: buildFeatureTree(features, feature._id)
    }));
};

module.exports = { 
  createFeature, 
  updateFeature, 
  deleteFeature, 
  getAllFeatures, 
  getFeatureById, 
  getFeatureTree 
};
