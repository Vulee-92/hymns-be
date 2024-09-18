const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
const User = require('../models/UserModel');
const Role = require('../models/RoleModel');

dotenv.config();

const authMiddleWare = async (req, res, next) => {
  // Lấy access token và refresh token từ headers
  const accessToken = req.headers.authorization?.split(' ')[1];
  const refreshToken = req.headers['x-refresh-token'];

  if (!accessToken) {
    return res.status(401).json({
      message: 'Unauthorized - No access token',
      status: 'ERROR'
    });
  }
	const decodedWithoutVerify = jwt.decode(accessToken);
	console.log("Decoded without verify:", decodedWithoutVerify);
  try {
    // Xác thực access token
		const decoded = jwt.verify(accessToken, process.env.ACCESS_TOKEN_SECRET);
    const user = await User.findById(decoded.id).populate('role');

    if (!user || !user.role) {
      return res.status(401).json({
        message: 'Unauthorized - User or role not found',
        status: 'ERROR'
      });
    }

    req.user = user; // Gán đối tượng người dùng vào req

    // Kiểm tra xem token có hết hạn không và nếu có, kiểm tra refresh token
    if (decoded.exp * 1000 < Date.now()) {
      if (!refreshToken) {
        return res.status(401).json({
          message: 'Unauthorized - Access token expired and no refresh token provided',
          status: 'ERROR'
        });
      }

      // Xác thực refresh token
      try {
        const refreshDecoded = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET);
        const newAccessToken = jwt.sign({ id: refreshDecoded.id }, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '1h' });
        res.setHeader('Authorization', `Bearer ${newAccessToken}`);
        req.user = await User.findById(refreshDecoded.id).populate('role');
      } catch (refreshError) {
        return res.status(401).json({
          message: 'Unauthorized - Invalid refresh token',
          status: 'ERROR'
        });
      }
    }

    next();
  } catch (err) {
    return res.status(401).json({
      message: 'Unauthorized - Error verifying access token',
      status: 'ERROR'
    });
  }
};

const checkPermission = (action) => {
  return (req, res, next) => {
    const user = req.user;
		console.log("userrrrr",user);
    if (!user || !user.role) {
      return res.status(403).json({
        message: 'Forbidden - No role assigned',
        status: 'ERROR'
      });
    }

    const { role } = user;

    // Đối với admin, cho phép tất cả các quyền
    if (role.isAdmin) {
      return next();
    }

    // Kiểm tra quyền theo action
    if (role.permissions[action] === false) {
      return res.status(403).json({
        message: `Forbidden - You do not have permission to ${action}`,
        status: 'ERROR'
      });
    }

    return next();
  };
};
const adminMiddleware = (req, res, next) => {
  if (req.user && req.user.role && req.user.role.isAdmin && req.user.isAdmin) {
    next();
  } else {
    res.status(403).json({ status: 'ERR', message: 'Access denied. Only admin can perform this action.' });
  }
};

module.exports = {
  authMiddleWare,
  checkPermission,
  adminMiddleware
};
