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

const getAllRoles = async () => {
  try {
    const roles = await Role.find();
    return { status: 'OK', data: roles };
  } catch (error) {
    throw new Error(error.message);
  }
};

const getRoleById = async (roleId) => {
  try {
    const role = await Role.findById(roleId);
    if (!role) {
      return { status: 'ERR', message: 'Role not found' };
    }
    return { status: 'OK', data: role };
  } catch (error) {
    throw new Error(error.message);
  }
};
const createDefaultRole = async () => {
  const defaultRole = {
    name: "User",
    code: "user",
    permissions: {
      view: true,
      create: false,
      edit: false,
      delete: false
    }
  };

  const existingRole = await Role.findOne({ code: defaultRole.code });
  if (!existingRole) {
    const newRole = new Role(defaultRole);
    await newRole.save();
    return newRole;
  }
  return existingRole;
};


module.exports = { createRole, updateRole, getAllRoles, getRoleById, createDefaultRole };