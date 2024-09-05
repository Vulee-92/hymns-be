const CateService = require("../services/BlogCateService");

const createCate = async (req, res) => {
  try {
    const { title, description } = req.body;
    if (!title) {
      return res.status(400).json({
        status: "ERR",
        message: "Title is required",
      });
    }
    const response = await CateService.createCate(req.body);
    return res.status(201).json({
      status: "OK",
      message: "Category created successfully",
      data: response,
    });
  } catch (e) {
    return res.status(500).json({
      status: "ERR",
      message: e.message,
    });
  }
};

const getAllCates = async (req, res) => {
  try {
    const response = await CateService.getAllCates();
    return res.status(200).json({
      status: "OK",
      message: "Categories retrieved successfully",
      data: response,
    });
  } catch (e) {
    return res.status(500).json({
      status: "ERR",
      message: e.message,
    });
  }
};

const getCateById = async (req, res) => {
  try {
    const { id } = req.params;
    const response = await CateService.getCateById(id);
    return res.status(200).json({
      status: "OK",
      message: "Category retrieved successfully",
      data: response,
    });
  } catch (e) {
    return res.status(500).json({
      status: "ERR",
      message: e.message,
    });
  }
};

const updateCate = async (req, res) => {
  try {
    const { id } = req.params;
    const response = await CateService.updateCate(id, req.body);
    return res.status(200).json({
      status: "OK",
      message: "Category updated successfully",
      data: response,
    });
  } catch (e) {
    return res.status(500).json({
      status: "ERR",
      message: e.message,
    });
  }
};

const deleteCate = async (req, res) => {
  try {
    const { id } = req.params;
    await CateService.deleteCate(id);
    return res.status(200).json({
      status: "OK",
      message: "Category deleted successfully",
    });
  } catch (e) {
    return res.status(500).json({
      status: "ERR",
      message: e.message,
    });
  }
};

const deleteMultipleCates = async (req, res) => {
  try {
    const { ids } = req.body;
    if (!ids || !Array.isArray(ids)) {
      return res.status(400).json({
        status: "ERR",
        message: "Invalid input",
      });
    }
    const result = await CateService.deleteMultipleCates(ids);
    return res.status(200).json({
      status: "OK",
      message: "Categories deleted successfully",
      data: result,
    });
  } catch (e) {
    return res.status(500).json({
      status: "ERR",
      message: e.message,
    });
  }
};

module.exports = {
  createCate,
  getAllCates,
  getCateById,
  updateCate,
  deleteCate,
  deleteMultipleCates,
};