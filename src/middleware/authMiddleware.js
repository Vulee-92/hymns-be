const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
const User = require('../models/UserModel');
const Role = require('../models/RoleModel');

dotenv.config();

const verifyToken = async (token, secret) => {
  try {
    const decoded = jwt.verify(token, secret);
    const user = await User.findById(decoded.id).populate('role');
    if (!user) throw new Error('User not found');
    return user;
  } catch (error) {
    throw error;
  }
};

const authMiddleware = async (req, res, next) => {
  const accessToken = req.headers.authorization?.split(' ')[1];
  const refreshToken = req.headers['x-refresh-token'];

  if (!accessToken) {
    return res.status(401).json({
      message: 'Unauthorized - No access token',
      status: 'ERROR'
    });
  }

  try {
    req.user = await verifyToken(accessToken, process.env.ACCESS_TOKEN_SECRET);
    next();
  } catch (error) {
    if (error.name === 'TokenExpiredError' && refreshToken) {
      try {
        const user = await verifyToken(refreshToken, process.env.REFRESH_TOKEN_SECRET);
        const newAccessToken = jwt.sign({ id: user._id }, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '1h' });
        res.setHeader('Authorization', `Bearer ${newAccessToken}`);
        req.user = user;
        next();
      } catch (refreshError) {
        return res.status(401).json({
          message: 'Unauthorized - Invalid refresh token',
          status: 'ERROR'
        });
      }
    } else {
      return res.status(401).json({
        message: 'Unauthorized - Invalid access token',
        status: 'ERROR'
      });
    }
  }
};

const checkPermission = (resource, action) => {
  return (req, res, next) => {
    const user = req.user;
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

    // Kiểm tra quyền theo resource và action
    const hasPermission = role.hasPermission(resource, action);
    if (!hasPermission) {
      return res.status(403).json({
        message: `Forbidden - You do not have permission to ${action} ${resource}`,
        status: 'ERROR'
      });
    }

    return next();
  };
};

const adminMiddleware = (req, res, next) => {
  if (req.user && req.user.role && req.user.role.isAdmin) {
    next();
  } else {
    res.status(403).json({ status: 'ERR', message: 'Access denied. Only admin can perform this action.' });
  }
};

module.exports = {
  authMiddleware,
  checkPermission,
  adminMiddleware
};