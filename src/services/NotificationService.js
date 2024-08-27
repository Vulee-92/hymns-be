const Order = require('../models/OrderModel'); // Thay thế với đường dẫn đúng đến model Order
let clients = [];

const streamOrderNotifications = async (req, res) => {
  res.setHeader('Content-Type', 'text/event-stream');
  res.setHeader('Cache-Control', 'no-cache');
  res.setHeader('Connection', 'keep-alive');

  // Thêm client vào danh sách để gửi dữ liệu
  clients.push(res);

  // Khi client ngắt kết nối
  req.on('close', () => {
    clients = clients.filter(client => client !== res);
  });

  // Bắt đầu gửi thông báo sau 7 giây
  setTimeout(() => {
    sendOrderNotifications();
  }, 7000);
};

const sendOrderNotifications = async () => {
  try {
    const orders = await Order.find().sort({ createdAt: -1, updatedAt: -1 });

    // Nếu không có đơn hàng, không gửi thông báo
    if (!orders.length) return;

    let index = 0;

    const sendNotification = () => {
      if (index >= orders.length) {
        index = 0; // Quay lại vòng lặp nếu hết đơn hàng
      }

      const order = orders[index];

      // Tạo thông báo đơn giản cho đơn hàng
      const notification = {
        fullName: order.shippingAddress.fullName,
        codeOrder: order.codeOrder,
        orderItems: order.orderItems.map(item => ({
          name: item.name,
          slug: item.slug,
          image: item.image[0] // Lấy hình ảnh đầu tiên trong mảng
        }))
      };

      // Gửi thông báo cho tất cả các client
      clients.forEach(client => {
        client.write(`data: ${JSON.stringify(notification)}\n\n`);
      });

      // Tăng chỉ số để lặp qua các đơn hàng
      index++;

      // Tạo thời gian ngẫu nhiên cho lần gửi thông báo tiếp theo
      const minDelay = 10000; // 7 seconds
      const maxDelay = 20000; // 20 seconds

      const randomTime = Math.floor(Math.random() * (maxDelay - minDelay + 2)) + minDelay;

      setTimeout(sendNotification, randomTime);
    };

    // Gửi thông báo đầu tiên sau delay
    sendNotification();
  } catch (error) {
    console.error('Error sending order notifications:', error);
  }
};

module.exports = {
  streamOrderNotifications,
};
