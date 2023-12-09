
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
app.use(cookieParser());
routes(app);
dotenv.config();

const port = process.env.PORT || 3001;

// app.use(cors());
app.use(cors({
	origin: 'http://localhost:3003/'
}));


app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ limit: "50mb" }));
// app.use(express.urlencoded({ extended: false }));
// app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
// Gắn Socket.IO với máy chủ
const server = http.createServer(app);
OrderNotificationService.initSocket(server);
// Xử lý các sự kiện khi có kết nối từ client
// const io = require('socket.io')(server,{
// 	cors: {
// 		origin: "http://localhost:3001", //specific origin you want to give access to,
// 	},
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
