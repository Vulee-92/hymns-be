const Order = require('../models/OrderModel');
let clients = [];
let notificationQueue = [];
let isSending = false;

const streamOrderNotifications = async (req, res) => {
  res.setHeader('Content-Type', 'text/event-stream');
  res.setHeader('Cache-Control', 'no-cache');
  res.setHeader('Connection', 'keep-alive');

  clients.push(res);

  req.on('close', () => {
    clients = clients.filter(client => client !== res);
    if (clients.length === 0) {
      clearNotificationQueue();
    }
  });

  // Thêm delay trước khi gửi thông báo đầu tiên
  setTimeout(() => {
    if (!isSending) {
      sendOrderNotifications();
    }
  }, 7000);
};

const sendOrderNotifications = async () => {
  try {
    const orders = await Order.find().sort({ createdAt: -1, updatedAt: -1 });

    if (!orders.length) return;

    orders.forEach(order => {
      const notification = {
        fullName: order.shippingAddress.fullName,
        codeOrder: order.codeOrder,
        orderItems: order.orderItems.map(item => ({
          name: item.name,
          slug: item.slug,
          image: item.image[0]
        }))
      };
      notificationQueue.push(notification);
    });

    if (!isSending && notificationQueue.length > 0) {
      isSending = true;
      sendNotification();
    }
  } catch (error) {
    console.error('Error sending order notifications:', error);
  }
};

const sendNotification = () => {
  if (!notificationQueue.length) {
    isSending = false;
    return;
  }

  const notification = notificationQueue.shift();

  clients.forEach(client => {
    client.write(`data: ${JSON.stringify(notification)}\n\n`);
  });

  const minDelay = 7000; // 7 seconds
  const maxDelay = 15000; // 15 seconds

  const randomTime = Math.floor(Math.random() * (maxDelay - minDelay + 1)) + minDelay;

  setTimeout(sendNotification, randomTime);
};

const clearNotificationQueue = () => {
  notificationQueue = [];
  isSending = false;
};

module.exports = {
  streamOrderNotifications,
};
