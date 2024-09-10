const mongoose = require('mongoose');
const Product = require('../../models/ProductModel');
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

    // ObjectId mới cho collections
    const newCollections = [
      new mongoose.Types.ObjectId('6624ca51f7050a3691ed0f99'),
      new mongoose.Types.ObjectId('65f55257cc61abbc2a1577fb')
    ];

    // Lấy tất cả sản phẩm
    const products = await Product.find();
    console.log(`${products.length} products found`);

    // Duyệt qua từng sản phẩm và cập nhật trường collections
    for (const product of products) {
      // Cập nhật Product với collections mới
      await Product.updateOne(
        { _id: product._id },
        { $set: { collections: newCollections } } // Thay collections bằng mảng ObjectId mới
      );

      console.log(`Updated product ${product._id} with collections ${newCollections}`);
    }

  } catch (error) {
    console.error('Error while updating collections for products:', error);
  } finally {
    // Đóng kết nối MongoDB
    await mongoose.disconnect();
    console.log("Disconnected from MongoDB database");
  }
};

// Gọi hàm để thực hiện cập nhật
updateCollectionsForProducts();