const TelegramBot = require('node-telegram-bot-api');
const User = require("../models/UserModel");
const bcrypt = require("bcryptjs");
const { genneralAccessToken, genneralRefreshToken } = require("./JwtService");
const dotenv = require("dotenv");
const EmailVerifyService = require("../services/EmailVerifyService");
const EmailResetPassword = require("../services/EmailResetPassword");
const JwtService = require("../services/JwtService");
const RoleService = require('../services/RoleService');
const Role = require('../models/RoleModel');

dotenv.config();
const nodemailer = require("nodemailer");

// Chọn token và URL dựa trên môi trường
const token = process.env.NODE_ENV === 'production'
	? process.env.TELEGRAM_TOKEN_PROD
	: process.env.TELEGRAM_TOKEN_DEV;

const baseUrl = process.env.NODE_ENV === 'production'
	? process.env.BASE_URL_PROD
	: process.env.BASE_URL_DEV;
const bot = new TelegramBot(token, { polling: false });

const createUser = (newUser) => {
	return new Promise(async (resolve, reject) => {
		const { name, email } = newUser;
		const verificationCode = Math.floor(100000 + Math.random() * 900000);
		const password = generateRandomPassword(); // Tạo mật khẩu ngẫu nhiên

		try {
			const checkUser = await User.findOne({ email: email });

			if (checkUser !== null) {
				resolve({
					status: "ERR",
					message: "The email is already in use",
				});
			}

			const hash = bcrypt.hashSync(password, 10); // Hash mật khẩu
			const createdUser = await User.create({
				name,
				email,
				password: hash, // Lưu mật khẩu đã hash
				verificationCode,
			});

			const userId = createdUser._id.toString();
			const verificationLink = `${baseUrl}/verify/${userId}/${verificationCode}`;
			console.log("verificationLink", verificationLink);

			if (createdUser) {
				// const chatId = '6749566951';
				// bot.on('callback_query', (callbackQuery) => {
				//   const data = callbackQuery.data;
				//   Xử lý lựa chọn từ người dùng
				//   if (data === 'option1') {
				// bot.sendMessage(chatId, 'Xác nhận đã chuyển khoản.');
				// bot.sendMessage(chatId, 'Cảm ơn quý khách!');
				//   } else if (data === 'option2') {
				EmailVerifyService.sendEmailVerify(
					name,
					email,
					hash,
					verificationCode,
					verificationLink
				);
				// bot.sendMessage(chatId, 'Đã gửi email.');
				//   } else if (data === 'option3') {
				// bot.sendMessage(chatId, 'Đơn hàng của bạn đã bị huỷ.');
				// userOrders[chatId].status = 'cancelled';
				//   }
				// });

				resolve({
					status: "OK",
					message: "SUCCESS",
					data: createdUser,
					password: password, // Trả về mật khẩu cho người dùng
				});
			}
		} catch (e) {
			reject(e);
		}
	});
};

// Hàm tạo mật khẩu ngẫu nhiên
function generateRandomPassword() {
	const length = 10;
	const charset = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
	let password = "";
	for (let i = 0; i < length; i++) {
		password += charset.charAt(Math.floor(Math.random() * charset.length));
	}
	return password;
}

const sendContactEmail = async (contactInfo, adminEmail) => {
	const { name, email, message } = contactInfo;

	try {
		const transporter = nodemailer.createTransport({
			service: "gmail",
			auth: {
				user: "your-email@gmail.com",
				pass: "your-password",
			},
		});

		const mailOptions = {
			from: adminEmail,
			to: email,
			subject: "New contact message from your website",
			text: `Name: ${name}\nEmail: ${email}\nMessage: ${message}`,
		};

		const info = await transporter.sendMail(mailOptions);
		console.log("Email sent: " + info.response);
		return {
			status: "OK",
			message: "Your message has been sent successfully",
		};
	} catch (e) {
		console.log(e);
		throw new Error("An error occurred while sending the message");
	}
};

const verifyUser = async (id, data) => {
	return new Promise(async (resolve, reject) => {
		try {
			const checkUser = await User.findOne({ _id: id });

			if (checkUser.verificationCode !== parseInt(data)) {
				resolve({
					status: "ERR",
					message: "Invalid verification code",
				});
			}

			checkUser.isVerified = true;
			await checkUser.save();

			resolve({
				status: "OK",
				message: "Email verified successfully",
			});
		} catch (e) {
			reject(e);
		}
	});
};

