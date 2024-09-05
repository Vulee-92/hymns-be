const express = require("express");
const http = require("http");
const dotenv = require("dotenv");
const mongoose = require("mongoose");
const helmet = require("helmet");
const cors = require("cors");
const compression = require("compression");
const rateLimit = require("express-rate-limit");
// const winston = require("winston");
const routes = require("./routes");
const OrderNotificationService = require("./services/OrderNotificationService");
const logger = require("./utils/logger");

dotenv.config();

// // Cấu hình logger
// const logger = winston.createLogger({
//   level: 'info',
//   format: winston.format.json(),
//   defaultMeta: { service: 'user-service' },
//   transports: [
//     new winston.transports.File({ filename: 'error.log', level: 'error' }),
//     new winston.transports.File({ filename: 'combined.log' }),
//   ],
// });

// if (process.env.NODE_ENV !== 'production') {
//   logger.add(new winston.transports.Console({
//     format: winston.format.simple(),
//   }));
// }

const app = express();
const port = process.env.PORT || 3001;

app.use(cors());

// CORS middleware
// app.use(cors({
//   origin: [process.env.FRONTEND_URL, process.env.BACKEND_URL],
//   methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
//   credentials: true,
// }));

// Sử dụng Helmet để thêm các header bảo mật
app.use(helmet());

// Compression middleware
app.use(compression());

// Sử dụng middleware để phân tích dữ liệu JSON
app.use(express.json({ limit: "10mb" }));

// Thiết lập các route của ứng dụng
routes(app);

// Gắn Socket.IO với máy chủ
const server = http.createServer(app);
OrderNotificationService.initSocket(server);

// Kết nối MongoDB
mongoose.connect(process.env.MONGO_DB, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => logger.info("Connected to MongoDB database"))
.catch((err) => logger.error("Failed to connect to MongoDB", { error: err }));

// Lắng nghe sự kiện thay đổi dữ liệu trong MongoDB
const db = mongoose.connection;
db.once("open", () => {
  const collection = db.collection("comments");
  const changeStream = collection.watch();
  changeStream.on("change", (change) => {
    logger.info("Database change detected", { change });
    server.io.emit("change", change);
  });
});

// Root route
app.get("/", (req, res) => {
  res.setHeader("Cache-Control", "no-store");
  res.send("Hello world!");
});

// Xử lý lỗi toàn cục
app.use((err, req, res, next) => {
  logger.error(err.stack);
  res.status(500).send("Something broke!");
});

// Bắt đầu máy chủ
server.listen(port, () => {
  logger.info(`Server is running on port: ${port}`);
});

// Graceful shutdown
process.on('SIGTERM', () => {
  logger.info('SIGTERM signal received: closing HTTP server');
  server.close(() => {
    logger.info('HTTP server closed');
    mongoose.connection.close(false, () => {
      logger.info('MongoDB connection closed');
      process.exit(0);
    });
  });
});
