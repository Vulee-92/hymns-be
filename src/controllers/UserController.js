const UserService = require("../services/UserService");
const JwtService = require("../services/JwtService");

const createUser = async (req,res) => {
	try {
		const { name,email,password,confirmPassword,phone,verificationCode } =
			req.body;
		const reg = /^\w+([-+.']\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/;
		const isCheckEmail = reg.test(email);
		if (!email || !password || !confirmPassword) {
			return res.status(200).json({
				status: "ERR",
				message: "The input is required",
			});
		} else if (!isCheckEmail) {
			return res.status(200).json({
				status: "ERR",
				message: "The input is email",
			});
		} else if (password !== confirmPassword) {
			return res.status(200).json({
				status: "ERR",
				message: "The password is equal confirmPassword",
			});
		}
		const response = await UserService.createUser(req.body);
		return res.status(200).json(response);
	} catch (e) {
		return res.status(404).json({
			message: e,
		});
	}
};

const createContact = async (req,res) => {
	try {
		const { name,email,message } = req.body;
		const reg = /^\w+([-+.']\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/;
		const isCheckEmail = reg.test(email);
		if (!name || !email || !message) {
			return res.status(400).json({
				status: "ERR",
				message: "All fields are required",
			});
		} else if (!isCheckEmail) {
			return res.status(400).json({
				status: "ERR",
				message: "Please enter a valid email address",
			});
		}
		const adminEmail = "hymnsguitarclass@gmail.com"; // Lấy địa chỉ email của quản trị viên từ cơ sở dữ liệu hoặc một file cấu hình nào đó
		const result = await UserService.sendContactEmail(
			{ name,email,message },
			adminEmail
		);
		return res.status(200).json(result);
	} catch (e) {
		console.log(e);
		return res.status(500).json({
			status: "ERR",
			message: "An error occurred while sending the message",
		});
	}
};

const loginUser = async (req,res) => {
	try {
		const { email,password } = req.body;
		const reg = /^\w+([-+.']\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/;
		const isCheckEmail = reg.test(email);
		if (!email || !password) {
			return res.status(200).json({
				status: "ERR",
				message: "The input is required",
			});
		} else if (!isCheckEmail) {
			return res.status(200).json({
				status: "ERR",
				message: "The input is email",
			});
		}
		const response = await UserService.loginUser(req.body);
		const { refresh_token,...newReponse } = response;
		const expires = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000); // Thiết lập thời gian hết hạn là 7 ngày sau khi đăng nhập
		res.cookie("refresh_token",refresh_token,{
			httpOnly: false,
			secure: false,
			sameSite: "Lax",
			path: "/",
			// domain: ".example.com", // Thay thế bằng miền của trang web của bạn
			// expires,
		});
		return res.status(200).json({ ...newReponse,refresh_token });
	} catch (e) {
		return res.status(404).json({
			message: e,
		});
	}
};


const updateUser = async (req,res) => {
	try {
		const userId = req.params.id;
		const data = req.body;
		if (!userId) {
			return res.status(200).json({
				status: "ERR",
				message: "The userId is required",
			});
		}
		const response = await UserService.updateUser(userId,data);
		return res.status(200).json(response);
	} catch (e) {
		return res.status(404).json({
			message: e,
		});
	}
};

const deleteUser = async (req,res) => {
	try {
		const userId = req.params.id;
		if (!userId) {
			return res.status(200).json({
				status: "ERR",
				message: "The userId is required",
			});
		}
		const response = await UserService.deleteUser(userId);
		return res.status(200).json(response);
	} catch (e) {
		return res.status(404).json({
			message: e,
		});
	}
};

const deleteMany = async (req,res) => {
	try {
		const ids = req.body.ids;
		if (!ids) {
			return res.status(200).json({
				status: "ERR",
				message: "The ids is required",
			});
		}
		const response = await UserService.deleteManyUser(ids);
		return res.status(200).json(response);
	} catch (e) {
		return res.status(404).json({
			message: e,
		});
	}
};

const getAllUser = async (req,res) => {
	try {
		const response = await UserService.getAllUser();
		return res.status(200).json(response);
	} catch (e) {
		return res.status(404).json({
			message: e,
		});
	}
};

const getDetailsUser = async (req,res) => {
	try {
		const userId = req.params.id;
		if (!userId) {
			return res.status(200).json({
				status: "ERR",
				message: "The userId is required",
			});
		}
		const response = await UserService.getDetailsUser(userId);
		return res.status(200).json(response);
	} catch (e) {
		return res.status(404).json({
			message: e,
		});
	}
};

const refreshToken = async (req,res) => {
	try {
		let token = req.headers.token.split(" ")[1];
		if (!token) {
			return res.status(200).json({
				status: "ERR",
				message: "The token is required",
			});
		}
		const response = await JwtService.refreshTokenJwtService(token);
		return res.status(200).json(response);
	} catch (e) {
		return res.status(404).json({
			message: e,
		});
	}
};

// const logoutUser = async (req, res) => {
//   try {
//     res.clearCookie("refresh_token");
//     return res.status(200).json({
//       status: "OK",
//       message: "Logout successfully",
//     });
//   } catch (e) {
//     return res.status(404).json({
//       message: e,
//     });
//   }
// };
// const logoutUser = async (req, res) => {
//   try {
//     res.clearCookie("refresh_token", {
//       secure: false,
//       httpOnly: true,
//       expires: new Date(0),
//     });

//     return res.status(200).json({
//       status: "OK",
//       message: "Logout successfully",
//     });
//   } catch (e) {
//     return res.status(404).json({
//       message: e,
//     });
//   }
// };
const logoutUser = async (req,res) => {
	try {
		res.clearCookie("refresh_token",{
			secure: false,
			httpOnly: false,
			domain: "http://localhost:3000", // Đảm bảo domain và path chính xác
			expires: new Date(0),
			path: '/' // Đảm bảo path chính xác
		});

		return res.status(200).json({
			status: "OK",
			message: "Logout successfully",
		});
	} catch (e) {
		return res.status(404).json({
			message: e,
		});
	}
};









module.exports = {
	createUser,
	loginUser,
	updateUser,
	deleteUser,
	getAllUser,
	getDetailsUser,
	refreshToken,
	logoutUser,
	deleteMany,
	createContact,
};
