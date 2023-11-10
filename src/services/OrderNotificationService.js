const socketIO = require('socket.io');

let ioInstance; // Biến để lưu trữ instance của socket.io

const initSocket = (httpServer) => {
	ioInstance = socketIO(httpServer);

	ioInstance.on('connection',(socket) => {
		console.log("user here:",socket.id);

		socket.on("chatMessage",(message) => {
			socket.emit("chat message",message);
		});

		socket.on("disconnect",() => {
			socket.emit("Chat disconnected");
		});
	});
};

const sendNewOrderNotification = (orderId) => {
	console.log("orderId",orderId)
	if (!ioInstance) {
		// Socket.IO instance chưa được khởi tạo
		console.error('Socket.IO instance is not initialized.');
		return;
	}

	// Gửi thông báo mới đến tất cả các client đã kết nối
	ioInstance.emit('createOrder',{ orderId,message: 'Có đơn hàng mới' });
};

module.exports = {
	initSocket,
	sendNewOrderNotification,
};
