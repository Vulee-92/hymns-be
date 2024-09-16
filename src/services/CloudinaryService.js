const cloudinary = require('../utils/cloudinaryConfig');
const Image = require('../models/ImageModel');

const uploadImage = async (fileBase64, name) => {
  try {
    const result = await cloudinary.uploader.upload(fileBase64, {
      folder: 'sanpham',
    });
    const newImage = new Image({
      url: result.secure_url,
      name
    });
    await newImage.save();
    return newImage;
  } catch (error) {
    throw new Error('Error uploading image: ' + error.message);
  }
};

const deleteImage = async (id) => {
  try {
    const image = await Image.findById(id);
    if (!image) {
      throw new Error('Image not found');
    }
    const publicId = image.url.split('/').pop().split('.')[0];
    await cloudinary.uploader.destroy(publicId);
    await image.remove();
    return image;
  } catch (error) {
    throw new Error('Error deleting image: ' + error.message);
  }
};

const updateImage = async (id, name) => {
  try {
    const image = await Image.findByIdAndUpdate(id, { name }, { new: true });
    if (!image) {
      throw new Error('Image not found');
    }
    return image;
  } catch (error) {
    throw new Error('Error updating image: ' + error.message);
  }
};

const getAllImages = async () => {
  try {
    const images = await Image.find();
    return images;
  } catch (error) {
    throw new Error('Error retrieving images: ' + error.message);
  }
};

module.exports = {
  uploadImage,
  deleteImage,
  updateImage,
  getAllImages
};