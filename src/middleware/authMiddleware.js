const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
const User = require('../models/UserModel'); // Import model User để lấy thông tin user
const Role = require('../models/RoleModel'); // Import model Role để lấy quyền

dotenv.config();

const authMiddleWare = async (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) {
    return res.status(401).json({
      message: 'Unauthorized',
      status: 'ERROR'
    });
  }

  try {
    const decoded = jwt.verify(token, process.env.ACCESS_TOKEN);
    const user = await User.findById(decoded.id).populate('roleId'); // Lấy user cùng với role
    if (!user) {
      return res.status(401).json({
        message: 'Unauthorized',
        status: 'ERROR'
      });
    }

    req.user = user; // Lưu thông tin người dùng vào request
    next();
  } catch (err) {
    return res.status(401).json({
      message: 'Unauthorized',
      status: 'ERROR'
    });
  }
};

const checkPermission = (action) => {
  return (req, res, next) => {
    const user = req.user;

    if (!user || !user.roleId) {
      return res.status(403).json({
        message: 'Forbidden',
        status: 'ERROR'
      });
    }

    const { permissions } = user.roleId;

    // Kiểm tra quyền dựa trên action
    if (action === 'view' && !permissions.view) {
      return res.status(403).json({ status: 'ERR', message: 'Permission denied' });
    }
    if (action === 'create' && !permissions.create) {
      return res.status(403).json({ status: 'ERR', message: 'Permission denied' });
    }
    if (action === 'edit' && !permissions.edit) {
      return res.status(403).json({ status: 'ERR', message: 'Permission denied' });
    }
    if (action === 'delete' && !permissions.delete) {
      return res.status(403).json({ status: 'ERR', message: 'Permission denied' });
    }

    next();
  };
};

const authUserMiddleWare = async (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];
  const userId = req.params.id;
  if (!token) {
    return res.status(401).json({
      message: 'Unauthorized',
      status: 'ERROR'
    });
  }

  try {
    const decoded = jwt.verify(token, process.env.ACCESS_TOKEN);
    const user = await User.findById(decoded.id).populate('roleId'); // Lấy user cùng với role

    if (!user) {
      return res.status(401).json({
        message: 'Unauthorized',
        status: 'ERROR'
      });
    }

    req.user = user; // Lưu thông tin người dùng vào request

    // Kiểm tra xem user có quyền truy cập vào tài nguyên không
    if (!user.isAdmin && user.id !== userId) {
      return res.status(403).json({
        message: 'Forbidden',
        status: 'ERROR'
      });
    }
    next();
  } catch (err) {
    return res.status(401).json({
      message: 'Unauthorized',
      status: 'ERROR'
    });
  }
};

module.exports = {
  authMiddleWare,
  authUserMiddleWare,
  checkPermission
};