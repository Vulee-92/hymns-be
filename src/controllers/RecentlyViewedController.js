// controllers/RecentlyViewedController.js
const RecentlyViewedService = require('../services/RecentlyViewedService');
const { v4: uuidv4 } = require('uuid'); // Sử dụng thư viện uuid để tạo UUID độc nhất
const updateRecentlyViewed = async (req,res) => {
	try {
		const productIdSlug = req.params.id;
		console.log("productIdSlug",productIdSlug)
		if (!productIdSlug) {
			return res.status(200).json({
				status: "ERR",
				message: "The productId is required",
			});
		}
		let userId = req.cookies.userId;
		console.log("userId",userId)
		let deviceId = req.cookies.deviceId || uuidv4();
		userId = userId || deviceId;

		res.cookie('deviceId',deviceId,{
			maxAge: 900000,httpOnly: false,sameSite: 'Lax',
			secure: true,
		});
		console.log("deviceId",deviceId)
		localStorage.setItem('deviceId',deviceId);
		localStorage.setItem('userId',userId);
		// Kiểm tra nếu không có cookie userId, tạo mới và gửi về cho người dùng
		// if (!req.cookies.userId) {
		res.cookie("userId",userId,{
			maxAge: 900000,httpOnly: false,sameSite: 'Lax',
			secure: true,
		});
		// }
		res.send('Cookie đã được đặt thành công!');
		const response = await RecentlyViewedService.updateRecentlyViewed(deviceId,productIdSlug);
		return res.status(200).json(response);
	} catch (e) {
		console.error(e); // In ra log chi tiết về lỗi
		return res.status(404).json({
			status: 'ERR',
			message: 'Có lỗi xảy ra khi cập nhật sản phẩm đã xem',
		});
	}
};


const getRecentlyViewed = async (req,res) => {
	try {
		const userId = req.cookies.deviceId;
		console.log("userId",userId)
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
module.exports = {
	updateRecentlyViewed,
	getRecentlyViewed,
};
