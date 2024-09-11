const PaymentMethodService = require('../services/PaymentMethodService');

const createPaymentMethod = async (req, res) => {
  try {
    const response = await PaymentMethodService.createPaymentMethod(req.body);
    return res.status(200).json(response);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

const getAllPaymentMethods = async (req, res) => {
  try {
    const response = await PaymentMethodService.getAllPaymentMethods();
    return res.status(200).json(response);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

const getPaymentMethodById = async (req, res) => {
  try {
    const response = await PaymentMethodService.getPaymentMethodById(req.params.id);
    return res.status(200).json(response);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

const updatePaymentMethod = async (req, res) => {
  try {
    const response = await PaymentMethodService.updatePaymentMethod(req.params.id, req.body);
    return res.status(200).json(response);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

const deletePaymentMethod = async (req, res) => {
  try {
    const response = await PaymentMethodService.deletePaymentMethod(req.params.id);
    return res.status(200).json(response);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

module.exports = {
  createPaymentMethod,
  getAllPaymentMethods,
  getPaymentMethodById,
  updatePaymentMethod,
  deletePaymentMethod
};