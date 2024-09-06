const OrderService = require("../services/OrderService");
const QRCode = require('qrcode');
const config = require('../utils/config');
const crc16 = require('crc').crc16xmodem;
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

const getAllOrder = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1; // Mặc định là trang 1 nếu không có tham số
    const pageSize = parseInt(req.query.pageSize) || 10; // Mặc định là 10 items mỗi trang

    const data = await OrderService.getAllOrder(page, pageSize);
    return res.status(200).json(data);
  } catch (e) {
    console.error(e);
    return res.status(500).json({
      status: "ERR",
      message: "An error occurred while fetching orders",
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


const deleteOrder = async (req, res) => {
  try {
    const { id } = req.params;
    const response = await OrderService.deleteOrder(id);
    return res.status(200).json(response);
  } catch (e) {
    return res.status(404).json({
      status: "ERR",
      message: e.message,
    });
  }
};

const deleteMultipleOrders = async (req, res) => {
  try {
    const { ids } = req.body;
    if (!ids || !Array.isArray(ids) || ids.length === 0) {
      return res.status(400).json({
        status: "ERR",
        message: "Invalid input: ids must be a non-empty array",
      });
    }
    const response = await OrderService.deleteMultipleOrders(ids);
    return res.status(200).json(response);
  } catch (e) {
    return res.status(500).json({
      status: "ERR",
      message: e.message,
    });
  }
};
const padLeft = (str, length) => {
	return str.length >= length ? str : new Array(length - str.length + 1).join('0') + str;
  };
  
  const generateVietQRData = (amount, orderId) => {
	const { bankCode, accountNumber, accountName } = config;
  
	const payloadFormatIndicator = '000201';
	const pointOfInitiationMethod = '010211';
	const merchantAccountInformation = `38${padLeft(bankCode.length.toString(), 2)}${bankCode}${padLeft(accountNumber.length.toString(), 2)}${accountNumber}${padLeft(accountName.length.toString(), 2)}${accountName}`;
	const merchantCategoryCode = '52040000';
	const transactionCurrency = '5303704';
	const transactionAmount = `54${padLeft(amount.toString().length.toString(), 2)}${amount}`;
	const countryCode = '5802VN';
	const merchantName = `59${padLeft(accountName.length.toString(), 2)}${accountName}`;
	const merchantCity = '6007HANOI';
  
	const data = `${payloadFormatIndicator}${pointOfInitiationMethod}${merchantAccountInformation}${merchantCategoryCode}${transactionCurrency}${transactionAmount}${countryCode}${merchantName}${merchantCity}`;
	const crc = crc16(data + '6304').toString(16).toUpperCase();
	const vietQRData = `${data}6304${crc}`;
  
	return vietQRData;
  };
const generatePaymentQRCode = async (req, res) => {
	try {
	  const { orderId, amount } = req.body;
	  if (!orderId || !amount) {
		return res.status(400).json({ message: 'Order ID và số tiền là bắt buộc' });
	  }
  
	  const vietQRData = generateVietQRData(amount, orderId);
	  const qrCodeData = await QRCode.toDataURL(vietQRData);
	  res.status(200).json({ qrCodeData });
	} catch (error) {
	  res.status(500).json({ message: 'Lỗi khi tạo mã QR', error });
	}
  };
module.exports = {
	createOrder,
	getAllOrderDetails,
	getDetailsOrder,
	cancelOrderDetails,
	getAllOrder,
	updateOrder,
	updateOrderItemsWithSlug,
	deleteOrder,
  deleteMultipleOrders,
  generatePaymentQRCode
};
