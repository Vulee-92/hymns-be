const CategoryService = require("../services/CateProductService");

const createCategory = async (req, res) => {
  try {
    const { category, slug, image } = req.body;
    if (!category) {
      return res.status(400).json({ status: "ERR", message: "The input is required" });
    }
    const response = await CategoryService.createCategoryProduct(req.body);
    return res.status(200).json(response);
  } catch (e) {
    return res.status(500).json({ message: e.message });
  }
};

const getAllCategory = async (req, res) => {
  try {
    const response = await CategoryService.getAllCategory(req.user); // Truyền user vào
    return res.status(200).json(response);
  } catch (e) {
    return res.status(500).json({ message: e.message });
  }
};

const deleteCategory = async (req, res) => {
  try {
    const { id } = req.params;
    const response = await CategoryService.deleteCategory(id);
    return res.status(200).json(response);
  } catch (e) {
    return res.status(500).json({ message: e.message });
  }
};

const updateCategory = async (req, res) => {
  try {
    const { id } = req.params;
    const response = await CategoryService.updateCategory(id, req.body);
    return res.status(200).json(response);
  } catch (e) {
    return res.status(500).json({ message: e.message });
  }
};

const getCategoryDetail = async (req, res) => {
  try {
    const { id } = req.params;
    const response = await CategoryService.getCategoryDetail(id);
    return res.status(200).json(response);
  } catch (e) {
    return res.status(500).json({ message: e.message });
  }
};

const deleteMultipleCategories = async (req, res) => {
  try {
    const { ids } = req.body; // Expecting an array of IDs in the request body
    const response = await CategoryService.deleteMultipleCategories(ids);
    return res.status(200).json(response);
  } catch (e) {
    return res.status(500).json({ message: e.message });
  }
};

module.exports = {
  createCategory,
  getAllCategory,
  deleteCategory,
  updateCategory,
  getCategoryDetail,
  deleteMultipleCategories
};