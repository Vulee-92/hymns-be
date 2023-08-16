const nodemailer = require("nodemailer");
const dotenv = require("dotenv");
dotenv.config();
var inlineBase64 = require("nodemailer-plugin-inline-base64");
const sendEmailVerify = async (email, createdOrder, verificationCode) => {
  console.log("verificationCode", verificationCode);
  let transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 465,
    secure: true, // use TLS
    auth: {
      user: process.env.MAIL_ACCOUNT, // generated ethereal user
      pass: process.env.MAIL_PASSWORD, // generated ethereal password
    },
  });
  // const verificationCode = Math.floor(100000 + Math.random() * 900000);
  transporter.use("compile", inlineBase64({ cidPrefix: "somePrefix_" }));
  // const fCurrencyVND = (number) => {
  //   const format = number ? numeral(number).format("0,0 VND") + " VNĐ" : "";

  //   return result(format, ".00");
  // };
  const formatter = new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
    minimumFractionDigits: 0,
  });
  const convert = (str) => {
    var date = new Date(str),
      mnth = ("0" + (date.getMonth() + 1)).slice(-2),
      day = ("0" + date.getDate()).slice(-2);
    return [day, mnth, date.getFullYear()].join("-");
  };
  let listItem = "";
  const attachImage = [];

  // send mail with defined transport object
  let info = await transporter.sendMail({
    from: process.env.MAIL_ACCOUNT, // sender address
    to: "hymnsguitarclass@gmail.com", // list of receivers
    subject: `Mã xác minh của bạn`, // Subject line
    text: `Mã xác minh của bạn là ${verificationCode}`,
  });
};
module.exports = {
  sendEmailVerify,
};
