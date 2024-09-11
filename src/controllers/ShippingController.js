const ShippingService = require('../services/ShippingService');

const createShipping = async (req, res) => {
  try {
    const response = await ShippingService.createShipping(req.body);
    return res.status(200).json(response);
  } catch (e) {
    return res.status(500).json({ message: e.message });
  }
};

const getAllShippings = async (req, res) => {
  try {
    const response = await ShippingService.getAllShippings();
    return res.status(200).json(response);
  } catch (e) {
    return res.status(500).json({ message: e.message });
  }
};

const getShippingById = async (req, res) => {
  try {
    const response = await ShippingService.getShippingById(req.params.id);
    return res.status(200).json(response);
  } catch (e) {
    return res.status(500).json({ message: e.message });
  }
};

const updateShipping = async (req, res) => {
  try {
    const response = await ShippingService.updateShipping(req.params.id, req.body);
    return res.status(200).json(response);
  } catch (e) {
    return res.status(500).json({ message: e.message });
  }
};

const deleteShipping = async (req, res) => {
  try {
    const response = await ShippingService.deleteShipping(req.params.id);
    return res.status(200).json(response);
  } catch (e) {
    return res.status(500).json({ message: e.message });
  }
};

module.exports = {
  createShipping,
  getAllShippings,
  getShippingById,
  updateShipping,
  deleteShipping
};