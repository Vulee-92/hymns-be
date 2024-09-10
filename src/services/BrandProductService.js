const slugify = require('slugify');
const BrandProduct = require("../models/BrandProductModel");

const createBrandProduct = async (newBrand) => {
  try {
    const { brand, description, image, slug } = newBrand;

    // Kiểm tra xem brand có tồn tại không
    const checkNameBrand = await BrandProduct.findOne({ brand });
    if (checkNameBrand) {
      return { status: "ERR", message: "The name of product is already" };
    }

    // Tạo slug nếu không có
    const brandSlug = slug || slugify(brand, { lower: true });

    // Tạo mới brand
    const newBrandInstance = new BrandProduct({
      brand,
      description,
      image,
      slug: brandSlug,
    });

    const createdBrand = await newBrandInstance.save();
    return { status: "OK", message: "SUCCESS", data: createdBrand };
  } catch (e) {
    return { status: "ERR", message: e.message };
  }
};

const getAllBrand = async () => {
  try {
    const allBrand = await BrandProduct.find().sort({ createdAt: -1, updatedAt: -1 });
    return { status: "OK", message: "Success", data: allBrand };
  } catch (e) {
    return { status: "ERR", message: e.message };
  }
};

const deleteBrand = async (brandId) => {
  try {
    const result = await BrandProduct.findByIdAndDelete(brandId);
    if (result) {
      return { status: "OK", message: "Brand deleted successfully" };
    } else {
      return { status: "ERR", message: "Brand not found" };
    }
  } catch (e) {
    return { status: "ERR", message: e.message };
  }
};

const updateBrand = async (brandId, updatedData) => {
  try {
    const result = await BrandProduct.findByIdAndUpdate(brandId, updatedData, { new: true });
    if (result) {
      return { status: "OK", message: "Brand updated successfully", data: result };
    } else {
      return { status: "ERR", message: "Brand not found" };
    }
  } catch (e) {
    return { status: "ERR", message: e.message };
  }
};

const getBrandDetail = async (brandId) => {
  try {
    const brand = await BrandProduct.findById(brandId);
    if (brand) {
      return { status: "OK", message: "Success", data: brand };
    } else {
      return { status: "ERR", message: "Brand not found" };
    }
  } catch (e) {
    return { status: "ERR", message: e.message };
  }
};

const deleteMultipleBrands = async (brandIds) => {
  try {
    const result = await BrandProduct.deleteMany({ _id: { $in: brandIds } });
    if (result.deletedCount > 0) {
      return { status: "OK", message: "Brands deleted successfully", deletedCount: result.deletedCount };
    } else {
      return { status: "ERR", message: "No brands found to delete" };
    }
  } catch (e) {
    return { status: "ERR", message: e.message };
  }
};

module.exports = {
  createBrandProduct,
  getAllBrand,
  deleteBrand,
  updateBrand,
  getBrandDetail,
  deleteMultipleBrands
};