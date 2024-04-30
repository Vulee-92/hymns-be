const express = require("express");
const app = express();
const http = require('http');
const dotenv = require("dotenv");
const mongoose = require("mongoose");
const routes = require("./routes");
const cors = require("cors");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const OrderNotificationService = require('./services/OrderNotificationService');
const helmet = require('helmet');
// Require the service module for Telegram
const telegramService = require('./services/telegramService/telegramService');
dotenv.config();

const port = process.env.PORT || 3001;

//  Sử dụng middleware body-parser để phân tích dữ liệu JSON
app.use(bodyParser.json({ limit: "50mb" }));

// Middleware để kiểm tra xem dữ liệu JSON có hợp lệ hay không

// Middleware để cho phép CORS từ tất cả các domain
app.use(cors({
  origin: 'https://hymnscenter.com', // Thay thế bằng domain của ứng dụng react của bạn
  credentials: true // Kích hoạt cookie cho các yêu cầu chéo nguồn (nếu cần)
}));

// Sử dụng middleware Helmet
app.use(helmet());

routes(app);

// Gắn Socket.IO với máy chủ
const server = http.createServer(app);
OrderNotificationService.initSocket(server);

// Xử lý các sự kiện khi có kết nối từ client
// const io = require('socket.io')(server,{
//  cors: {
//    origin: "http://localhost:3001", //specific origin you want to give access to,
//  },
// });

mongoose
  .connect(`${process.env.MONGO_DB}`)
  .then(() => {
    console.log("Connect Db success!");
  })
  .catch((err) => {
    console.log(err);
  });

const db = mongoose.connection;
db.once('open',() => {
  console.log('Connected to MongoDB database');
  const collection = db.collection('comments');
  const changeStream = collection.watch();
  changeStream.on('change',(change) => {
    console.log(change);
    io.emit('change',change);
  });
});

// Thêm header Cache-Control vào phản hồi của máy chủ
app.get("/",(req,res) => {
  res.setHeader("Cache-Control","no-store"); // Không lưu trữ bản sao của trang web trong bộ nhớ cache
  res.send("Hello world!");
});

app.listen(port,() => {
  console.log("Server is running in port: ",+port);
});
