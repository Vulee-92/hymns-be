const BrandService = require("../services/BrandProductService");

const createBrand = async (req, res) => {
  try {
    const { brand, description, image, slug } = req.body;
    if (!brand) {
      return res.status(400).json({ status: "ERR", message: "The input is required" });
    }
    const response = await BrandService.createBrandProduct(req.body);
    return res.status(200).json(response);
  } catch (e) {
    return res.status(500).json({ message: e.message });
  }
};

const getAllBrand = async (req, res) => {
  try {
    const response = await BrandService.getAllBrand();
    return res.status(200).json(response);
  } catch (e) {
    return res.status(500).json({ message: e.message });
  }
};

const deleteBrand = async (req, res) => {
  try {
    const { id } = req.params;
    const response = await BrandService.deleteBrand(id);
    return res.status(200).json(response);
  } catch (e) {
    return res.status(500).json({ message: e.message });
  }
};

const updateBrand = async (req, res) => {
  try {
    const { id } = req.params;
    const response = await BrandService.updateBrand(id, req.body);
    return res.status(200).json(response);
  } catch (e) {
    return res.status(500).json({ message: e.message });
  }
};

const getBrandDetail = async (req, res) => {
  try {
    const { id } = req.params;
    const response = await BrandService.getBrandDetail(id);
    return res.status(200).json(response);
  } catch (e) {
    return res.status(500).json({ message: e.message });
  }
};

const deleteMultipleBrands = async (req, res) => {
  try {
    const { ids } = req.body; // Expecting an array of IDs in the request body
    const response = await BrandService.deleteMultipleBrands(ids);
    return res.status(200).json(response);
  } catch (e) {
    return res.status(500).json({ message: e.message });
  }
};

module.exports = {
  createBrand,
  getAllBrand,
  deleteBrand,
  updateBrand,
  getBrandDetail,
  deleteMultipleBrands
};