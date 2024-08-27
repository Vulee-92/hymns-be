const TelegramBot = require('node-telegram-bot-api');
const EventEmitter = require('events');
const orderEventEmitter = new EventEmitter();
const telegramService = require('./telegramService/telegramService');
const Order = require("../models/OrderModel");
const Product = require("../models/ProductModel");
const EmailService = require("../services/EmailService");
const EmailServiceIsPaid = require("../services/EmailServiceIsPaid");
const OrderNotificationService = require('./OrderNotificationService');
const token = '6551170125:AAEAtDG4bpoRFtt1CIWt_WYcVhiH9qxptYk';
const bot = new TelegramBot(token,{ polling: true });
const createOrder = (newOrder) => {
	return new Promise(async (resolve,reject) => {
		const {
			orderItems,
			paymentMethod,
			shippingMethod,
			itemsPrice,
			shippingPrice,
			totalPrice,
			fullName,
			address,
			city,
			phone,
			fee,
			user,
			orderStatus,
			province,
			ward,
			isPaid,
			paidAt,
			email,
		} = newOrder;
		const codeOrder = `H-${Math.floor(1000 + Math.random() * 9000)}`;

		try {
			const promises = orderItems.map(async (order) => {
				const productData = await Product.findOneAndUpdate(
					{
						_id: order.product,
						countInStock: { $gte: order.amount },
					},
					{
						$inc: {
							countInStock: -order.amount,
							selled: +order.amount,
						},
					},
					{ new: true }
				);

				if (productData) {
					return {
						status: "OK",
						message: "SUCCESS",
					};
				} else {
					return {
						status: "OK",
						message: "ERR",
						id: order.product,
					};
				}
			});
			const results = await Promise.all(promises);
			const userId = user ? user : null;
			const newData = results && results.filter((item) => item.id);
			if (newData.length) {
				const arrId = [];
				newData.forEach((item) => {
					arrId.push(item.id);
				});
				resolve({
					status: "ERR",
					message: `San pham voi id: ${arrId.join(",")} khong du hang`,
				});
			} else {
				const createdOrder = await Order.create({
					orderItems,
					shippingAddress: {
						fullName,
						address,
						city,
						phone,
						province,
						fee,
						ward,
						email
					},
					paymentMethod,
					shippingMethod,
					codeOrder,
					itemsPrice,
					shippingPrice,
					totalPrice,
					user: userId,
					isPaid,
					paidAt,
					orderStatus
				});

				// Lấy id của đơn hàng vừa tạo
				const orderId = createdOrder._id;
				if (createdOrder) {
					// Gửi thông báo đơn hàng mới khi tạo thành công
				
					const chatId = '6749566951';
					const message = `
					🛵 🛒 - Đơn hàng mới
					Ngày đặt: ${(
						createdOrder?.createdAt
					)}
					${createdOrder?.shippingAddress?.city ? 'Đơn trong thành phố Tam Kỳ' : 'Đơn đi tỉnh'}
					📞 ${createdOrder?.shippingAddress?.phone} (SNew) - Tên: ${createdOrder?.shippingAddress?.fullName} - Phiếu: ${createdOrder?.codeOrder}
					Sản phẩm:
					${createdOrder?.orderItems
							?.map((order) => {
								return `+ ${order?.name}: ${order?.amount} x ${order?.price}\n`
							})}
					Tổng tiền (đơn hàng & vận chuyển): ${(createdOrder?.totalPrice)}
					Địa chỉ giao hàng: ${createdOrder?.shippingAddress?.address},${createdOrder?.shippingAddress?.ward}, ${createdOrder?.shippingAddress?.city}, ${createdOrder?.shippingAddress?.province}`;
					bot.sendMessage(chatId,message);
					resolve({
						status: "OK",
						message: "success",
						id: orderId
					});

					await EmailService.sendEmailCreateOrder(email,createdOrder);
					OrderNotificationService.sendNewOrderNotification(orderId);
				}
			}
		} catch (e) {
			console.log("e",e);
			reject(e);
		}
	});
};

// const deleteManyProduct = (ids) => {
//     return new Promise(async (resolve, reject) => {
//         try {
//             await Product.deleteMany({ _id: ids })
//             resolve({
//                 status: 'OK',
//                 message: 'Delete product success',
//             })
//         } catch (e) {
//             reject(e)
//         }
//     })
// }

// const getAllOrderDetails = (id) => {
//   return new Promise(async (resolve, reject) => {
//     try {
//       const order = await Order.find({
//         user: id,z
//       }).sort({ createdAt: -1, updatedAt: -1 });
//       if (order === null) {
//         resolve({
//           status: "ERR",
//           message: "The order is not defined",
//         });
//       }

//       resolve({
//         status: "OK",
//         message: "SUCESSS",
//         data: order,
//       });
//     } catch (e) {
//       reject(e);
//     }
//   });
// };

