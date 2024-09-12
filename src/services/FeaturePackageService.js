const FeaturePackage = require('../models/FeaturePackageModel');

const createFeaturePackage = async (packageData) => {
  try {
    const newPackage = new FeaturePackage(packageData);
    await newPackage.save();
    return { status: 'OK', message: 'Feature package created successfully', data: newPackage };
  } catch (error) {
    throw new Error(error.message);
  }
};

const updateFeaturePackage = async (packageId, updateData) => {
  try {
    const updatedPackage = await FeaturePackage.findByIdAndUpdate(packageId, updateData, { new: true });
    if (!updatedPackage) {
      return { status: 'ERR', message: 'Feature package not found' };
    }
    return { status: 'OK', message: 'Feature package updated successfully', data: updatedPackage };
  } catch (error) {
    throw new Error(error.message);
  }
};

const getAllFeaturePackages = async () => {
  try {
    const packages = await FeaturePackage.find().populate('features.feature');
    return { status: 'OK', data: packages };
  } catch (error) {
    throw new Error(error.message);
  }
};

// Thêm các phương thức khác nếu cần

module.exports = { createFeaturePackage, updateFeaturePackage, getAllFeaturePackages };