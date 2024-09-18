const mongoose = require('mongoose');
const dotenv = require("dotenv");
dotenv.config();

async function updateIsDeleted() {
    try {
        // Kết nối đến cơ sở dữ liệu
        await mongoose.connect(process.env.MONGO_DB, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
        console.log("Connected to MongoDB database");

        // Danh sách các model cần cập nhật
        const models = [
            require('../../models/CourseModel/ClassModel'),
            require('../../models/CourseModel/CourseModel'),
            require('../../models/CourseModel/SubjectModel'),
            require('../../models/BannerModel'),
            require('../../models/BlogModel'),
            require('../../models/BrandProductModel'),
            require('../../models/CarrierModel'),
            require('../../models/CartModel'),
            require('../../models/CateBlog'),
            require('../../models/CateProductModel'),
            require('../../models/CollectionsModel'),
            require('../../models/ComboModel'),
            require('../../models/ContactModel'),
            require('../../models/FeatureModel'),
            require('../../models/FeaturePackageModel'),
            require('../../models/OrderModel'),
            require('../../models/PaymentMethodModel'),
            require('../../models/ProductModel'),
            require('../../models/RoleModel'),
            require('../../models/ShippingModel'),
            require('../../models/NotificationModel'),
            require('../../models/RecentlyViewedModel'),
            require('../../models/SearchKeywordModel'),
            require('../../models/UserModel'),
            require('../../models/ReviewModel'),
            // Thêm các model khác vào đây
        ];

        // Lặp qua từng model và cập nhật trường isDeleted
        for (const model of models) {
            const result = await model.updateMany({}, { $set: { isDeleted: false } });
            console.log(`Updated ${result.nModified} documents in ${model.modelName}`);
        }

    } catch (err) {
        console.error('Error connecting to MongoDB', err);
    } finally {
        // Ngắt kết nối
        await mongoose.connection.close();
    }
}

// Gọi hàm updateIsDeleted
updateIsDeleted();