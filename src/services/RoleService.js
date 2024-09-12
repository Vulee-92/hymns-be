const Role = require('../models/RoleModel');

const createRole = async (roleData) => {
  try {
    const newRole = new Role(roleData);
    await newRole.save();
    return { status: 'OK', message: 'Role created successfully', data: newRole };
  } catch (error) {
    throw new Error(error.message);
  }
};

const updateRole = async (roleId, updateData) => {
  try {
    const updatedRole = await Role.findByIdAndUpdate(roleId, updateData, { new: true });
    if (!updatedRole) {
      return { status: 'ERR', message: 'Role not found' };
    }
    return { status: 'OK', message: 'Role updated successfully', data: updatedRole };
  } catch (error) {
    throw new Error(error.message);
  }
};

const deleteRole = async (roleId) => {
  try {
    const deletedRole = await Role.findByIdAndDelete(roleId);
    if (!deletedRole) {
      return { status: 'ERR', message: 'Role not found' };
    }
    return { status: 'OK', message: 'Role deleted successfully' };
  } catch (error) {
    throw new Error(error.message);
  }
};

const getAllRoles = async () => {
  try {
    const roles = await Role.find().populate('featurePermissions.feature');
    return { status: 'OK', data: roles };
  } catch (error) {
    throw new Error(error.message);
  }
};

const getRoleById = async (roleId) => {
  try {
    const role = await Role.findById(roleId).populate('featurePermissions.feature');
    if (!role) {
      return { status: 'ERR', message: 'Role not found' };
    }
    return { status: 'OK', data: role };
  } catch (error) {
    throw new Error(error.message);
  }
};

module.exports = { createRole, updateRole, deleteRole, getAllRoles, getRoleById };