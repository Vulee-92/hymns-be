const TelegramBot = require('node-telegram-bot-api');
const EventEmitter = require('events');
const orderEventEmitter = new EventEmitter();
const telegramService = require('./telegramService/telegramService');
const Order = require("../models/OrderModel");
const Product = require("../models/ProductModel");
const EmailService = require("../services/EmailService");
const EmailServiceIsPaid = require("../services/EmailServiceIsPaid");
const OrderNotificationService = require('./OrderNotificationService');

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
        return {
          status: "OK",
          message: "SUCCESS",
        };
      } else {
        return {
          status: "OK",
          message: "ERR",
          id: order.product,
        };
      }
    });

    const results = await Promise.all(promises);
    const userId = user ? user : null;
    const newData = results && results.filter((item) => item.id);
    if (newData.length) {
      const arrId = [];
      newData.forEach((item) => {
        arrId.push(item.id);
      });
      return handleError(null, `San pham voi id: ${arrId.join(",")} khong du hang`);
    } else {
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
        user: userId,
        isPaid,
        paidAt,
        orderStatus
      });

      // Lấy id của đơn hàng vừa tạo
      const orderId = createdOrder._id;
      if (createdOrder) {
        // Gửi thông báo đơn hàng mới khi tạo thành công
        const chatId = '6749566951';
        const message = `
        🛵 🛒 - Đơn hàng mới
        Ngày đặt: ${(
          createdOrder?.createdAt
        )}
        ${createdOrder?.shippingAddress?.city ? 'Đơn trong thành phố Tam Kỳ' : 'Đơn đi tỉnh'}
        📞 ${createdOrder?.shippingAddress?.phone} (SNew) - Tên: ${createdOrder?.shippingAddress?.fullName} - Phiếu: ${createdOrder?.codeOrder}
        Sản phẩm:
        ${createdOrder?.orderItems
            ?.map((order) => {
              return `+ ${order?.name}: ${order?.amount} x ${order?.price}\n`
            })}
        Tổng tiền (đơn hàng & vận chuyển): ${(createdOrder?.totalPrice)}
        Địa chỉ giao hàng: ${createdOrder?.shippingAddress?.address},${createdOrder?.shippingAddress?.ward}, ${createdOrder?.shippingAddress?.city}, ${createdOrder?.shippingAddress?.province}`;
        bot.sendMessage(chatId, message);

        await EmailService.sendEmailCreateOrder(email, createdOrder);
        OrderNotificationService.sendNewOrderNotification(orderId);

        return handleSuccess({ id: orderId }, 'Tạo đơn hàng thành công');
      }
    }
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
    if (!order) {
      return handleError(null, 'Không tìm thấy đơn hàng');
    }
    return handleSuccess(order, 'Lấy thông tin đơn hàng thành công');
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

const getAllOrder = async () => {
  try {
    const allOrder = await Order.find().sort({
      createdAt: -1,
      updatedAt: -1,
    });
    return handleSuccess(allOrder, 'Lấy danh sách đơn hàng thành công');
  } catch (error) {
    return handleError(error, 'Lỗi khi lấy danh sách đơn hàng');
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

module.exports = {
  createOrder,
  getAllOrderDetails,
  getDetailsOrder,
  cancelOrderDetails,
  getAllOrder,
  updateOrder,
  updateOrderItemsWithSlug
};