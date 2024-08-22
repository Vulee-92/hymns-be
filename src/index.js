const express = require("express");
const http = require("http");
const dotenv = require("dotenv");
const mongoose = require("mongoose");
const helmet = require("helmet");
const cors = require("cors");
const routes = require("./routes");
const OrderNotificationService = require("./services/OrderNotificationService");

dotenv.config();

const app = express();
const port = process.env.PORT || 3001;

// CORS middleware
app.use(
  cors({
    origin: ["https://www.hymnscenter.com", "https://hymnscenter.online"], // Thay bằng domain ứng dụng React của bạn
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    credentials: true, // Cho phép gửi cookie và thông tin xác thực
  })
);
app.options("*", cors()); // Kích hoạt preflight cho tất cả các route

// Sử dụng Helmet để thêm các header bảo mật
app.use(helmet());

// Sử dụng middleware để phân tích dữ liệu JSON (thay thế body-parser)
app.use(express.json({ limit: "50mb" }));

// Thiết lập các route của ứng dụng
routes(app);

// Gắn Socket.IO với máy chủ
const server = http.createServer(app);
OrderNotificationService.initSocket(server);

// Kết nối MongoDB
mongoose
  .connect(process.env.MONGO_DB, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("Connected to MongoDB database");
  })
  .catch((err) => {
    console.error("Failed to connect to MongoDB", err);
  });

// Lắng nghe sự kiện thay đổi dữ liệu trong MongoDB và thông báo cho client qua Socket.IO
const db = mongoose.connection;
db.once("open", () => {
  const collection = db.collection("comments");
  const changeStream = collection.watch();
  changeStream.on("change", (change) => {
    console.log(change);
    server.io.emit("change", change);
  });
});

// Thêm header Cache-Control vào phản hồi của máy chủ
app.get("/", (req, res) => {
  res.setHeader("Cache-Control", "no-store"); // Không lưu trữ bản sao của trang web trong bộ nhớ cache
  res.send("Hello world!");
});

// Xử lý lỗi toàn cục
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send("Something broke!");
});

// Bắt đầu máy chủ và lắng nghe trên cổng đã chỉ định
server.listen(port, () => {
  console.log("Server is running on port:", port);
});