const loginUser = (userLogin) => {
	return new Promise(async (resolve, reject) => {
		const { email, password } = userLogin;
		console.log("email", email);
		console.log("password", password);
		try {
			const checkUser = await User.findOne({ email: email }).populate('featurePackage').populate('role');
			console.log("checkUser", checkUser);
			if (checkUser === null) {
				resolve({
					status: "ERR",
					message: "The user is not defined",
				});
			}
			if (checkUser.isVerified === false) {
				resolve({
					status: "ERR_EMAIL",
					message: "Please verify your email first",
				});
			}
			const comparePassword = bcrypt.compareSync(password, checkUser.password);
			console.log("comparePassword", comparePassword);
			if (!comparePassword) {
				resolve({
					status: "ERR",
					message: "The password or user is incorrect",
				});
			}
			  const access_token = await genneralAccessToken({
			id: checkUser.id,
			role: checkUser.role,
			  });
			  const refresh_token = await genneralRefreshToken({
			id: checkUser.id,
			role: checkUser.role,
			  });
			resolve({
				status: "OK",
				message: "SUCCESS",
				access_token,
				refresh_token,
				data: {
					user: checkUser,
				}
			});
		} catch (e) {
			reject(e);
		}
	});
};


const deleteUser = (id) => {
	return new Promise(async (resolve, reject) => {
		try {
			const checkUser = await User.findOne({ _id: id });
			if (checkUser === null) {
				resolve({
					status: "ERR",
					message: "The user is not defined",
				});
			}

			await User.findByIdAndDelete(id);
			resolve({
				status: "OK",
				message: "Delete user success",
			});
		} catch (e) {
			reject(e);
		}
	});
};

const deleteManyUser = (ids) => {
	return new Promise(async (resolve, reject) => {
		try {
			await User.deleteMany({ _id: ids });
			resolve({
				status: "OK",
				message: "Delete user success",
			});
		} catch (e) {
			reject(e);
		}
	});
};

const getAllUser = () => {
	return new Promise(async (resolve, reject) => {
		try {
			const allUser = await User.find().sort({ createdAt: -1, updatedAt: -1 });
			resolve({
				status: "OK",
				message: "Success",
				data: allUser,
			});
		} catch (e) {
			reject(e);
		}
	});
};

const getDetailsUser = (id) => {
	return new Promise(async (resolve, reject) => {
		try {
			const user = await User.findOne({ _id: id }).populate('role');
			if (user === null) {
				resolve({
					status: "ERR",
					message: "The user is not defined",
				});
			}
			resolve({
				status: "OK",
				message: "SUCESS",
				data: user,
			});
		} catch (e) {
			reject(e);
		}
	});
};

const generateResetToken = async (userId) => {
	try {
		const resetToken = await JwtService.genneralResetToken({ userId });
		return resetToken;
	} catch (error) {
		throw new Error(error);
	}
};

const forgotPassword = async (email) => {
	try {
		const user = await User.findOne({ email });

		if (!user) {
			return {
				status: "ERR",
				message: "User not found",
			};
		}

		const resetToken = await generateResetToken(user._id);
		user.resetToken = resetToken;
		await user.save();

		const resetLink = `${baseUrl}/reset-password/${user._id}/${resetToken}`;
		await EmailResetPassword(user, resetLink);

		return {
			status: "OK",
			message: "Reset email sent successfully",
		};
	} catch (error) {
		throw new Error(error);
	}
};
const updateUser = (id, data) => {
  return new Promise(async (resolve, reject) => {
    try {
      const checkUser = await User.findOne({ _id: id });

      if (!checkUser) {
        return resolve({
          status: "ERR",
          message: "The user is not defined",
        });
      }

      if (data.password) {
        const hash = bcrypt.hashSync(data.password, 10);
        data.password = hash;
      }

      const updatedUser = await User.findByIdAndUpdate(id, data, { new: true });

      if (!updatedUser) {
        return resolve({
          status: "ERR",
          message: "Failed to update user",
        });
      }

      resolve({
        status: "OK",
        message: "SUCCESS",
        data: updatedUser,
      });
    } catch (e) {
      reject(e);
    }
  });
};

const resetPassword = async (id, token, data) => {
	return new Promise(async (resolve, reject) => {
		try {
			const user = await User.findOne({ _id: id });
			if (!user) {
				return {
					status: "ERR",
					message: "Invalid or expired reset token",
				};
			}

			if (data.password) {
				const hash = bcrypt.hashSync(data.password, 10);
				data.password = hash;
			}

			const updatedUser = await User.findByIdAndUpdate(id, data, { new: true });

			if (!updatedUser) {
				return resolve({
					status: "ERR",
					message: "Failed to update user",
				});
			}

			resolve({
				status: "OK",
				message: "SUCCESS",
				data: updatedUser,
			});
		} catch (error) {
			throw new Error(error);
		}
	});
};
const addShippingAddress = async (userId, newAddress) => {
	try {
		const user = await User.findById(userId);
		if (!user) {
			return {
				status: "ERR",
				message: "User not found",
			};
		}

		// Thêm địa chỉ mới
		user.shippingAddresses.push(newAddress);
		await user.save();

		// Lấy địa chỉ vừa thêm (phần tử cuối cùng trong mảng)
		const addedAddress = user.shippingAddresses[user.shippingAddresses.length - 1];

		return {
			status: "OK",
			message: "SUCCESS",
			data: {
				...user.toObject(),
				shippingAddresses: user.shippingAddresses.map(address => ({
					...address.toObject(),
					_id: address._id
				}))
			}
		};
	} catch (error) {
		throw new Error(error);
	}
};

