const { uploadImages, deleteImage, listImages } = require('../services/CloudinaryService');

const uploadImageController = async (req, res) => {
  try {
     const filePaths = req.files.map(file => file.path); // Lấy đường dẫn của tất cả các file
     const results = await uploadImages(filePaths);
     res.status(200).json({
       status: 'OK',
       message: 'Images uploaded successfully',
       data: results,
     });
   } catch (error) {
     res.status(500).json({
       status: 'ERR',
       message: error.message,
     });
   }
};

const deleteImageController = async (req, res) => {
  try {
    const { publicId } = req.params;
    const result = await deleteImage(publicId);
    res.status(200).json({
      status: 'OK',
      message: 'Image deleted successfully',
      data: result,
    });
  } catch (error) {
    res.status(500).json({
      status: 'ERR',
      message: error.message,
    });
  }
};

const listImagesController = async (req, res) => {
  try {
    const images = await listImages();
    res.status(200).json({
      status: 'OK',
      message: 'Images retrieved successfully',
      data: images,
    });
  } catch (error) {
    res.status(500).json({
      status: 'ERR',
      message: error.message,
    });
  }
};

module.exports = {
  uploadImageController,
  deleteImageController,
  listImagesController,
};