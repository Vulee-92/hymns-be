// controllers/RecentlyViewedController.js
const RecentlyViewedService = require('../services/RecentlyViewedService');
const { v4: uuidv4 } = require('uuid'); // Sử dụng thư viện uuid để tạo UUID độc nhất
const updateRecentlyViewed = async (req,res) => {
	try {
		const productIdSlug = req.params.id;
		console.log("productIdSlug",productIdSlug);

		let userId = cleanUserId(req.params.userId);
		console.log("userId",userId);

		if (!productIdSlug && userId) {
			return res.status(200).json({
				status: "ERR",
				message: "The productId Or userId is required",
			});
		}

		// Kiểm tra xem userId có tồn tại hay không
		// userId = userId || uuidv4(); // Sử dụng userId nếu tồn tại, ngược lại sử dụng uuidv4()

		// let deviceId = req.cookies.deviceId || uuidv4();

		// userId = userId || deviceId; // Sử dụng userId nếu tồn tại, ngược lại sử dụng deviceId

		// // Kiểm tra và cập nhật cookie (đảm bảo đã cấu hình middleware đọc cookie)
		// res.setHeader("deviceId",deviceId,{
		// 	maxAge: 365 * 24 * 60 * 60 * 1000,
		// 	httpOnly: true,
		// 	secure: true,
		// 	sameSite: "None",
		// 	path: "/",
		// 	domain: "hymnscenter.online",
		// });

		const response = await RecentlyViewedService.updateRecentlyViewed(userId,productIdSlug);
		return res.status(200).json(response);
	} catch (e) {
		console.error(e); // In ra log chi tiết về lỗi
		return res.status(404).json({
			status: "ERR",
			message: "Có lỗi xảy ra khi cập nhật sản phẩm đã xem",
		});
	}
};



const getRecentlyViewed = async (req,res) => {
	try {
		const userId = req.params.id;
		if (!userId) {
			return res.status(200).json({
				status: "ERR",
				message: "The userId is required",
			});
		}
		const response = await RecentlyViewedService.getRecentlyViewed(userId);
		return res.status(200).json(response);
	} catch (e) {
		// console.log(e)
		return res.status(404).json({
			message: e,
		});
	}
};
const cleanUserId = (userId) => {
	if (userId) {
		return userId.replace(/"/g,'');
	}
};
module.exports = {
	updateRecentlyViewed,
	getRecentlyViewed,
};
