const User = require("../models/UserModel");
const bcrypt = require("bcrypt");
const { genneralAccessToken, genneralRefreshToken } = require("./JwtService");
const dotenv = require("dotenv");
const EmailVerifyService = require("../services/EmailVerifyService");
dotenv.config();
const nodemailer = require("nodemailer");
console.log(process.env.MAIL_PASSWORD);
const createUser = (newUser) => {
  return new Promise(async (resolve, reject) => {
    const { name, email, password, confirmPassword, phone } = newUser;
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
      const hash = bcrypt.hashSync(password, 10);
      const createdUser = await User.create({
        name,
        email,
        password: hash,
        phone,
        verificationCode,
      });
      if (createdUser) {
        await EmailVerifyService.sendEmailVerify(
          email,
          createdUser,
          verificationCode
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
//       //   to: "hymnsguitarclass@gmail.com", // list of receivers
//       //   subject: `Đơn đặt hàng đã được xác nhận`, // Subject line
//       //   text: `Mã xác minh của bạn là ${verificationCode}`,
//       // };
//       // const mailOptions = await transporter({
//       //   from: process.env.MAIL_ACCOUNT, // sender address
//       //   to: "hymnsguitarclass@gmail.com",
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
const loginUser = (userLogin) => {
  return new Promise(async (resolve, reject) => {
    const { email, password } = userLogin;
    try {
      const checkUser = await User.findOne({
        email: email,
      });
      if (checkUser === null) {
        resolve({
          status: "ERR",
          message: "The user is not defined",
        });
      }
      const comparePassword = bcrypt.compareSync(password, checkUser.password);

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

const updateUser = (id, data) => {
  return new Promise(async (resolve, reject) => {
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

      const updatedUser = await User.findByIdAndUpdate(id, data, { new: true });
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

const deleteUser = (id) => {
  return new Promise(async (resolve, reject) => {
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
  return new Promise(async (resolve, reject) => {
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
  return new Promise(async (resolve, reject) => {
    try {
      const allUser = await User.find().sort({ createdAt: -1, updatedAt: -1 });
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
  return new Promise(async (resolve, reject) => {
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

module.exports = {
  createUser,
  loginUser,
  updateUser,
  deleteUser,
  getAllUser,
  getDetailsUser,
  deleteManyUser,
};
