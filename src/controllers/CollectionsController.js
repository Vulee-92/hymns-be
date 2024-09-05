const CollectionsService = require("../services/CollectionsService");

const createCollection = async (req, res) => {
  try {
    const { name, description, image } = req.body;
    if (!name) {
      return res.status(400).json({
        status: "ERR",
        message: "Collection name is required",
      });
    }
    const response = await CollectionsService.createCollectionProduct(req.body);
    return res.status(200).json(response);
  } catch (e) {
    return res.status(500).json({
      message: e.message,
    });
  }
};

const getAllCollections = async (req, res) => {
  try {
    const response = await CollectionsService.getAllCollections();
    return res.status(200).json(response);
  } catch (e) {
    return res.status(500).json({
      message: e.message,
    });
  }
};

const getCollectionDetail = async (req, res) => {
  try {
    const collectionId = req.params.id;
    if (!collectionId) {
      return res.status(400).json({
        status: "ERR",
        message: "Collection id is required",
      });
    }
    const response = await CollectionsService.getCollectionDetail(collectionId);
    return res.status(200).json(response);
  } catch (e) {
    return res.status(500).json({
      message: e.message,
    });
  }
};

const updateCollection = async (req, res) => {
  try {
    const collectionId = req.params.id;
    const data = req.body;
    if (!collectionId) {
      return res.status(400).json({
        status: "ERR",
        message: "Collection id is required",
      });
    }
    const response = await CollectionsService.updateCollection(collectionId, data);
    return res.status(200).json(response);
  } catch (e) {
    return res.status(500).json({
      message: e.message,
    });
  }
};

const deleteCollection = async (req, res) => {
  try {
    const collectionId = req.params.id;
    if (!collectionId) {
      return res.status(400).json({
        status: "ERR",
        message: "Collection id is required",
      });
    }
    const response = await CollectionsService.deleteCollection(collectionId);
    return res.status(200).json(response);
  } catch (e) {
    return res.status(500).json({
      message: e.message,
    });
  }
};

const deleteMultipleCollections = async (req, res) => {
  try {
    const ids = req.body.ids;
    if (!ids || !Array.isArray(ids) || ids.length === 0) {
      return res.status(400).json({
        status: "ERR",
        message: "Invalid collection ids",
      });
    }
    const response = await CollectionsService.deleteMultipleCollections(ids);
    return res.status(200).json(response);
  } catch (e) {
    return res.status(500).json({
      message: e.message,
    });
  }
};

module.exports = {
  createCollection,
  getAllCollections,
  getCollectionDetail,
  updateCollection,
  deleteCollection,
  deleteMultipleCollections
};