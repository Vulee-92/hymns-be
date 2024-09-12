const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
dotenv.config();

const genneralAccessToken = async (payload) => {
  const access_token = jwt.sign({
    ...payload
  }, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '30s' });

  return access_token;
};

const genneralRefreshToken = async (payload) => {
  const refresh_token = jwt.sign({
    ...payload
  }, process.env.REFRESH_TOKEN_SECRET, { expiresIn: '365d' });

  return refresh_token;
};

const genneralResetToken = async (payload) => {
  try {
    const currentTime = Math.floor(Date.now() / 1000);
    const expirationTime = currentTime + 3600; // 1 giờ

    const reset_token = jwt.sign(
      {
        ...payload,
        exp: expirationTime,
      },
      process.env.RESET_TOKEN
    );

    return reset_token;
  } catch (error) {
    throw new Error(error);
  }
};

const refreshTokenJwtService = (token) => {
  return new Promise((resolve, reject) => {
    try {
      jwt.verify(token, process.env.REFRESH_TOKEN_SECRET, async (err, user) => {
        if (err) {
          resolve({
            status: 'ERR',
            message: 'The authentication'
          });
        }
        const access_token = await genneralAccessToken({
          id: user?.id,
          isAdmin: user?.isAdmin
        });
        resolve({
          status: 'OK',
          message: 'SUCCESS',
          access_token
        });
      });
    } catch (e) {
      reject(e);
    }
  });
};

module.exports = {
  genneralAccessToken,
  genneralRefreshToken,
  genneralResetToken,
  refreshTokenJwtService
};