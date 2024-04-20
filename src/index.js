
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

// app.use(cors());
// app.use(cors({
// 	origin: 'https://hymnscenter.online'
// }));
// app.use(
// 	cors({
// 		credentials: true,
// 		origin: 'https://www.hymnscenter.com',
// 	})
// );

// app.set('x-powered-by',false);
// app.use(cors({
// 	origin: '*',
// 	methods: 'GET,PUT,POST,DELETE',
// 	allowedHeaders: 'Content-Type,Authorization',
// 	credentials: true
// }));
// const corsOptions = {
// 	origin: "http://localhost:3001" && "http://localhost:3000", // Thiết lập domain của ứng dụng frontend
// 	methods: ['GET','PUT','POST','DELETE'], // Phương thức cho phép
// 	allowedHeaders: ['Content-Type','Authorization'], // Các header được phép
// };
// Sử dụng middleware body-parser để phân tích dữ liệu JSON
app.use(bodyParser.json());

// Middleware để kiểm tra xem dữ liệu JSON có hợp lệ hay không

// Middleware để cho phép CORS từ tất cả các domain
// app.use((req,res,next) => {
// 	res.header('Access-Control-Allow-Origin','https://www.hymnscenter.com');
// 	res.header('Access-Control-Allow-Credentials',true);
// 	res.header('Access-Control-Allow-Origin','*'); // Cho phép từ tất cả các domain
// 	res.header('Access-Control-Allow-Methods','GET, POST, OPTIONS, PUT, PATCH, DELETE');
// 	res.header('Access-Control-Allow-Headers','Origin, X-Requested-With, Content-Type, Accept');
// 	next();
// });

// app.use(cors(corsOptions));
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ limit: "50mb" }));
app.use(express.urlencoded({ extended: false }));
// app.use(bodyParser.json());
app.use(cookieParser());
// Sử dụng middleware Helmet
app.use(helmet());
routes(app);
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
