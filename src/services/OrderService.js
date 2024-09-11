const TelegramBot = require('node-telegram-bot-api');
const EventEmitter = require('events');
const orderEventEmitter = new EventEmitter();
const telegramService = require('./telegramService/telegramService');
const Order = require("../models/OrderModel");
const Product = require("../models/ProductModel");
const EmailService = require("../services/EmailService");
const EmailServiceIsPaid = require("../services/EmailServiceIsPaid");
const OrderNotificationService = require('./OrderNotificationService');
const { log } = require('console');
const Shipping = require('../models/ShippingModel');
// Chọn token dựa trên môi trường
   const token = process.env.NODE_ENV === 'production' 
     ? process.env.TELEGRAM_TOKEN_PROD 
     : process.env.TELEGRAM_TOKEN_DEV;
const bot = new TelegramBot(token, { polling: false });

// Hàm tiện ích để xử lý lỗi
const handleError = (error, message = 'Đã xảy ra lỗi') => {
  console.error(message, error);
  return { status: 'ERR', message: message };
};

// Hàm tiện ích để trả về kết quả thành công
const handleSuccess = (data, message = 'Thành công') => {
  return { status: 'OK', message, data };
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
	console.log("amount, orderId, content",amount, orderId, content);
	// Bước 1: Xây dựng các trường thông tin QR Code
	const version = '000201';                      // Phiên bản QR
	const method = '010212';                       // Phương thức QR tĩnh/dynamic
	const transferInfo = `38630010A000000727013300069704360119QRGD0009986320932010208QRIBFTTA`;  // Thông tin tài khoản/ngân hàng
	const currency = '5303704';   
const formattedAmount = formatAmount(amount);                 // Mã tiền tệ (VND)
const amountLength = formattedAmount.length;
let amountFormatted = `540${amountLength}${formattedAmount}`;
	const countryCode = '5802VN';                
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
const generatePaymentQRCode = async (amount, orderId, additionalInfo) => {
  try {
    // Tạo dữ liệu VietQR
    const vietQRData = generateVietQRData(amount, orderId, additionalInfo);
		console.log("vietQRData",vietQRData);
    // Trả về chuỗi QR Code dạng text
    return { qrCodeString: vietQRData };
  } catch (error) {
    // Xử lý lỗi
    throw new Error('Lỗi khi tạo mã QR: ' + error.message);
  }
};
const createShippingData = async (createdOrder, newOrder) => {
  const shippingData = {
    orderId: createdOrder._id,
    trackingNumber: `TRK-${Math.floor(1000 + Math.random() * 9000)}`,
    carrier: newOrder.carrier, // Tham chiếu đến Carrier
    status: 'pending',
    shippingAddress: {
      street: newOrder.address,
      city: newOrder.city,
      state: newOrder.province,
      postalCode: '000000', // Thêm mã bưu điện nếu có
      country: 'VN' // Thêm quốc gia nếu có
    }
  };
  return Shipping.create(shippingData);
};
const updateProductStock = async (orderItems) => {
  const promises = orderItems.map(async (order) => {
    const productData = await Product.findOneAndUpdate(
      {
        _id: order.product,
        countInStock: { $gte: order.amount },
      },
      {
        $inc: {
          countInStock: -order.amount,
          selled: +order.amount,
        },
      },
      { new: true }
    );

    if (productData) {
      return { status: "OK", message: "SUCCESS" };
    } else {
      return { status: "ERR", id: order.product };
    }
  });

  return Promise.all(promises);
};


const sendOrderNotification = (createdOrder) => {
  const chatId = '6749566951';
  const message = `
    🛵 🛒 - Đơn hàng mới
    Ngày đặt: ${createdOrder.createdAt}
    ${createdOrder.shippingAddress.city ? 'Đơn trong thành phố Tam Kỳ' : 'Đơn đi tỉnh'}
    📞 ${createdOrder.shippingAddress.phone} 
    (SNew) - Tên: ${createdOrder.shippingAddress.fullName} - Phiếu: ${createdOrder.codeOrder}
    Sản phẩm:
    ${createdOrder.orderItems.map(order => `+ ${order.name}: ${order.amount} x ${order.price}\n`).join('')}
    Tổng tiền (đơn hàng & vận chuyển): ${createdOrder.totalPrice}
    Địa chỉ giao hàng: ${createdOrder.shippingAddress.address},${createdOrder.shippingAddress.ward}, 
    ${createdOrder.shippingAddress.city}, ${createdOrder.shippingAddress.province}`;
  bot.sendMessage(chatId, message);
};

const createOrder = async (newOrder) => {
  try {
    const {
      orderItems,
      paymentMethod,
      shippingMethod,
      itemsPrice,
      shippingPrice,
      totalPrice,
      fullName,
      address,
      city,
      phone,
      fee,
      user,
      orderStatus,
      province,
      ward,
      isPaid,
      paidAt,
      email,
    } = newOrder;
    const codeOrder = `H-${Math.floor(1000 + Math.random() * 9000)}`;
const results = await updateProductStock(orderItems);
    const newData = results.filter((item) => item.status === "ERR");

    if (newData.length) {
      const arrId = newData.map(item => item.id);
      return handleError(null, `San pham voi id: ${arrId.join(",")} khong du hang`); 
    }
      const createdOrder = await Order.create({
        orderItems,
        shippingAddress: {
          fullName,
          address,
          city,
          phone,
          province,
          fee,
          ward,
          email
        },
        paymentMethod,
        shippingMethod,
        codeOrder,
        itemsPrice,
        shippingPrice,
        totalPrice,
        user: user || null,
        isPaid,
        paidAt,
        orderStatus
      });
  
      const qrCodeData = await generatePaymentQRCode(createdOrder.totalPrice, createdOrder.codeOrder, createdOrder.shippingAddress.phone);
      createdOrder.qrCode = qrCodeData.qrCodeString;
      await createdOrder.save();
  
      const createdShipping = await createShippingData(createdOrder, newOrder);
      createdOrder.shipping = createdShipping._id;
      await createdOrder.save();
  
      sendOrderNotification(createdOrder);
      await EmailService.sendEmailCreateOrder(email, createdOrder);
      OrderNotificationService.sendNewOrderNotification(createdOrder._id);
  
      return handleSuccess({
        id: createdOrder._id,
        order: createdOrder,
        qrCode: qrCodeData.qrCodeString
      }, 'Tạo đơn hàng thành công');
    } catch (error) {
      return handleError(error, 'Lỗi khi tạo đơn hàng');
    }                                             
};

const getAllOrderDetails = async (email) => {
  try {
    const order = await Order.find({ user: email });
    if (!order) {
      return handleError(null, 'Không tìm thấy đơn hàng');
    }
    return handleSuccess(order, 'Lấy thông tin đơn hàng thành công');
  } catch (error) {
    return handleError(error, 'Lỗi khi lấy thông tin đơn hàng');
  }
};
const getDetailsOrder = async (id) => {
  try {
    const order = await Order.findById(id);
    
    // Kiểm tra xem đơn hàng có tồn tại không
    if (!order) {
      return handleError(null, 'Không tìm thấy đơn hàng');
    }

    // Chuyển đổi số điện thoại
    const formattedPhone = order.shippingAddress.phone.replace(/\D/g, ''); 
		const formattedOrderId =  order.codeOrder.replace('-', ''); 
    // Tạo mã QR code
    const qrCodeData = await generatePaymentQRCode(order.totalPrice, formattedOrderId, formattedPhone);

    console.log("qrCodeData", qrCodeData);
    
    // Trả về thông tin đơn hàng và mã QR code
    return handleSuccess({
      data: order,
      qrCode: qrCodeData.qrCodeString // Trả về mã QR code
    }, 'Lấy thông tin đơn hàng thành công');
  } catch (error) {
    return handleError(error, 'Lỗi khi lấy thông tin đơn hàng');
  }
};

const cancelOrderDetails = async (id, data) => {
  try {
    const promises = data.map(async (order) => {
      const productData = await Product.findOneAndUpdate(
        {
          _id: order.product,
          selled: { $gte: order.amount },
        },
        {
          $inc: {
            countInStock: +order.amount,
            selled: -order.amount,
          },
        },
        { new: true }
      );
      if (!productData) {
        return {
          status: "ERR",
          message: "The product is not available or the requested amount is not valid",
          id: order.product,
        };
      }
    });

    const results = await Promise.all(promises);

    // Check if any products are not available
    const unavailableProducts = results.filter((result) => result && result.status === "ERR");
    if (unavailableProducts.length > 0) {
      return handleError(null, "Some products are not available or the requested amounts are not valid", { unavailableProducts });
    } else {
      // Update order status in the database
      await Order.updateMany({ _id: id }, { $set: { orderStatus: false } });

      // Send cancellation email
      const updatedOrder = await Order.findById(id);
      if (updatedOrder) {
        await EmailServiceIsPaid.sendEmailOrderIsPaid(updatedOrder);
        return handleSuccess(data.map((order) => ({ ...order, orderStatus: false })), "Order cancellation successful. Email sent.");
      } else {
        return handleError(null, "Failed to send cancellation email.", data.map((order) => ({ ...order, orderStatus: false })));
      }
    }
  } catch (error) {
    return handleError(error, 'Lỗi khi hủy đơn hàng');
  }
};

const getAllOrder = async (page, pageSize) => {
  try {
    const skip = (page - 1) * pageSize;
    
    const orders = await Order.find()
      .sort({ createdAt: -1 }) // Sắp xếp theo thời gian tạo, mới nhất trước
      .skip(skip)
      .limit(pageSize);

    const totalOrders = await Order.countDocuments();
    const totalPages = Math.ceil(totalOrders / pageSize);

    return {
      status: "OK",
      message: "Success",
      data: orders,
      pagination: {
        currentPage: page,
        pageSize: pageSize,
        totalPages: totalPages,
        totalItems: totalOrders
      }
    };
  } catch (error) {
    throw new Error("Error getting all orders: " + error.message);
  }
};

const updateOrder = async (id, data) => {
  try {
    const checkOrder = await Order.findOne({ _id: id });
    if (!checkOrder) {
      return handleError(null, 'Không tìm thấy đơn hàng');
    }
    const isPaidSuccess = `https://www.hymnscenter.com/order-success/${id}`;
    const updatedOrder = await Order.findByIdAndUpdate(id, data, { new: true });
    if (updatedOrder) {
      await EmailServiceIsPaid.sendEmailOrderIsPaid(updatedOrder, isPaidSuccess);
      return handleSuccess(updatedOrder, 'Cập nhật đơn hàng thành công');
    }
  } catch (error) {
    return handleError(error, 'Lỗi khi cập nhật đơn hàng');
  }
};

const updateOrderItemsWithSlug = async () => {
  try {
    const orders = await Order.find({});

    for (let order of orders) {
      let isUpdated = false;

      for (let item of order.orderItems) {
        const product = await Product.findById(item.product);
        if (product && product.slug) {
          item.slug = product.slug;
          isUpdated = true;
        }
      }

      if (isUpdated) {
        await order.save();
      }
    }

    console.log('Cập nhật slug cho các đơn hàng thành công.');
  } catch (error) {
    console.error('Có lỗi xảy ra:', error);
  }
};
const deleteOrder = async (id) => {
  try {
    const deletedOrder = await Order.findByIdAndDelete(id);
    if (!deletedOrder) {
      throw new Error("Order not found");
    }
    return { status: "OK", message: "Order deleted successfully" };
  } catch (error) {
    throw new Error("Error deleting order: " + error.message);
  }
};

const deleteMultipleOrders = async (ids) => {
  try {
    const result = await Order.deleteMany({ _id: { $in: ids } });
    if (result.deletedCount === 0) {
      throw new Error("No orders found with the given ids");
    }
    return { status: "OK", message: `${result.deletedCount} orders deleted successfully` };
  } catch (error) {
    throw new Error("Error deleting multiple orders: " + error.message);
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
  deleteMultipleOrders
};