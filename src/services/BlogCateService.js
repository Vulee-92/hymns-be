const BlogCategory = require("../models/CateBlog");
const slugify = require("slugify");

const createCate = async (data) => {
  try {
    const { title, description } = data;
    const existingCategory = await BlogCategory.findOne({ title });
    if (existingCategory) {
      throw new Error("Category already exists");
    }
    const slug = slugify(title, { lower: true });
    const newCategory = await BlogCategory.create({ title, description, slug });
    return newCategory;
  } catch (error) {
    throw error;
  }
};

const getAllCates = async () => {
  try {
    const categories = await BlogCategory.find().sort({ createdAt: -1 });
    return categories;
  } catch (error) {
    throw error;
  }
};

const getCateById = async (id) => {
  try {
    const category = await BlogCategory.findById(id);
    if (!category) {
      throw new Error("Category not found");
    }
    return category;
  } catch (error) {
    throw error;
  }
};

const updateCate = async (id, data) => {
  try {
    const { title, description } = data;
    const category = await BlogCategory.findById(id);
    if (!category) {
      throw new Error("Category not found");
    }
    if (title) {
      category.title = title;
      category.slug = slugify(title, { lower: true });
    }
    if (description) {
      category.description = description;
    }
    await category.save();
    return category;
  } catch (error) {
    throw error;
  }
};

const deleteCate = async (id) => {
  try {
    const category = await BlogCategory.findByIdAndDelete(id);
    if (!category) {
      throw new Error("Category not found");
    }
    return category;
  } catch (error) {
    throw error;
  }
};

const deleteMultipleCates = async (ids) => {
  try {
    const result = await BlogCategory.deleteMany({ _id: { $in: ids } });
    return result;
  } catch (error) {
    throw error;
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