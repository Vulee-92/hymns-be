const Notification = require('../models/NotificationModel');

const sendNotification = async (userId, message, data) => {
  const notification = new Notification({ userId, message, data });
  await notification.save();
  return notification;
};

const getNotificationsByUser = async (userId) => {
  const notifications = await Notification.find({ userId });
  return notifications;
};

const markNotificationAsRead = async (notificationId) => {
  const notification = await Notification.findByIdAndUpdate(notificationId, { read: true }, { new: true });
  if (!notification) {
    throw new Error('Notification not found');
  }
  return notification;
};

// Thêm các hàm gửi thông báo chi tiết cho các sự kiện khác nhau
const sendOrderCreatedNotification = async (userId, orderId, orderCode) => {
  const message = `Đơn hàng mới với mã ${orderCode} đã được tạo thành công.`;
  const data = { orderId, orderCode };
  return sendNotification(userId, message, data);
};

const sendOrderStatusUpdatedNotification = async (userId, orderId, orderCode, status) => {
  const message = `Trạng thái đơn hàng ${orderCode} đã được cập nhật thành ${status}.`;
  const data = { orderId, orderCode, status };
  return sendNotification(userId, message, data);
};

const sendNewProductNotification = async (userId, productId, productName, productImage) => {
  const message = `Sản phẩm mới "${productName}" đã được đăng.`;
  const data = { productId, productName, productImage };
  return sendNotification(userId, message, data);
};

const sendProductRestockedNotification = async (userId, productId, productName, productImage) => {
  const message = `Sản phẩm "${productName}" đã có hàng trở lại.`;
  const data = { productId, productName, productImage };
  return sendNotification(userId, message, data);
};

module.exports = {
  sendNotification,
  getNotificationsByUser,
  markNotificationAsRead,
  sendOrderCreatedNotification,
  sendOrderStatusUpdatedNotification,
  sendNewProductNotification,
  sendProductRestockedNotification,
};