const slugify = require('slugify');
const CategoryProduct = require("../models/CateProductModel");

const createCategoryProduct = async (newCategory) => {
  try {
    const { category, slug, image } = newCategory;

    // Kiểm tra xem category có tồn tại không
    const checkNameCategory = await CategoryProduct.findOne({ category });
    if (checkNameCategory) {
      return { status: "ERR", message: "The name of category is already" };
    }

    // Tạo slug nếu không có
    const categorySlug = slug || slugify(category, { lower: true });

    // Tạo mới category
    const newCategoryInstance = new CategoryProduct({
      category,
      slug: categorySlug,
      image,
    });

    const createdCategory = await newCategoryInstance.save();
    return { status: "OK", message: "SUCCESS", data: createdCategory };
  } catch (e) {
    return { status: "ERR", message: e.message };
  }
};

const getAllCategory = async (user) => { // Thêm tham số user
  try {
    let query = {};

    // Kiểm tra quyền của người dùng
    if (user.role.isAdmin) {
      // Nếu là admin, lấy tất cả danh mục (cả isDeleted là true và false)
      query = {};
    } else {
      // Nếu không phải admin, chỉ lấy danh mục chưa bị xóa
      query = { isDeleted: false };
    }

    const allCategory = await CategoryProduct.find(query).sort({ createdAt: -1, updatedAt: -1 });
    return { status: "OK", message: "Success", data: allCategory };
  } catch (e) {
    return { status: "ERR", message: e.message };
  }
};

const deleteCategory = async (categoryId) => {
  try {
    const result = await CategoryProduct.findByIdAndUpdate(categoryId, { isDeleted: true });
    if (result) {
      return { status: "OK", message: "Category deleted successfully" };
    } else {
      return { status: "ERR", message: "Category not found" };
    }
  } catch (e) {
    return { status: "ERR", message: e.message };
  }
};

const updateCategory = async (categoryId, updatedData) => {
  try {
    const result = await CategoryProduct.findByIdAndUpdate(categoryId, updatedData, { new: true });
    if (result) {
      return { status: "OK", message: "Category updated successfully", data: result };
    } else {
      return { status: "ERR", message: "Category not found" };
    }
  } catch (e) {
    return { status: "ERR", message: e.message };
  }
};

const getCategoryDetail = async (categoryId) => {
  try {
    const category = await CategoryProduct.findById(categoryId);
    if (category) {
      return { status: "OK", message: "Success", data: category };
    } else {
      return { status: "ERR", message: "Category not found" };
    }
  } catch (e) {
    return { status: "ERR", message: e.message };
  }
};

const deleteMultipleCategories = async (categoryIds) => {
  try {
    const result = await CategoryProduct.deleteMany({ _id: { $in: categoryIds } });
    if (result.deletedCount > 0) {
      return { status: "OK", message: "Categories deleted successfully", deletedCount: result.deletedCount };
    } else {
      return { status: "ERR", message: "No categories found to delete" };
    }
  } catch (e) {
    return { status: "ERR", message: e.message };
  }
};

module.exports = {
  createCategoryProduct,
  getAllCategory,
  deleteCategory,
  updateCategory,
  getCategoryDetail,
  deleteMultipleCategories
};