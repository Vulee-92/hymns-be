const TelegramBot = require('node-telegram-bot-api');
const User = require("../models/UserModel");
const bcrypt = require("bcryptjs");
const { genneralAccessToken, genneralRefreshToken } = require("./JwtService");
const dotenv = require("dotenv");
const EmailVerifyService = require("../services/EmailVerifyService");
const EmailResetPassword = require("../services/EmailResetPassword");
const JwtService = require("../services/JwtService");
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
	  console.log("verificationLink",verificationLink);

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
	try {
	  const checkUser = await User.findOne({ email: email });
	  console.log("checkUser",checkUser);

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

	  if (!comparePassword) {
		resolve({
		  status: "ERR",
		  message: "The password or user is incorrect",
		});
	  }
	  const access_token = await genneralAccessToken({
		id: checkUser.id,
		isAdmin: checkUser.isAdmin,
	  });

	  const refresh_token = await genneralRefreshToken({
		id: checkUser.id,
		isAdmin: checkUser.isAdmin,
	  });

	  resolve({
		status: "OK",
		message: "SUCCESS",
		access_token,
		refresh_token,
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
	  const user = await User.findOne({ _id: id });
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

module.exports = {
  createUser,
  loginUser,
  updateUser,
  deleteUser,
  getAllUser,
  getDetailsUser,
  deleteManyUser,
  sendContactEmail,
  verifyUser,
  forgotPassword,
  resetPassword,
  generateResetToken
};