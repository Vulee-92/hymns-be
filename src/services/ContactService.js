const bcrypt = require("bcrypt");
const { genneralAccessToken, genneralRefreshToken } = require("./JwtService");
const dotenv = require("dotenv");
dotenv.config();
const nodemailer = require("nodemailer");
const Contact = require("../models/ContactModel");
const sendContactEmail = async (contactInfo, adminEmail) => {
  const { name, email,phone, contactmessenger } = contactInfo;

  try {
    const transporter = nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 465,
      secure: true, // use TLS
      auth: {
        user: process.env.MAIL_ACCOUNT, // generated ethereal user
        pass: process.env.MAIL_PASSWORD, // generated ethereal password
      },
    });

    const mailOptions = {
      from: process.env.MAIL_ACCOUNT, // sender address
      to: "hymnsguitarclass@gmail.com", // list of receivers
      subject: "New contact message from your website",
      text: `Name: ${name}\nEmail: ${email}\nMessage: ${contactmessenger}\nPhone: ${phone}`,
    };

    const newContact = await Contact.create({
      name,
      email,
			phone,
      contactmessenger,
    });

    const promise = new Promise((resolve, reject) => {
      transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
          reject(error);
        } else {
          resolve({
            status: "OK",
            message: "Your message has been sent successfully",
          });
        }
      });
    });

    await promise;

    return {
      status: "OK",
      message: "Your message has been sent successfully",
    };
  } catch (e) {
    console.log(e);
    throw new Error("An error occurred while sending the message");
  }
};

module.exports = {
  sendContactEmail,
};
