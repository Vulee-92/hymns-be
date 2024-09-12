const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
const User = require('../models/UserModel');
const Role = require('../models/RoleModel');

dotenv.config();

const authMiddleWare = async (req, res, next) => {
  const accessToken = req.headers.authorization?.split(' ')[1];
  const refreshToken = req.headers['x-refresh-token'];

  console.log("accessToken", accessToken);
  console.log("refreshToken", refreshToken);

  if (!accessToken) {
    console.log("No access token provided");
    return res.status(401).json({
      message: 'Unauthorized',
      status: 'ERROR'
    });
  }

  try {
    const decoded = jwt.verify(accessToken, process.env.ACCESS_TOKEN_SECRET);
    console.log("decoded", decoded);
    const user = await User.findById(decoded.id).populate('roleId');
    if (!user) {
      console.log("User not found");
      return res.status(401).json({
        message: 'Unauthorized',
        status: 'ERROR'
      });
    }

    req.user = user;
    next();
  } catch (err) {
    console.log("Error verifying access token:", err);
    if (err.name === 'TokenExpiredError' && refreshToken) {
      try {
        const decodedRefresh = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET);
        console.log("decodedRefresh", decodedRefresh);
        const user = await User.findById(decodedRefresh.id).populate('roleId');
        if (!user) {
          console.log("User not found with refresh token");
          return res.status(401).json({
            message: 'Unauthorized',
            status: 'ERROR'
          });
        }

        // Generate new access token
        const newAccessToken = jwt.sign({ id: user._id }, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '15m' });
        res.setHeader('x-access-token', newAccessToken);

        req.user = user;
        next();
      } catch (refreshErr) {
        console.log("Error verifying refresh token:", refreshErr);
        return res.status(401).json({
          message: 'Unauthorized',
          status: 'ERROR'
        });
      }
    } else {
      return res.status(401).json({
        message: 'Unauthorized',
        status: 'ERROR'
      });
    }
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

    if (action === 'view' && !permissions.view) {
      return res.status(403).json({ status: 'ERR', message: 'Bạn không có quyền truy cập' });
    }
    if (action === 'create' && !permissions.create) {
      return res.status(403).json({ status: 'ERR', message: 'Bạn không có quyền tạo' });
    }
    if (action === 'edit' && !permissions.edit) {
      return res.status(403).json({ status: 'ERR', message: 'Bạn không có quyền chỉnh sửa' });
    }
    if (action === 'delete' && !permissions.delete) {
      return res.status(403).json({ status: 'ERR', message: 'Bạn không có quyền xoá' });
    }

    next();
  };
};

module.exports = {
  authMiddleWare,
  checkPermission
};