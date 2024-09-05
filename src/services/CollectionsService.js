const slugify = require('slugify');
const Collections = require("../models/CollectionsModel");

const createCollectionProduct = (newCollection) => {
  return new Promise(async (resolve, reject) => {
    const { name, description, image,   backgroundImage } = newCollection;
    try {
      const generateRandomId = Math.floor(100000 + Math.random() * 900000);
      const checkNameCollection = await Collections.findOne({ name: name });
      
      if (checkNameCollection) {
        resolve({
          status: "ERR",
          message: "The collection name already exists",
        });
      }
      
      const slug = slugify(name, { lower: true });
      const newCollection = await Collections.create({
        name,
        collection_id: generateRandomId,
        description,
        image,
				     backgroundImage,
        slug
      });
      
      if (newCollection) {
        resolve({
          status: "OK",
          message: "SUCCESS",
          data: newCollection,
        });
      }
    } catch (e) {
      reject(e);
    }
  });
};

const getAllCollections = () => {
  return new Promise(async (resolve, reject) => {
    try {
      const allCollections = await Collections.find().sort({ createdAt: -1, updatedAt: -1 });
      resolve({
        status: "OK",
        message: "Success",
        data: allCollections,
      });
    } catch (e) {
      reject(e);
    }
  });
};

const getCollectionDetail = (id) => {
  return new Promise(async (resolve, reject) => {
    try {
      const collection = await Collections.findById(id);
      if (collection) {
        resolve({
          status: "OK",
          message: "SUCCESS",
          data: collection,
        });
      } else {
        resolve({
          status: "ERR",
          message: "The collection does not exist",
        });
      }
    } catch (e) {
      reject(e);
    }
  });
};

const updateCollection = (id, data) => {
  return new Promise(async (resolve, reject) => {
    try {
      const checkCollection = await Collections.findOne({ _id: id });
      if (checkCollection === null) {
        resolve({
          status: "ERR",
          message: "The collection does not exist",
        });
      }

      if (data.name) {
        data.slug = slugify(data.name, { lower: true });
      }

      const updatedCollection = await Collections.findByIdAndUpdate(id, data, { new: true });
      resolve({
        status: "OK",
        message: "SUCCESS",
        data: updatedCollection,
      });
    } catch (e) {
      reject(e);
    }
  });
};

const deleteCollection = (id) => {
  return new Promise(async (resolve, reject) => {
    try {
      const checkCollection = await Collections.findOne({ _id: id });
      if (checkCollection === null) {
        resolve({
          status: "ERR",
          message: "The collection does not exist",
        });
      }

      await Collections.findByIdAndDelete(id);
      resolve({
        status: "OK",
        message: "Delete collection success",
      });
    } catch (e) {
      reject(e);
    }
  });
};

const deleteMultipleCollections = (ids) => {
  return new Promise(async (resolve, reject) => {
    try {
      await Collections.deleteMany({ _id: { $in: ids } });
      resolve({
        status: "OK",
        message: "Delete collections success",
      });
    } catch (e) {
      reject(e);
    }
  });
};

module.exports = {
  createCollectionProduct,
  getAllCollections,
  getCollectionDetail,
  updateCollection,
  deleteCollection,
  deleteMultipleCollections
};