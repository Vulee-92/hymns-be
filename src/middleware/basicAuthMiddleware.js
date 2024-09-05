const auth = require('basic-auth');
const User = require('../models/UserModel'); // Đảm bảo rằng bạn đã có mô hình User
const bcrypt = require('bcryptjs');

const basicAuthMiddleware = async (req, res, next) => {
  const user = auth(req);
  if (!user) {
    res.set('WWW-Authenticate', 'Basic realm="example"');
    return res.status(401).send('Authentication required.');
  }

  try {
    const foundUser = await User.findOne({ email: user.name });

    if ( foundUser.isAdmin === false) {
      return res.status(401).json({
        message: 'Unauthorized',
        status: 'ERROR'
      });
    }

    const isPasswordValid = bcrypt.compareSync(user.pass, foundUser.password);

    if (!isPasswordValid) {
      return res.status(401).json({
        message: 'Unauthorized',
        status: 'ERROR'
      });
    }

    req.user = foundUser; // Lưu thông tin người dùng vào request
    next();
  } catch (error) {
    return res.status(500).json({
      message: 'Internal Server Error',
      status: 'ERROR'
    });
  }
};

module.exports = basicAuthMiddleware;