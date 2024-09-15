const cloudinary = require('../utils/cloudinaryConfig');

const uploadImages = async (filePaths) => {
	console.log("filePaths",filePaths);
    try {
        const uploadPromises = filePaths.map(filePath => cloudinary.uploader.upload(filePath, {
            folder: 'sanpham', // Thay thế bằng tên thư mục của bạn
            transformation: { width: 1280, height: 720, crop: 'limit' }, // Giới hạn kích thước
        }));
        const results = await Promise.all(uploadPromises);
        return results;
    } catch (error) {
        throw new Error('Error uploading images: ' + error.message);
    }
};

const deleteImage = async (publicId) => {
    try {
        const result = await cloudinary.uploader.destroy(publicId);
        return result;
    } catch (error) {
        throw new Error('Error deleting image: ' + error.message);
    }
};

const listImages = async () => {
    try {
        const result = await cloudinary.api.resources({
            type: 'upload',
            prefix: 'your_folder_name', // Thay thế bằng tên thư mục của bạn
        });
        return result.resources;
    } catch (error) {
        throw new Error('Error listing images: ' + error.message);
    }
};

module.exports = {
    uploadImages,
    deleteImage,
    listImages,
};
