const UserService = require("../services/UserService");
const JwtService = require("../services/JwtService");
const User = require("../models/UserModel");
const errorHandler = require('../utils/errorHandler');
const logger = require('../utils/logger');
const Joi = require('joi');

const addressSchema = Joi.object({
    fullName: Joi.string().required(),
    phone: Joi.string().required(),
    email: Joi.string().email().required(),
    address: Joi.string().required(),
    city: Joi.string().required(),
    province: Joi.string().required(),
    ward: Joi.string().required(),
    isDefault: Joi.boolean().default(false)
});

const createUser = async (req,res) => {
	try {
		const { name,email } =
			req.body;
		const reg = /^\w+([-+.']\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/;
		const isCheckEmail = reg.test(email);
		if (!name || !email) {
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
		const adminEmail = "hymnscenter@gmail.com"; // Lấy địa chỉ email của quản trị viên từ cơ sở dữ liệu hoặc một file cấu hình nào đó
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
const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validate input
    if (!email || !password) {
      return res.status(400).json({
        status: "ERR",
        message: "Email and password are required",
      });
    }

    // Validate email format (except for 'admin')
    const emailRegex = /^\w+([-+.']\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/;
    if (email !== 'admin' && !emailRegex.test(email)) {
      return res.status(400).json({
        status: "ERR",
        message: "Invalid email format",
      });
    }

    // Call login service
    const response = await UserService.loginUser({ email, password });

    // Handle different response statuses
    if (response.status === "ERR") {
      return res.status(401).json(response);
    }

    if (response.status === "ERR_EMAIL") {
      return res.status(403).json(response);
    }

    // Successful login
    const { refresh_token, access_token, ...responseWithoutTokens } = response;

    // Set refresh token as HTTP-only cookie
    const expires = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000); // 7 days
    res.cookie("refresh_token", refresh_token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: "Lax",
      path: "/",
      expires,
      // domain: ".yourdomain.com", // Uncomment and set your domain in production
    });

    // Send response with access token
    return res.status(200).json({
      ...response,
  
    });
  } catch (error) {
    console.error('Login error:', error);
    return res.status(500).json({
      status: "ERR",
      message: "An error occurred during login",
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
		// let token = req.headers.token.split(" ")[1];
		const refreshToken = req.cookies.refresh_token;
		if (!refreshToken) {
			return res.status(200).json({
				status: "ERR",
				message: "The refreshToken is required",
			});
		}
		const response = await JwtService.refreshTokenJwtService(refreshToken);
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
			domain: "http://localhost:3003", // Đảm bảo domain và path chính xác
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


// Thêm phương thức quên mật khẩu
const forgotPassword = async (req,res) => {
	try {
		const { email } = req.body;
		// Kiểm tra email và gửi email reset mật khẩu
		const response = await UserService.forgotPassword(email);
		return res.status(200).json(response);
	} catch (e) {
		return res.status(500).json({
			message: e.message || e,
		});
	}
};
const updateUser = async (req, res) => {
  try {
    const userId = req.params.id;
    const data = req.body;
    if (!userId) {
      return res.status(400).json({
        status: "ERR",
        message: "The userId is required",
      });
    }

    const response = await UserService.updateUser(userId, data);
    return res.status(200).json(response);
  } catch (e) {
    return res.status(404).json({
      message: e.message,
    });
  }
};

// Thêm phương thức reset mật khẩu
const resetPassword = async (req,res) => {
	try {
		const userId = req.params.id;
		const token = req.params.tokenReset;
		const data = req.body;
		console.log("data",data)

		if (!userId && !token && !data.password || !data.confirmPassword) {
			return res.status(200).json({
				status: "ERR",
				message: "The userId & data is required",
			});
		} else if (!data.password !== !data.confirmPassword) {
			return res.status(200).json({
				status: "ERR",
				message: "The password is equal confirmPassword",
			});
		}
		console.log("req.body",req.body)
		// Kiểm tra token và cập nhật mật khẩu mới
		const response = await UserService.resetPassword(userId,token,data);

		return res.status(200).json(response);
	} catch (e) {
		return res.status(500).json({
			message: e.message || e,
		});
	}
};


const verifyUser = async (req,res) => {
	try {
		const userId = req.params.id;
		const data = req.params.verificationCode;
		if (!userId && !data) {
			return res.status(200).json({
				status: "ERR",
				message: "The userId & data is required",
			});
		}
		const response = await UserService.verifyUser(userId,data);
		return res.status(200).json(response);
	} catch (e) {
		return res.status(404).json({
			message: e,
		});
	}
};
const addShippingAddress = async (req, res) => {
  try {
    const { 
      userId, 
      fullName, 
      phone, 
      email, 
      address, 
      city, 
      province, 
      ward 
    } = req.body;

    const newAddress = {
      fullName,
      phone,
      email,
      address,
      city,
      province,
      ward
    };

    const response = await UserService.addShippingAddress(userId, newAddress);
    return res.status(200).json(response);
  } catch (e) {
    return res.status(500).json({
      message: e.message || e,
    });
  }
};
  
const updateShippingAddress = async (req, res) => {
	try {
			const { error } = addressSchema.validate(req.body.address);
			if (error) {
					return res.status(400).json({
							status: "ERR",
							message: error.details[0].message
					});
			}

			const { userId, addressId, address } = req.body;
			const response = await UserService.updateShippingAddress(userId, addressId, address);
			logger.info(`Shipping address updated for user: ${userId}`);
			return res.status(200).json(response);
	} catch (error) {
			logger.error(`Error updating shipping address: ${error.message}`);
			return errorHandler(res, error);
	}
};
  
 
const deleteShippingAddress = async (req, res) => {
	try {
			const { userId, addressId } = req.body;
			const response = await UserService.deleteShippingAddress(userId, addressId);
			logger.info(`Shipping address deleted for user: ${userId}`);
			return res.status(200).json(response);
	} catch (error) {
			logger.error(`Error deleting shipping address: ${error.message}`);
			return errorHandler(res, error);
	}
};
  
const setDefaultShippingAddress = async (req, res) => {
	try {
			const { userId, addressId, isDefault } = req.body;
			const response = await UserService.setDefaultShippingAddress(userId, addressId, isDefault);
			logger.info(`Default shipping address set for user: ${userId}`);
			return res.status(200).json(response);
	} catch (error) {
			logger.error(`Error setting default shipping address: ${error.message}`);
			return errorHandler(res, error);
	}
};

const getUserProfileByEmailController = async (req, res) => {
	try {
			const { email } = req.params;
			const user = await UserService.getUserProfileByEmail(email);
			if (!user) {
					return res.status(404).json({ status: 'ERR', message: 'User not found' });
			}
			return res.status(200).json({ status: 'OK', data: user });
	} catch (error) {
			logger.error(`Error getting user profile: ${error.message}`);
			return errorHandler(res, error);
	}
};

const followUserController = async (req, res) => {
	try {
			const { followerId, followingId } = req.body;
			const updatedUser = await UserService.followUser(followerId, followingId);
			logger.info(`User ${followerId} followed user ${followingId}`);
			return res.status(200).json({ status: 'OK', data: updatedUser });
	} catch (error) {
			logger.error(`Error following user: ${error.message}`);
			return errorHandler(res, error);
	}
};

// Lấy thông tin người dùng theo ID
const getUserByIdController = async (req, res) => {
    try {
        const userId = req.params.id;
        const user = await UserService.getUserById(userId);
        if (!user) {
            return res.status(404).json({ status: 'ERR', message: 'User not found' });
        }
        res.status(200).json({ status: 'OK', data: user });
    } catch (error) {
        res.status(500).json({ status: 'ERR', message: error.message });
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
	verifyUser,
	forgotPassword,
	resetPassword,
	addShippingAddress,
  updateShippingAddress,
  deleteShippingAddress,
  setDefaultShippingAddress,
  getUserProfileByEmailController,
  followUserController,
  getUserByIdController,
};
