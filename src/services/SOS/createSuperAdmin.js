const mongoose = require('mongoose');
const User = require('../models/UserModel');
const Role = require('../models/RoleModel');
const FeaturePackage = require('../models/FeaturePackageModel');
const Feature = require('../models/FeatureModel');

async function createSuperAdmin() {
  // Tạo role super_admin
  const superAdminRole = await Role.create({
    name: 'Super Admin',
    code: 'super_admin',
    featurePermissions: []
  });

  // Tạo feature package với tất cả các quyền
  const allFeatures = await Feature.find();
  const superAdminPackage = await FeaturePackage.create({
    name: 'Super Admin Package',
    code: 'super_admin_package',
    features: allFeatures.map(feature => ({ feature: feature._id, access: true }))
  });

  // Cập nhật role super_admin với tất cả các quyền
  superAdminRole.featurePermissions = allFeatures.map(feature => ({
    feature: feature._id,
    permissions: { view: true, create: true, edit: true, delete: true }
  }));
  await superAdminRole.save();

  // Tạo user super admin
  await User.create({
    username: 'superadmin',
    password: 'your_secure_password', // Hãy mã hóa mật khẩu trong thực tế
    role: superAdminRole._id,
    featurePackage: superAdminPackage._id
  });

  console.log('Super Admin created successfully');
}

mongoose.connect('your_mongodb_connection_string')
  .then(() => createSuperAdmin())
  .then(() => mongoose.disconnect())
  .catch(console.error);