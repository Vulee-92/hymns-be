const Role = require('../models/RoleModel');

// Tạo vai trò mới
const createRole = async (roleData) => {
  try {
    const role = new Role(roleData);
    const savedRole = await role.save();
    return { status: 'OK', message: 'Role created successfully', data: savedRole };
  } catch (error) {
    throw new Error(error.message);
  }
};

// Cập nhật vai trò theo ID
const updateRole = async (id, roleData) => {
  try {
    const updatedRole = await Role.findByIdAndUpdate(id, roleData, { new: true });
    if (!updatedRole) {
      throw new Error('Role not found');
    }
    return { status: 'OK', message: 'Role updated successfully', data: updatedRole };
  } catch (error) {
    throw new Error(error.message);
  }
};

// Xóa vai trò theo ID
const deleteRole = async (id) => {
  try {
    const deletedRole = await Role.findByIdAndDelete(id);
    if (!deletedRole) {
      throw new Error('Role not found');
    }
    return { status: 'OK', message: 'Role deleted successfully', data: deletedRole };
  } catch (error) {
    throw new Error(error.message);
  }
};

// Lấy tất cả vai trò
const getAllRoles = async () => {
  try {
    const roles = await Role.find();
    return { status: 'OK', message: 'Roles retrieved successfully', data: roles };
  } catch (error) {
    throw new Error(error.message);
  }
};

// Lấy vai trò theo ID
const getRoleById = async (id) => {
  try {
    const role = await Role.findById(id);
    if (!role) {
      throw new Error('Role not found');
    }
    return { status: 'OK', message: 'Role retrieved successfully', data: role };
  } catch (error) {
    throw new Error(error.message);
  }
};

module.exports = { createRole, updateRole, deleteRole, getAllRoles, getRoleById };
