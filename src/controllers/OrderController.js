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

// Hàm format tiền theo yêu cầu (định dạng số tiền với dấu phẩy phân cách phần ngàn)
const formatAmount = (amount) => {
    return amount.toLocaleString('en-US');  // Tự động format theo chuẩn dấu phẩy
};

// Hàm tính CRC-16 theo chuẩn ISO/IEC 13239
function calculateCRC(str) {
    let crc = 0xFFFF; // Giá trị ban đầu FFFF
    for (let i = 0; i < str.length; i++) {
        crc ^= str.charCodeAt(i) << 8;
        for (let j = 0; j < 8; j++) {
            if (crc & 0x8000) {
                crc = (crc << 1) ^ 0x1021;  // Đa thức 1021
            } else {
                crc <<= 1;
            }
            crc &= 0xFFFF; // Giới hạn CRC trong 16 bit
        }
    }
    return crc.toString(16).toUpperCase().padStart(4, '0');
}

// Hàm tạo dữ liệu VietQR với số tiền và nội dung
const generateVietQRData = (amount, orderId, content) => {
    // Bước 1: Xây dựng các trường thông tin QR Code
    const version = '000201';                      // Phiên bản QR
    const method = '010212';                       // Phương thức QR tĩnh/dynamic
    const transferInfo = `38630010A000000727013300069704360119QRGD0009986320932010208QRIBFTTA`;  // Thông tin tài khoản/ngân hàng
    const currency = '5303704';   
	const formattedAmount = formatAmount(amount);                 // Mã tiền tệ (VND)
	console.log("length of formatted amount", formattedAmount.length)
	const amountLength = formattedAmount.length;
    // Bước 2: Kiểm tra và xử lý số tiền
    let numericAmount = parseFloat(amount);
 let amountFormatted = `540${amountLength}${formattedAmount}`;
    // if (numericAmount < 100000) {
        // amountFormatted = `5405${formatAmount(numericAmount)}`;  // Với số tiền nhỏ hơn 100000
    // } else {
        // amountFormatted = `5407${formatAmount(numericAmount)}`;  // Số tiền >= 100000
    // }  // Ví dụ: 600000 -> 5407600,000
    const countryCode = '5802VN';                  // Mã quốc gia (VN)
    
    // Bước 3: Xử lý nội dung (orderId và nội dung thanh toán kết hợp)
    const contentString = `${orderId} + ${content}`;  // Nội dung ví dụ: H3025 + 0986320932
    const contentLength = contentString.length.toString().padStart(2, '0');
    const additionalInfo = `622208${contentLength}${contentString}`;  // Mã nội dung: ví dụ: 6218H3025 + 0986320932

    // Bước 4: Ghép tất cả các thành phần vào chuỗi QR Code
    let rawData = version + method + transferInfo + currency + amountFormatted + countryCode + additionalInfo;

    // Bước 5: Tính toán CRC
    const crcValue = calculateCRC(rawData + "6304");  // Thêm '6304' trước khi tính CRC
    rawData += `6304${crcValue}`;  // Thêm CRC vào cuối chuỗi

    return rawData;  // Trả về chuỗi QR code hoàn chỉnh
};
const generatePaymentQRCode = async (req, res) => {
    try {
        const { amount, orderId, additionalInfo } = req.body;
        if (!amount || !orderId || !additionalInfo) {
            return res.status(400).json({ message: 'Số tiền, orderId và nội dung là bắt buộc' });
        }
        // Tạo dữ liệu VietQR
        const vietQRData = generateVietQRData(amount, orderId, additionalInfo);

        // Trả về chuỗi QR Code dạng text
        res.status(200).json({ qrCodeString: vietQRData });
    } catch (error) {
        // Xử lý lỗi
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
