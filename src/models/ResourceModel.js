const mongoose = require('mongoose');

const ResourceSchema = new mongoose.Schema({
  code: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  description: String,
}, { timestamps: true });

const Resource = mongoose.model('Resource', ResourceSchema);

module.exports = Resource;