const RoleService = require('../services/RoleService');

// Tạo vai trò mới
const createRole = async (req, res) => {
  try {
    const response = await RoleService.createRole(req.body);
    res.status(201).json(response);
  } catch (error) {
    res.status(500).json({ status: 'ERR', message: error.message });
  }
};

// Cập nhật vai trò theo ID
const updateRole = async (req, res) => {
  try {
    const { id } = req.params;
    const response = await RoleService.updateRole(id, req.body);
    res.status(200).json(response);
  } catch (error) {
    res.status(500).json({ status: 'ERR', message: error.message });
  }
};

// Xóa vai trò theo ID
const deleteRole = async (req, res) => {
  try {
    const { id } = req.params;
    const response = await RoleService.deleteRole(id);
    res.status(200).json(response);
  } catch (error) {
    res.status(500).json({ status: 'ERR', message: error.message });
  }
};

// Lấy tất cả vai trò
const getAllRoles = async (req, res) => {
  try {
    const response = await RoleService.getAllRoles();
    res.status(200).json(response);
  } catch (error) {
    res.status(500).json({ status: 'ERR', message: error.message });
  }
};

// Lấy vai trò theo ID
const getRoleById = async (req, res) => {
  try {
    const { id } = req.params;
    const response = await RoleService.getRoleById(id);
    res.status(200).json(response);
  } catch (error) {
    res.status(500).json({ status: 'ERR', message: error.message });
  }
};

module.exports = { createRole, updateRole, deleteRole, getAllRoles, getRoleById };
