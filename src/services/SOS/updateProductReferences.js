const mongoose = require('mongoose');
const Product = require('../../models/ProductModel');
const UserService = require('../../services/UserService'); // Import UserService
const dotenv = require("dotenv");
dotenv.config();

const updateCollectionsForProducts = async () => {
  try {
    // Kết nối đến MongoDB
    await mongoose.connect(process.env.MONGO_DB, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("Connected to MongoDB database");

    // Gán role cho tất cả người dùng
    await assignRoles();
  } catch (error) {
    console.error("Error connecting to MongoDB:", error);
  } finally {
    mongoose.connection.close(); // Đảm bảo đóng kết nối
  }
};

const assignRoles = async () => {
  try {
    await UserService.assignDefaultRoleToAllUsers();
    console.log('Default role assigned to all users');
  } catch (error) {
    console.error("Error assigning roles:", error);
  }
};

// Gọi hàm updateCollectionsForProducts
updateCollectionsForProducts();