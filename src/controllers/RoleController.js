const RoleService = require('../services/RoleService');

const createRole = async (req, res) => {
  try {
    const response = await RoleService.createRole(req.body);
    res.status(200).json(response);
  } catch (error) {
    res.status(500).json({ status: 'ERR', message: error.message });
  }
};

const updateRole = async (req, res) => {
  try {
    const { id } = req.params;
    const response = await RoleService.updateRole(id, req.body);
    res.status(200).json(response);
  } catch (error) {
    res.status(500).json({ status: 'ERR', message: error.message });
  }
};

const getAllRoles = async (req, res) => {
  try {
    const response = await RoleService.getAllRoles();
    res.status(200).json(response);
  } catch (error) {
    res.status(500).json({ status: 'ERR', message: error.message });
  }
};

const getRoleById = async (req, res) => {
  try {
    const { id } = req.params;
    const response = await RoleService.getRoleById(id);
    res.status(200).json(response);
  } catch (error) {
    res.status(500).json({ status: 'ERR', message: error.message });
  }
};

module.exports = { createRole, updateRole, getAllRoles, getRoleById };