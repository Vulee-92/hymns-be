const slugify = require('slugify');
const Collections = require("../models/CollectionsModel");

const createCollection = async (newCollection) => {
  try {
    const { name, description, image, backgroundImage, slug } = newCollection;

    // Kiểm tra xem collection có tồn tại không
    const checkNameCollection = await Collections.findOne({ name });
    if (checkNameCollection) {
      return { status: "ERR", message: "The name of collection is already" };
    }

    // Tạo slug nếu không có
    const collectionSlug = slug || slugify(name, { lower: true });

    // Tạo mới collection
    const newCollectionInstance = new Collections({
      name,
      description,
      image,
      backgroundImage,
      slug: collectionSlug,
    });

    const createdCollection = await newCollectionInstance.save();
    return { status: "OK", message: "SUCCESS", data: createdCollection };
  } catch (e) {
    return { status: "ERR", message: e.message };
  }
};

const getAllCollections = async () => {
  try {
    const allCollections = await Collections.find().sort({ createdAt: -1, updatedAt: -1 });
    return { status: "OK", message: "Success", data: allCollections };
  } catch (e) {
    return { status: "ERR", message: e.message };
  }
};

const deleteCollection = async (collectionId) => {
  try {
    const result = await Collections.findByIdAndDelete(collectionId);
    if (result) {
      return { status: "OK", message: "Collection deleted successfully" };
    } else {
      return { status: "ERR", message: "Collection not found" };
    }
  } catch (e) {
    return { status: "ERR", message: e.message };
  }
};

const updateCollection = async (collectionId, updatedData) => {
  try {
    const result = await Collections.findByIdAndUpdate(collectionId, updatedData, { new: true });
    if (result) {
      return { status: "OK", message: "Collection updated successfully", data: result };
    } else {
      return { status: "ERR", message: "Collection not found" };
    }
  } catch (e) {
    return { status: "ERR", message: e.message };
  }
};

const getCollectionDetail = async (collectionId) => {
  try {
    const collection = await Collections.findById(collectionId);
    if (collection) {
      return { status: "OK", message: "Success", data: collection };
    } else {
      return { status: "ERR", message: "Collection not found" };
    }
  } catch (e) {
    return { status: "ERR", message: e.message };
  }
};

const deleteMultipleCollections = async (collectionIds) => {
  try {
    const result = await Collections.deleteMany({ _id: { $in: collectionIds } });
    if (result.deletedCount > 0) {
      return { status: "OK", message: "Collections deleted successfully", deletedCount: result.deletedCount };
    } else {
      return { status: "ERR", message: "No collections found to delete" };
    }
  } catch (e) {
    return { status: "ERR", message: e.message };
  }
};

module.exports = {
  createCollection,
  getAllCollections,
  deleteCollection,
  updateCollection,
  getCollectionDetail,
  deleteMultipleCollections
};