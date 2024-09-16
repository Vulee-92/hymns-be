const ImageService = require('../services/CloudinaryService');

const uploadImage = async (req, res) => {
  try {
    const { imageBase64, name } = req.body;
    const result = await ImageService.uploadImage(imageBase64, name);
    res.status(200).json({
      status: 'OK',
      message: 'Image uploaded successfully',
      data: result
    });
  } catch (error) {
    res.status(500).json({
      status: 'ERR',
      message: 'Error uploading image: ' + error.message,
    });
  }
};

const deleteImage = async (req, res) => {
  try {
    const { id } = req.params;
    const result = await ImageService.deleteImage(id);
    res.status(200).json({
      status: 'OK',
      message: 'Image deleted successfully',
      data: result
    });
  } catch (error) {
    res.status(500).json({
      status: 'ERR',
      message: 'Error deleting image: ' + error.message,
    });
  }
};

const updateImage = async (req, res) => {
  try {
    const { id } = req.params;
    const { name } = req.body;
    const result = await ImageService.updateImage(id, name);
    res.status(200).json({
      status: 'OK',
      message: 'Image updated successfully',
      data: result
    });
  } catch (error) {
    res.status(500).json({
      status: 'ERR',
      message: 'Error updating image: ' + error.message,
    });
  }
};

const getAllImages = async (req, res) => {
  try {
    const result = await ImageService.getAllImages();
    res.status(200).json({
      status: 'OK',
      message: 'Images retrieved successfully',
      data: result
    });
  } catch (error) {
    res.status(500).json({
      status: 'ERR',
      message: 'Error retrieving images: ' + error.message,
    });
  }
};

module.exports = {
  uploadImage,
  deleteImage,
  updateImage,
  getAllImages
};