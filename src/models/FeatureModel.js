const mongoose = require('mongoose');

const permissionSchema = new mongoose.Schema({
  add: { type: Boolean, default: false },
  view: { type: Boolean, default: false },
  edit: { type: Boolean, default: false },
  delete: { type: Boolean, default: false },
  export: { type: Boolean, default: false },
  print: { type: Boolean, default: false }
});

const featureSchema = new mongoose.Schema({
  nameMenu: { type: String, required: true },
  icon: { type: String },
  order: { type: Number },
  subId: { type: String },
  parentId: { type: mongoose.Schema.Types.ObjectId, ref: 'Feature', default: null },
  url: { type: String, required: true, unique: true },
  stt: { type: String },
  permission: permissionSchema
});

const Feature = mongoose.model('Feature', featureSchema);
module.exports = Feature;