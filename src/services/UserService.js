const User = require("../models/UserModel");
const bcrypt = require("bcrypt");
const { genneralAccessToken,genneralRefreshToken } = require("./JwtService");
const dotenv = require("dotenv");
const EmailVerifyService = require("../services/EmailVerifyService");
const EmailResetPassword = require("../services/EmailResetPassword");
const JwtService = require("../services/JwtService");
dotenv.config();
const nodemailer = require("nodemailer");

const createUser = (newUser) => {
	return new Promise(async (resolve,reject) => {
		const { name,email,password,confirmPassword,phone } = newUser;
		const verificationCode = Math.floor(100000 + Math.random() * 900000);

		try {
			const checkUser = await User.findOne({
				email: email,
			});
			if (checkUser !== null) {
				resolve({
					status: "ERR",
					message: "The email is already",
				});
			}
			const hash = bcrypt.hashSync(password,10);
			const createdUser = await User.create({
				name,
				email,
				password: hash,
				phone,
				verificationCode,
			});

			const userId = createdUser._id.toString();
			const verificationLink = ` https://www.hymnscenter.com/verify/${userId}/${verificationCode}`;
			console.log("emailemailemailemail",email)

			if (createdUser) {
				await EmailVerifyService.sendEmailVerify(
					name,
					email,
					createdUser,
					verificationCode,
					verificationLink
					// verificationLink
				);
				resolve({
					status: "OK",
					message: "SUCCESS",
					data: createdUser,
				});
			}
		} catch (e) {
			reject(e);
		}
	});
};

