const CollectionsService = require("../services/CollectionsService");

const createCollection = async (req, res) => {
  try {
    const { name, description, image, backgroundImage, slug } = req.body;
    if (!name) {
      return res.status(400).json({ status: "ERR", message: "The input is required" });
    }
    const response = await CollectionsService.createCollection(req.body);
    return res.status(200).json(response);
  } catch (e) {
    return res.status(500).json({ message: e.message });
  }
};

const getAllCollections = async (req, res) => {
  try {
    const response = await CollectionsService.getAllCollections();
    return res.status(200).json(response);
  } catch (e) {
    return res.status(500).json({ message: e.message });
  }
};

const deleteCollection = async (req, res) => {
  try {
    const { id } = req.params;
    const response = await CollectionsService.deleteCollection(id);
    return res.status(200).json(response);
  } catch (e) {
    return res.status(500).json({ message: e.message });
  }
};

const updateCollection = async (req, res) => {
  try {
    const { id } = req.params;
    const response = await CollectionsService.updateCollection(id, req.body);
    return res.status(200).json(response);
  } catch (e) {
    return res.status(500).json({ message: e.message });
  }
};

const getCollectionDetail = async (req, res) => {
  try {
    const { id } = req.params;
    const response = await CollectionsService.getCollectionDetail(id);
    return res.status(200).json(response);
  } catch (e) {
    return res.status(500).json({ message: e.message });
  }
};

const deleteMultipleCollections = async (req, res) => {
  try {
    const { ids } = req.body; // Expecting an array of IDs in the request body
    const response = await CollectionsService.deleteMultipleCollections(ids);
    return res.status(200).json(response);
  } catch (e) {
    return res.status(500).json({ message: e.message });
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