const mongoose = require('mongoose');

const featurePackageSchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true },
  code: { type: String, required: true, unique: true },
  features: [{
    feature: { type: mongoose.Schema.Types.ObjectId, ref: 'Feature' },
    access: { type: Boolean, default: false }
  }]
});

const FeaturePackage = mongoose.model('FeaturePackage', featurePackageSchema);
module.exports = FeaturePackage;