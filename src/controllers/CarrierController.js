const CarrierService = require('../services/CarrierService');

const createCarrier = async (req, res) => {
  try {
    const response = await CarrierService.createCarrier(req.body);
    return res.status(200).json(response);
  } catch (e) {
    return res.status(500).json({ message: e.message });
  }
};

const getAllCarriers = async (req, res) => {
  try {
    const response = await CarrierService.getAllCarriers();
    return res.status(200).json(response);
  } catch (e) {
    return res.status(500).json({ message: e.message });
  }
};

const getCarrierById = async (req, res) => {
  try {
    const response = await CarrierService.getCarrierById(req.params.id);
    return res.status(200).json(response);
  } catch (e) {
    return res.status(500).json({ message: e.message });
  }
};

const updateCarrier = async (req, res) => {
  try {
    const response = await CarrierService.updateCarrier(req.params.id, req.body);
    return res.status(200).json(response);
  } catch (e) {
    return res.status(500).json({ message: e.message });
  }
};

const deleteCarrier = async (req, res) => {
  try {
    const response = await CarrierService.deleteCarrier(req.params.id);
    return res.status(200).json(response);
  } catch (e) {
    return res.status(500).json({ message: e.message });
  }
};

module.exports = {
  createCarrier,
  getAllCarriers,
  getCarrierById,
  updateCarrier,
  deleteCarrier
};