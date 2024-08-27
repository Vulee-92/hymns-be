const Order = require('../models/OrderModel'); // Thay thế với đường dẫn đúng đến model Order
let clients = [];
let notificationQueue = [];
let isSending = false;

const streamOrderNotifications = async (req, res) => {
  res.setHeader('Content-Type', 'text/event-stream');
  res.setHeader('Cache-Control', 'no-cache');
  res.setHeader('Connection', 'keep-alive');

  // Thêm client vào danh sách để gửi dữ liệu
  clients.push(res);

  // Khi client ngắt kết nối
  req.on('close', () => {
    clients = clients.filter(client => client !== res);
    if (clients.length === 0) {
      clearNotificationQueue(); // Xóa hàng đợi khi không còn client nào kết nối
    }
  });

  // Thêm 7 giây delay trước khi gửi thông báo đầu tiên
  setTimeout(() => {
    if (!isSending) {
      sendOrderNotifications();
    }
  }, 7000);
};

const sendOrderNotifications = async () => {
  try {
    const orders = await Order.find().sort({ createdAt: -1, updatedAt: -1 });

    // Nếu không có đơn hàng, không gửi thông báo
    if (!orders.length) return;

    // Đưa tất cả các đơn hàng vào hàng đợi thông báo
    orders.forEach(order => {
      const notification = {
        fullName: order.shippingAddress.fullName,
        codeOrder: order.codeOrder,
        orderItems: order.orderItems.map(item => ({
          name: item.name,
          slug: item.slug,
          image: item.image[0] // Lấy hình ảnh đầu tiên trong mảng
        }))
      };
      notificationQueue.push(notification);
    });

    // Bắt đầu gửi thông báo
    if (!isSending) {
      isSending = true;
      sendNotification();
    }
  } catch (error) {
    console.error('Error sending order notifications:', error);
  }
};

const sendNotification = () => {
  if (!notificationQueue.length) {
    isSending = false; // Dừng việc gửi nếu hàng đợi rỗng
    return;
  }

  const notification = notificationQueue.shift(); // Lấy thông báo đầu tiên trong hàng đợi

  // Gửi thông báo cho tất cả các client
  clients.forEach(client => {
    client.write(`data: ${JSON.stringify(notification)}\n\n`);
  });

  // Tạo thời gian ngẫu nhiên cho lần gửi thông báo tiếp theo
  const minDelay = 5000; // 7 seconds
  const maxDelay = 20000; // 15 seconds

  const randomTime = Math.floor(Math.random() * (maxDelay - minDelay + 1)) + minDelay;

  setTimeout(sendNotification, randomTime); // Tiếp tục gửi thông báo sau thời gian delay ngẫu nhiên
};

const clearNotificationQueue = () => {
  notificationQueue = [];
  isSending = false;
};

module.exports = {
  streamOrderNotifications,
};
