// services/RecentlyViewedService.js
const Product = require("../models/ProductModel");
const RecentlyViewed = require("../models/RecentlyViewedModel");
const User = require("../models/UserModel");
const ScheduledTasks = require("./ScheduledTasks");

// services/RecentlyViewedService.js
const updateRecentlyViewed = async (userId,productId) => {
	try {
		// Tìm thông tin gần đây của người dùng
		let recentlyViewed = await RecentlyViewed.findOne({ userId });

		// Tìm thông tin sản phẩm dựa trên slug
		const product = await Product.findOne({ slug: productId });

		// Kiểm tra xem sản phẩm có tồn tại hay không
		if (!product) {
			return {
				status: "ERR",
				message: "The product is not defined",
			};
		}

		// Nếu chưa có thông tin gần đây cho người dùng, tạo mới
		if (!recentlyViewed) {
			recentlyViewed = await RecentlyViewed.create({
				userId: userId,
				products: [{
					product,
					name: product.name,
					image: product.image,
					price: product.price,
					slug: product.slug,
					countInStock: product.countInStock
				}],
			});

			return {
				status: "OK",
				message: "New record created for the user",
				data: recentlyViewed,
			};
		}
		else {

		
			// Nếu đã có thông tin, kiểm tra sản phẩm đã xem hay chưa
			const viewedProduct = recentlyViewed.products.find(
				(productItem) => String(productItem.slug) === String(product.slug)
			);
			console.log("viewedProduct",viewedProduct)
			if (viewedProduct) {
				// Nếu sản phẩm đã được xem, cập nhật thời gian xem và số lần xem
				viewedProduct.timestamp = new Date();
				viewedProduct.viewCount += 1;
			} else {
				// Nếu sản phẩm chưa được xem, thêm mới vào danh sách
				recentlyViewed.products.unshift({
					product: product._id,
					name: product.name,
					image: product.image,
					price: product.price,
					slug: product.slug,
					countInStock: product.countInStock,

					timestamp: new Date(),
					viewCount: 1,
				});

				// Giữ danh sách sản phẩm gần đây tối đa 10 phần tử
				if (recentlyViewed.products.length > 5) {
					recentlyViewed.products.pop();
				}
			}

			// Lưu thông tin cập nhật
			// Lưu thông tin cập nhật với múi giờ +7
			await recentlyViewed.save({ timestamps: { currentTime: () => new Date().toISOString() } });
 // Lên lịch công việc xoá dữ liệu sau 1 phút
    // ScheduledTasks.scheduleCleanupJob(userId);

			return {
				status: "OK",
				message: "SUCCESS",
				data: { products: recentlyViewed },
			};
		}
	} catch (error) {
		throw error;
	}
};



const getRecentlyViewed = (userId) => {

	return new Promise(async (resolve,reject) => {
		try {
			const recentlyViewed = await RecentlyViewed.findOne({ userId: userId });
			if (recentlyViewed === null) {
				resolve({
					status: "ERR",
					message: "The recentlyViewed is not defined",
				});
			}

			resolve({
				status: "OK",
				message: "SUCESSS",
				data: recentlyViewed,
			});
		} catch (e) {
			reject(e);
		}
	});
};
const deleteOldViewedData = async () => {
  try {
    const cutoffTime = new Date();
    // Đặt thời gian cắt tại 1 phút trước đó
    cutoffTime.setMinutes(cutoffTime.getMinutes() - 1);

    // Xóa dữ liệu cũ hơn thời gian cắt từ RecentlyViewed collection
    const result = await RecentlyViewed.deleteMany({
      'products.timestamp': { $lt: cutoffTime },
    });

    console.log(`${result.deletedCount} record(s) deleted.`);
  } catch (error) {
    throw error;
  }
};
module.exports = {
	updateRecentlyViewed,
	getRecentlyViewed,
deleteOldViewedData
};