const getAllOrderDetails = (email) => {
	return new Promise(async (resolve,reject) => {
		try {
			const order = await Order.find({
				user: email,
			});
			if (order === null) {
				resolve({
					status: "ERR",
					message: "The order is not defined",
				});
			}

			resolve({
				status: "OK",
				message: "SUCESSS",
				data: order,
			});
		} catch (e) {
			reject(e);
		}
	});
};
const getDetailsOrder = (id) => {
	return new Promise(async (resolve,reject) => {
		try {
			const order = await Order.findById({
				_id: id,
			});
			if (order === null) {
				resolve({
					status: "ERR",
					message: "The order is not defined",
				});
			}

			resolve({
				status: "OK",
				message: "SUCESSS",
				data: order,
			});
		} catch (e) {
			reject(e);
		}
	});
};
// const cancelOrderDetails = (id,data) => {
// 	return new Promise(async (resolve,reject) => {
// 		try {
// 			let order = [];
// 			const promises = data.map(async (order) => {
// 				const productData = await Product.findOneAndUpdate(
// 					{
// 						_id: order.product,
// 						selled: { $gte: order.amount },
// 					},
// 					{
// 						$inc: {
// 							countInStock: +order.amount,
// 							selled: -order.amount,
// 						},
// 					},
// 					{ new: true }
// 				);
// 				if (productData) {
// 					order = await Order.findByIdAndDelete(id);
// 					if (order === null) {
// 						resolve({
// 							status: "ERR",
// 							message: "The order is not defined",sendEmailOrderIsPaid
// 						});
// 					}
// 				} else {
// 					return {
// 						status: "OK",
// 						message: "ERR",
// 						id: order.product,
// 					};
// 				}
// 			});
// 			const results = await Promise.all(promises);
// 			const newData = results && results[0] && results[0].id;

// 			if (newData) {
// 				resolve({
// 					status: "ERR",
// 					message: `San pham voi id: ${newData} khong ton tai`,
// 				});
// 			}
// 			resolve({
// 				status: "OK",
// 				message: "success",
// 				data: order,
// 			});
// 		} catch (e) {
// 			reject(e);
// 		}
// 	});
// };
const cancelOrderDetails = (id,data) => {
	return new Promise(async (resolve,reject) => {
		try {
			const promises = data.map(async (order) => {
				const productData = await Product.findOneAndUpdate(
					{
						_id: order.product,
						selled: { $gte: order.amount },
					},
					{
						$inc: {
							countInStock: +order.amount,
							selled: -order.amount,
						},
					},
					{ new: true }
				);
				if (!productData) {
					return {
						status: "ERR",
						message: "The product is not available or the requested amount is not valid",
						id: order.product,
					};
				}
			});
			const results = await Promise.all(promises);

			// Check if any products are not available
			const unavailableProducts = results.filter((result) => result && result.status === "ERR");
			if (unavailableProducts.length > 0) {
				resolve({
					status: "ERR",
					message: "Some products are not available or the requested amounts are not valid",
					unavailableProducts,
				});
			} else {
				// Update order status in the database
				await Order.updateMany({ _id: id },{ $set: { orderStatus: false } });

				// Send cancellation email
				const updatedOrder = await Order.findById(id);
				if (updatedOrder) {
					await EmailServiceIsPaid.sendEmailOrderIsPaid(updatedOrder);
					resolve({
						status: "OK",
						message: "Order cancellation successful. Email sent.",
						data: data.map((order) => ({ ...order,orderStatus: false })),
					});
				} else {
					resolve({
						status: "ERR",
						message: "Failed to send cancellation email.",
						data: data.map((order) => ({ ...order,orderStatus: false })),
					});
				}
			}
		} catch (e) {
			reject(e);
		}
	});
};



// const getAllOrder = () => {
//   return new Promise(async (resolve, reject) => {
//     try {
//       const allOrder = await Order.find().sort({
//         createdAt: -1,
//         updatedAt: -1,
//       });
//       resolve({
//         status: "OK",
//         message: "Success",
//         data: allOrder,
//       });
//     } catch (e) {
//       reject(e);
//     }
//   });
// };
const getAllOrder = () => {
	return new Promise(async (resolve,reject) => {
		try {
			const allOrder = await Order.find().sort({
				createdAt: -1,
				updatedAt: -1,
			});
			resolve({
				status: "OK",
				message: "Success",
				data: allOrder,
			});
		} catch (e) {
			reject(e);
		}
	});
};
const updateOrder = (id,data) => {
	return new Promise(async (resolve,reject) => {
		try {
			const checkOrder = await Order.findOne({
				_id: id,
			});
			if (checkOrder === null) {
				resolve({
					status: "ERR",
					message: "The order is not defined",
				});
			}
			const isPaidSuccess = `https://www.hymnscenter.com/order-success/${id}`;
			const updatedOrder = await Order.findByIdAndUpdate(id,data,{
				new: true,
			});
			// console.log("updateOrder",updatedOrder)
			// resolve({
			// 	status: "OK",
			// 	message: "SUCCESS",
			// 	data: updatedOrder,
			// });
			if (updatedOrder) {
				await EmailServiceIsPaid.sendEmailOrderIsPaid(updatedOrder,isPaidSuccess);
				resolve({
					status: "OK",
					message: "success",
					data: updatedOrder,
				});
			}
		} catch (e) {
			reject(e);
		}
	});
};

const updateOrderItemsWithSlug = async () => {
	try {
			// Lấy tất cả các đơn hàng
			const orders = await Order.find({});

			for (let order of orders) {
					let isUpdated = false;

					for (let item of order.orderItems) {
							// Tìm sản phẩm tương ứng với product ID trong mỗi orderItem
							const product = await Product.findById(item.product);
							if (product && product.slug) {
									item.slug = product.slug; // Thêm slug vào orderItem
									isUpdated = true;
							}
					}

					// Lưu lại nếu đã có sự thay đổi
					if (isUpdated) {
							await order.save();
					}
			}

			console.log('Cập nhật slug cho các đơn hàng thành công.');
	} catch (error) {
			console.error('Có lỗi xảy ra:', error);
	}
};


module.exports = {
	createOrder,
	getAllOrderDetails,
	getAllOrderDetails,
	cancelOrderDetails,
	getAllOrder,
	getDetailsOrder,
	updateOrder,
	updateOrderItemsWithSlug
};
