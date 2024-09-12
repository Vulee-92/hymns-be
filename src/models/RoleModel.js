const mongoose = require('mongoose');

const roleSchema = new mongoose.Schema({
  name: { type: String, required: true }, // Ví dụ: "Admin", "Staff", "User"
  code: { type: String, required: true, unique: true },
  permissions: {
    view: { type: Boolean, default: false },
    add: { type: Boolean, default: false },
    edit: { type: Boolean, default: false },
    delete: { type: Boolean, default: false }
  },
  isAdmin: { type: Boolean, default: false } // Đánh dấu vai trò là Admin
}, { timestamps: true });

const Role = mongoose.model('Role', roleSchema);

module.exports = Role;
