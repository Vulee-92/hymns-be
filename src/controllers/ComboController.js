const ComboService = require('../services/ComboService');
const ProductService = require('../services/ProductService');

const createCombo = async (req, res) => {
  try {
    const response = await ComboService.createCombo(req.body);
    return res.status(200).json(response);
  } catch (e) {
    return res.status(404).json({
      message: e.message
    });
  }
};

const getAllCombos = async (req, res) => {
  try {
    const response = await ComboService.getAllCombos();
    return res.status(200).json(response);
  } catch (e) {
    return res.status(404).json({
      message: e.message
    });
  }
};

const getComboById = async (req, res) => {
  try {
    const comboId = req.params.id;
    const response = await ComboService.getComboById(comboId);
    return res.status(200).json(response);
  } catch (e) {
    return res.status(404).json({
      message: e.message
    });
  }
};
const updateCombo = async (req, res) => {
    try {
      const comboId = req.params.id;
      const data = req.body;
      const response = await ComboService.updateCombo(comboId, data);
      return res.status(200).json(response);
    } catch (e) {
      return res.status(404).json({
        message: e.message
      });
    }
  };
const deleteCombo = async (req, res) => {
  try {
    const comboId = req.params.id;
    const response = await ComboService.deleteCombo(comboId);
    return res.status(200).json(response);
  } catch (e) {
    return res.status(404).json({
      message: e.message
    });
  }
};

const getAllProducts = async (req, res) => {
  try {
    const products = await ProductService.getAllProduct();
    const combos = await ComboService.getAllCombos();
    return res.status(200).json({
      status: 'OK',
      message: 'SUCCESS',
      data: {
        products: products.data,
        combos: combos.data
      }
    });
  } catch (e) {
    return res.status(404).json({
      message: e.message
    });
  }
};

module.exports = {
  createCombo,
  getAllCombos,
  getComboById,
  updateCombo,
  deleteCombo,
  getAllProducts
};