const sendContactEmail = async (contactInfo,adminEmail) => {
	const { name,email,message } = contactInfo;

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

// const createUser = (newUser) => {
//   return new Promise(async (resolve, reject) => {
//     const { name, email, password, confirmPassword, phone } = newUser;
//     console.log("newUser", newUser);
//     try {
//       const checkUser = await User.findOne({
//         email: email,
//       });
//       console.log(email);
//       if (checkUser !== null) {
//         resolve({
//           status: "ERR",
//           message: "The email is already",
//         });
//       }
//       const hash = bcrypt.hashSync(password, 10);

//       // Tạo mã xác minh duy nhất
//       const verificationCode = Math.floor(100000 + Math.random() * 900000);
//       console.log("verificationCode", verificationCode);
//       const createdUser = await User.create({
//         name,
//         email,
//         password: hash,
//         phone,
//         verificationCode, // Thêm mã xác minh vào đối tượng newUser
//       });

//       // Gửi email xác minh đến địa chỉ email của người dùng
//       // const transporter = nodemailer.createTransport({
//       //   host: "smtp.gmail.com",
//       //   port: 465,
//       //   secure: true, // use TLS
//       //   auth: {
//       //     user: process.env.MAIL_ACCOUNT, // generated ethereal user
//       //     pass: process.env.MAIL_PASSWORD, // generated ethereal password
//       //   },
//       // });
//       // let info = {
//       //   from: process.env.MAIL_ACCOUNT, // sender address
//       //   to: "hymnscenter@gmail.com", // list of receivers
//       //   subject: `Đơn đặt hàng đã được xác nhận`, // Subject line
//       //   text: `Mã xác minh của bạn là ${verificationCode}`,
//       // };
//       // const mailOptions = await transporter({
//       //   from: process.env.MAIL_ACCOUNT, // sender address
//       //   to: "hymnscenter@gmail.com",
//       //   subject: "Xác minh địa chỉ email của bạn",
//       //   text: `Mã xác minh của bạn là ${verificationCode}`,
//       // });

//       // transporter.sendMail(info, (error, info) => {
//       //   console.log(info);
//       //   if (error) {
//       //     console.log(error);
//       //     resolve({
//       //       status: "ERR",
//       //       message: "Lỗi khi gửi email xác minh",
//       //     });
//       //   } else {
//       //     console.log("Email xác minh đã được gửi đến: " + info.response);
//       //     resolve({
//       //       status: "OK",
//       //       message: "SUCCESS",
//       //       data: createdUser,
//       //     });
//       //   }
//       // });
//     } catch (e) {
//       console.log("e", e);
//       reject(e);
//     }
//   });
// };
const verifyUser = async (id,data) => {
	return new Promise(async (resolve,reject) => {
		try {
			const checkUser = await User.findOne({
				_id: id,
			});
			// if (checkUser === null) {
			// 	resolve({
			// 		status: "ERR",
			// 		message: "The user is not defined",
			// 	});
			// }
			// if (!checkUser) {
			// 	resolve({
			// 		status: "ERR",
			// 		message: "Invalid user ID",
			// 	});
			// }

			// if (checkUser.isVerified) {
			// 	resolve({
			// 		status: "ERR",
			// 		message: "Email already verified",
			// 	});
			// }

			// Kiểm tra mã xác nhận
			if (checkUser.verificationCode !== parseInt(data)) {
				resolve({
					status: "ERR",
					message: "Invalid verification code",
				});
			}

			// Cập nhật trường isVerified của người dùng
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
// const updateUser = (id,data) => {
// 	return new Promise(async (resolve,reject) => {
// 		try {
// 			const checkUser = await User.findOne({
// 				_id: id,
// 			});
// 			if (checkUser === null) {
// 				resolve({
// 					status: "ERR",
// 					message: "The user is not defined",
// 				});
// 			}

// 			const updatedUser = await User.findByIdAndUpdate(id,data,{ new: true });
// 			resolve({
// 				status: "OK",
// 				message: "SUCCESS",
// 				data: updatedUser,
// 			});
// 		} catch (e) {
// 			reject(e);
// 		}
// 	});
// };


const loginUser = (userLogin) => {
	return new Promise(async (resolve,reject) => {
		const { email,password } = userLogin;
		try {
			const checkUser = await User.findOne({
				email: email,
			});
			console.log("checkUser",checkUser)
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
			const comparePassword = bcrypt.compareSync(password,checkUser.password);

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
	return new Promise(async (resolve,reject) => {
		try {
			const checkUser = await User.findOne({
				_id: id,
			});
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
	return new Promise(async (resolve,reject) => {
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
	return new Promise(async (resolve,reject) => {
		try {
			const allUser = await User.find().sort({ createdAt: -1,updatedAt: -1 });
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
	return new Promise(async (resolve,reject) => {
		try {
			const user = await User.findOne({
				_id: id,
			});
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
// Hàm generateResetToken với sử dụng TokenService
const generateResetToken = async (userId) => {
	try {
		// Sử dụng TokenService để tạo resetToken
		const resetToken = await JwtService.genneralResetToken({
			userId,
			// Thêm các thông tin khác vào payload nếu cần
		});

		return resetToken;
	} catch (error) {
		// Xử lý lỗi nếu có
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

		// Tạo mã token reset mật khẩu
		const resetToken = await generateResetToken(user._id);
		// Lưu mã token vào trường resetToken của user
		user.resetToken = resetToken;

		// Lưu thay đổi vào cơ sở dữ liệu
		await user.save();

		const resetLink = `https://www.hymnscenter.com/reset-password/${user._id}/${resetToken}`;
		// Sử dụng service để gửi email
		await EmailResetPassword(user,resetLink);

		return {
			status: "OK",
			message: "Reset email sent successfully",
		};
	} catch (error) {
		throw new Error(error);
	}
};
const updateUser = (id,data) => {
	return new Promise(async (resolve,reject) => {
		try {
			const checkUser = await User.findOne({ _id: id });

			if (!checkUser) {
				return resolve({
					status: "ERR",
					message: "The user is not defined",
				});
			}

			// Kiểm tra nếu có mật khẩu trong dữ liệu để mã hóa
			if (data.password) {
				// Mã hóa mật khẩu trước khi cập nhật
				const hash = bcrypt.hashSync(data.password,10);
				data.password = hash; // Gán mật khẩu đã được mã hóa vào dữ liệu
			}

			const updatedUser = await User.findByIdAndUpdate(id,data,{ new: true });

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
// Thêm phương thức reset mật khẩu
const resetPassword = async (id,token,data) => {
	return new Promise(async (resolve,reject) => {
		try {
			const user = await User.findOne({ _id: id });
			console.log("yusser",user)
			if (!user) {
				return {
					status: "ERR",
					message: "Invalid or expired reset token",
				};
			}

			if (data.password) {
				// Mã hóa mật khẩu trước khi cập nhật
				const hash = bcrypt.hashSync(data.password,10);
				data.password = hash; // Gán mật khẩu đã được mã hóa vào dữ liệu
			}

			const updatedUser = await User.findByIdAndUpdate(id,data,{ new: true });

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
