const cloudinary = require('../utils/cloudinaryConfig');

const uploadImageController = async (req, res) => {
  try {
    const { buffer } = req.file; // Lấy buffer từ file
    const fileBase64 = `data:image/jpeg;base64,${buffer.toString('base64')}`; // Chuyển file thành base64
    console.log("buffer", buffer);
    console.log("base64",fileBase64);
    // Upload hình lên Cloudinary
    const result = await cloudinary.uploader.upload(fileBase64, {
      folder: 'sanpham', // Thư mục trên Cloudinary
    });

    res.status(200).json({
      status: 'OK',
      message: 'Image uploaded successfully',
      url: result.secure_url, // URL hình ảnh sau khi tải lên
    });
  } catch (error) {
    res.status(500).json({
      status: 'ERR',
      message: 'Error uploading image: ' + error.message,
    });
  }
};

module.exports = { uploadImageController };