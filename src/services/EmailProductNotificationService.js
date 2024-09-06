const nodemailer = require("nodemailer");
const dotenv = require("dotenv");
dotenv.config();
var inlineBase64 = require("nodemailer-plugin-inline-base64");

const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 465,
    secure: true, // use TLS
    auth: {
        user: process.env.MAIL_ACCOUNT, // generated ethereal user
        pass: process.env.MAIL_PASSWORD,
    },
});
transporter.use("compile", inlineBase64({ cidPrefix: "somePrefix_" }));
const sendEmailNotification = async (email, subject, htmlContent) => {
    const mailOptions = {
        from: process.env.EMAIL_USER,
        to: email,
        subject: subject,
        html: htmlContent,
    };

    await transporter.sendMail(mailOptions);
};


const sendRegistrationNotification = async (email, productName) => {
    const subject = "Đăng ký nhận thông báo thành công";
    const htmlContent = `
      <h1>Đăng ký nhận thông báo thành công</h1>
      <p>Bạn đã đăng ký nhận thông báo khi sản phẩm <strong>${productName}</strong> có hàng trở lại.</p>
      <p>Chúng tôi sẽ gửi email cho bạn ngay khi sản phẩm có hàng.</p>
    `;
    await sendEmailNotification(email, subject, htmlContent);
};

const sendRestockNotification = async (email, productName) => {
    const subject = "Sản phẩm có hàng trở lại";
    const htmlContent = `
      <h1>Sản phẩm có hàng trở lại</h1>
      <p>Sản phẩm <strong>${productName}</strong> hiện đã có hàng trở lại.</p>
      <p>Vui lòng truy cập trang web của chúng tôi để đặt hàng ngay.</p>
    `;
    await sendEmailNotification(email, subject, htmlContent);
};

module.exports = {
    sendRegistrationNotification,
    sendRestockNotification,
};