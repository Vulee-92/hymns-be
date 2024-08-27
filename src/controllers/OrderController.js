const OrderService = require("../services/OrderService");
const createOrder = async (req,res) => {
	try {
		const {
			paymentMethod,
			shippingMethod,
			itemsPrice,
			shippingPrice,
			totalPrice,
			fullName,
			address,
			city,
			province,
			ward,
			email,
			phone,
		} = req.body;

		const requiredFields = [];

		if (!paymentMethod) requiredFields.push("paymentMethod");
		if (!shippingMethod) requiredFields.push("shippingMethod");
		if (!itemsPrice) requiredFields.push("itemsPrice");
		if (typeof shippingPrice === 'undefined' || shippingPrice === null) {
			requiredFields.push("shippingPrice");
		}
		if (!totalPrice) requiredFields.push("totalPrice");
		if (!fullName) requiredFields.push("fullName");
		if (!address) requiredFields.push("address");
		if (!city) requiredFields.push("city");
		if (!province) requiredFields.push("province");
		if (!ward) requiredFields.push("ward");
		if (!email) requiredFields.push("email");
		if (!phone) requiredFields.push("phone");

		if (requiredFields.length > 0) {
			return res.status(200).json({
				status: "ERR",
				message: "The following fields are required",
				fields: requiredFields,
			});
		}

		const response = await OrderService.createOrder(req.body);
		return res.status(200).json(response);
	} catch (e) {
		return res.status(404).json({
			message: e,
		});
	}
};


const getAllOrderDetails = async (req,res) => {
	try {
		const userId = req.params.id;
		if (!userId) {
			return res.status(200).json({
				status: "ERR",
				message: "The userId is required",
			});
		}
		const response = await OrderService.getAllOrderDetails(userId);
		return res.status(200).json(response);
	} catch (e) {
		// console.log(e)
		return res.status(404).json({
			message: e,
		});
	}
};

const getDetailsOrder = async (req,res) => {
	try {
		const orderId = req.params.id;
		if (!orderId) {
			return res.status(200).json({
				status: "ERR",
				message: "The userId is required",
			});
		}
		const response = await OrderService.getDetailsOrder(orderId);
		return res.status(200).json(response);
	} catch (e) {
		// console.log(e)
		return res.status(404).json({
			message: e,
		});
	}
};

const cancelOrderDetails = async (req,res) => {
	try {
		const data = req.body.orderItems;
		const orderId = req.body.orderId;
		if (!orderId) {
			return res.status(200).json({
				status: "ERR",
				message: "The orderId is required",
			});
		}
		const response = await OrderService.cancelOrderDetails(orderId,data);
		return res.status(200).json(response);
	} catch (e) {
		// console.log(e)
		return res.status(404).json({
			message: e,
		});
	}
};

const getAllOrder = async (req,res) => {
	try {
		const data = await OrderService.getAllOrder();
		return res.status(200).json(data);
	} catch (e) {
		// console.log(e)
		return res.status(404).json({
			message: e,
		});
	}
};
const updateOrderItemsWithSlug = async (req, res) => {
	try {
			await OrderService.updateOrderItemsWithSlug(); // Gọi service để cập nhật slug
			res.status(200).json({
					status: 'OK',
					message: 'Cập nhật slug cho các đơn hàng thành công.'
			});
	} catch (error) {
			console.error('Có lỗi xảy ra:', error);
			res.status(500).json({
					status: 'ERR',
					message: 'Có lỗi xảy ra khi cập nhật slug.',
					error: error.message
			});
	}
};
const updateOrder = async (req,res) => {
	try {
		const orderId = req.params.id;
		const data = req.body;
		if (!orderId) {
			return res.status(200).json({
				status: "ERR",
				message: "The orderId is required",
			});
		}
		const response = await OrderService.updateOrder(orderId,data);
		console.log("updateOrder",response)
		return res.status(200).json(response);
	} catch (e) {
		return res.status(404).json({
			message: e,
		});
	}
};
module.exports = {
	createOrder,
	getAllOrderDetails,
	getDetailsOrder,
	cancelOrderDetails,
	getAllOrder,
	updateOrder,
	updateOrderItemsWithSlug
};
