const mongoose = require('mongoose');

const permissionSchema = new mongoose.Schema({
  resource: { type: mongoose.Schema.Types.ObjectId, ref: 'Resource' },
  actions: {
    create: { type: Boolean, default: false },
    read: { type: Boolean, default: false },
    update: { type: Boolean, default: false },
    delete: { type: Boolean, default: false },
    // Có thể thêm các hành động khác nếu cần
    approve: { type: Boolean, default: false },
    publish: { type: Boolean, default: false },
  }
});

const roleSchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true }, // Ví dụ: "Admin", "Teacher", "Student"
  description: { type: String },
	code: { type: String, required: true, unique: true },
  permissions: [permissionSchema],
  isActive: { type: Boolean, default: true },
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  updatedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
}, { 
  timestamps: true 
});

// Phương thức để kiểm tra quyền
roleSchema.methods.hasPermission = function(resource, action) {
  const permission = this.permissions.find(p => p.resource === resource);
  return permission ? permission.actions[action] : false;
};

// Phương thức để cập nhật quyền
roleSchema.methods.updatePermission = function(resource, action, value) {
  let permission = this.permissions.find(p => p.resource === resource);
  if (!permission) {
    permission = { resource, actions: {} };
    this.permissions.push(permission);
  }
  permission.actions[action] = value;
};

const Role = mongoose.model('Role', roleSchema);
module.exports = Role;