const updateShippingAddress = async (userId, addressId, address) => {
	try {
		const user = await User.findById(userId);
		if (!user) {
			return {
				status: "ERR",
				message: "User not found",
			};
		}

		const addressIndex = user.shippingAddresses.findIndex(
			(addr) => addr._id.toString() === addressId
		);

		if (addressIndex === -1) {
			return {
				status: "ERR",
				message: "Address not found",
			};
		}

		user.shippingAddresses[addressIndex] = address;
		await user.save();

		return {
			status: "OK",
			message: "Shipping address updated successfully",
			data: user.shippingAddresses,
		};
	} catch (error) {
		throw new Error(error);
	}
};

const deleteShippingAddress = async (userId, addressId) => {
	try {
		const user = await User.findById(userId);
		if (!user) {
			return {
				status: "ERR",
				message: "User not found",
			};
		}

		user.shippingAddresses = user.shippingAddresses.filter(
			(addr) => addr._id.toString() !== addressId
		);
		await user.save();

		return {
			status: "OK",
			message: "Shipping address deleted successfully",
			data: user.shippingAddresses,
		};
	} catch (error) {
		throw new Error(error);
	}
};

const setDefaultShippingAddress = async (userId, addressId) => {
	try {
		// Tìm người dùng
		const user = await User.findById(userId);
		if (!user) {
			return {
				status: "ERR",
				message: "User not found",
			};
		}

		// Tìm địa chỉ cần cập nhật
		const addressIndex = user.shippingAddresses.findIndex(
			(addr) => addr._id.toString() === addressId
		);

		if (addressIndex === -1) {
			return {
				status: "ERR",
				message: "Address not found",
			};
		}

		// Đặt tất cả địa chỉ khác thành không mặc định (isDefault: false)
		user.shippingAddresses.forEach((addr) => {
			addr.isDefault = false;
		});

		// Đặt địa chỉ mới thành mặc định (isDefault: true)
		user.shippingAddresses[addressIndex].isDefault = true;

		// Cập nhật defaultShippingAddress với ID của địa chỉ mới
		user.defaultShippingAddress = user.shippingAddresses[addressIndex]._id;

		// Lưu người dùng sau khi cập nhật
		await user.save();

		return {
			status: "OK",
			message: "Shipping address default status updated successfully",
			data: user.shippingAddresses.map(addr => ({
				...addr.toObject(),
				_id: addr._id.toString() // Trả về ID dưới dạng string
			})),
			defaultAddress: user.defaultShippingAddress.toString() // Trả về ID của địa chỉ mặc định
		};
	} catch (error) {
		// Bắt lỗi và trả về
		return {
			status: "ERR",
			message: error.message
		};
	}
};

const assignDefaultRoleToAllUsers = async () => {
	const defaultRole = await RoleService.createDefaultRole(); // Tạo hoặc lấy role mặc định
	await User.updateMany({}, { role: defaultRole._id }); // Gán role cho tất cả người dùng
};

// Lấy thông tin profile của người dùng bằng email
const getUserProfileByEmail = async (emails) => {
	const email = `${emails}@gmail.com`;
	console.log("emails", email);
    return await User.findOne({ email }).select('name avatar following'); // Chỉ trả về tên, avatar và danh sách người theo dõi
};

// Tương tác giữa người dùng (theo dõi)
const followUser = async (followerId, followingId) => {
    const follower = await User.findById(followerId);
    const following = await User.findById(followingId);

    if (!follower || !following) {
        throw new Error('User not found');
    }

    if (!follower.following) {
        follower.following = [];
    }

    if (!follower.following.includes(followingId)) {
        follower.following.push(followingId);
        await follower.save();
    }

    return follower;
};

// Lấy thông tin người dùng theo ID
const getUserById = async (userId) => {
    return await User.findById(userId).select('name avatar following'); // Chỉ trả về tên, avatar và danh sách người theo dõi
};
module.exports = {
	createUser,
	loginUser, assignDefaultRoleToAllUsers,
	updateUser,
	deleteUser,
	getAllUser,
	getDetailsUser,
	deleteManyUser,
	sendContactEmail,
	verifyUser,
	forgotPassword,
	resetPassword,
	generateResetToken,
	addShippingAddress,
	updateShippingAddress,
	deleteShippingAddress,
	setDefaultShippingAddress,
	getUserProfileByEmail,
    followUser,
    getUserById,
};