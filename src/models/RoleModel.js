const mongoose = require('mongoose');

const roleSchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true },
  code: { type: String, required: true, unique: true },
  featurePermissions: [{
    feature: { type: mongoose.Schema.Types.ObjectId, ref: 'Feature' },
    permissions: {
      view: { type: Boolean, default: false },
      create: { type: Boolean, default: false },
      edit: { type: Boolean, default: false },
      delete: { type: Boolean, default: false }
    }
  }]
});

const Role = mongoose.model('Role', roleSchema);
module.exports = Role;