const express = require("express");
const app = express();
const http = require('http');
const dotenv = require("dotenv");
const mongoose = require("mongoose");
const routes = require("./routes");
const bodyParser = require("body-parser");
const OrderNotificationService = require('./services/OrderNotificationService');
const helmet = require('helmet');
const cors = require('cors'); // Thêm cors
dotenv.config();

const port = process.env.PORT || 3001;

// Sử dụng middleware body-parser để phân tích dữ liệu JSON
app.use(bodyParser.json({ limit: "50mb" }));

app.use(cors({
  origin: '*', // Hoặc cấu hình domain cụ thể
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'], // Đảm bảo tất cả các phương thức bạn cần đều được liệt kê
  allowedHeaders: ['Content-Type', 'Authorization'] // Đảm bảo các headers cần thiết đều được chấp nhận
}));

// Thiết lập các route của ứng dụng
routes(app);

// Gắn Socket.IO với máy chủ
const server = http.createServer(app);
OrderNotificationService.initSocket(server);

// Thiết lập kết nối MongoDB
mongoose
  .connect(process.env.MONGO_DB, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    console.log("Connected to MongoDB database");
  })
  .catch((err) => {
    console.error("Failed to connect to MongoDB", err);
  });

// Lắng nghe sự kiện thay đổi dữ liệu trong MongoDB và thông báo cho client qua Socket.IO
const db = mongoose.connection;
db.once('open', () => {
  const collection = db.collection('comments');
  const changeStream = collection.watch();
  changeStream.on('change', (change) => {
    console.log(change);
    server.io.emit('change', change);
  });
});

// Thêm header Cache-Control vào phản hồi của máy chủ
app.get("/", (req, res) => {
  res.setHeader("Cache-Control", "no-store"); // Không lưu trữ bản sao của trang web trong bộ nhớ cache
  res.send("Hello world!");
});

// Bắt đầu máy chủ và lắng nghe trên cổng đã chỉ định
server.listen(port, () => {
  console.log("Server is running on port:", port);
});
