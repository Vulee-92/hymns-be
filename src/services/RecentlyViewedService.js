// services/RecentlyViewedService.js
const Product = require("../models/ProductModel");
const RecentlyViewed = require("../models/RecentlyViewedModel");
const User = require("../models/UserModel");
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
					product: product._id,
					name: product.name,
					image: product.image,
					price: product.price,
					slug: product.slug,
					// ... (các trường khác)
				}],
			});

			return {
				status: "OK",
				message: "SUCCESS",
				data: recentlyViewed.products,
			};
		} else {
			// Nếu đã có thông tin, kiểm tra sản phẩm đã xem hay chưa
			const viewedProduct = recentlyViewed.products.find(
				(productItem) => String(productItem.product) === String(product._id)
			);

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
					// ... (các trường khác)
					timestamp: new Date(),
					viewCount: 1,
				});

				// Giữ danh sách sản phẩm gần đây tối đa 10 phần tử
				if (recentlyViewed.products.length > 10) {
					recentlyViewed.products.pop();
				}
			}

			// Lưu thông tin cập nhật
			await recentlyViewed.save();

			return {
				status: "OK",
				message: "SUCCESS",
				data: recentlyViewed.products,
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

module.exports = {
	updateRecentlyViewed,
	getRecentlyViewed,
};
