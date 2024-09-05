const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
dotenv.config();

const authMiddleWare = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) {
    return res.status(401).json({
      message: 'Unauthorized',
      status: 'ERROR'
    });
  }

  jwt.verify(token, process.env.ACCESS_TOKEN, function (err, user) {
    if (err || !user.isAdmin) {
      return res.status(401).json({
        message: 'Unauthorized',
        status: 'ERROR'
      });
    }
    req.user = user; // Lưu thông tin người dùng vào request
    next();
  });
};

const authUserMiddleWare = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];
  const userId = req.params.id;
  if (!token) {
    return res.status(401).json({
      message: 'Unauthorized',
      status: 'ERROR'
    });
  }

  jwt.verify(token, process.env.ACCESS_TOKEN, function (err, user) {
    if (err || (!user.isAdmin && user.id !== userId)) {
      return res.status(401).json({
        message: 'Unauthorized',
        status: 'ERROR'
      });
    }
    req.user = user; // Lưu thông tin người dùng vào request
    next();
  });
};

module.exports = {
  authMiddleWare,
  authUserMiddleWare
};