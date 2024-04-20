// // const TelegramBot = require('node-telegram-bot-api');

// // // replace the value below with the Telegram token you receive from @BotFather
// // const token = '6406604997:AAH6HtDPxvqQ_92uDTlHIo4tBBlK43v2Odk';

// // const bot = new TelegramBot(token,{
// // 	polling: true,
// // });

// // // Function to send order information
// // function sendOrderInfo(chatId,orderInfo) {
// // 	bot.sendMessage(chatId,orderInfo);
// // }

// // // Listen for any kind of message.
// // bot.on('message',(msg) => {
// // 	const chatId = msg.chat.id;
// // 	// Example order information
// // 	const orderInfo = `
// // 🛵 🛒. 
// // Ngày đặt: 01/01/2024 12:37
// // Đơn đến cửa hàng
// // 📞 0903953999 (SNew) - Tên: Anh Tuấn - Phiếu: DH.148TC.24.01.000003 
// // Sản phẩm:
// // + SAMSUNG GALAXY S23 ULTRA DÁN CHỐNG VA ĐẬP ZEELOT UV LOCA FULL CAO CẤP ĐEN: 1 x 390.000

// // Tổng tiền (đơn hàng): 382.000


// // Đ/c: KĐCH
// // NV: NGUYỄN THÀNH LUÂN. Mã: S07004`;

// // 	// Send the order information
// // 	sendOrderInfo(chatId,orderInfo);
// // });

// const TelegramBot = require('node-telegram-bot-api');

// // replace the value below with the Telegram token you receive from @BotFather
// const token = '6406604997:AAH6HtDPxvqQ_92uDTlHIo4tBBlK43v2Odk';

// const bot = new TelegramBot(token,{
// 	polling: true,
// });

// // Function to send order information
// function sendOrderInfo(createdOrder) {
// 	const orderInfo = formatOrderInfo(createdOrder);
// 	const chatId = '6749566951';
// 	// Format order information as needed
// 	bot.sendMessage(chatId,orderInfo);
// }

// // Format order information as needed
// function formatOrderInfo(order) {
// 	// Implement logic to format order information based on your requirements
// 	// For example, you can extract relevant information from the 'order' object
// 	// and format it as a string before sending.
// 	// The following is just an example, modify it according to your actual order structure.
// 	return `
//     // 🛵 🛒.
// // Ngày đặt: 01/01/2024 12:37
// // Đơn đến cửa hàng
// // 📞 0903953999 (SNew) - Tên: Anh Tuấn - Phiếu: DH.148TC.24.01.000003
// // Sản phẩm:
// // + SAMSUNG GALAXY S23 ULTRA DÁN CHỐNG VA ĐẬP ZEELOT UV LOCA FULL CAO CẤP ĐEN: 1 x 390.000

// // Tổng tiền (đơn hàng): 382.000


// // Đ/c: KĐCH
// // NV: NGUYỄN THÀNH LUÂN. Mã: S07004
//   `;
// }

// module.exports = {
// 	sendOrderInfo,
// };
