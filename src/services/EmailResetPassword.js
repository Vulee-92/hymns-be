const nodemailer = require("nodemailer");
const dotenv = require("dotenv");
dotenv.config();
var inlineBase64 = require("nodemailer-plugin-inline-base64");
const EmailResetPassword = async (user,resetLink) => {
	console.log("user",user)
	let transporter = nodemailer.createTransport({
		host: "smtp.gmail.com",
		port: 465,
		secure: true, // use TLS
		auth: {
			user: "hymnsguitarclass@gmail.com", // generated ethereal user
			pass: "gaam rqew pfva ymki"// generated ethereal password
		},
	});
	transporter.use("compile",inlineBase64({ cidPrefix: "somePrefix_" }));



	let listItem = "";
	const attachImage = [];
	listItem += `
< !DOCTYPE html >
		<html>

			<head>
				<meta charset="UTF-8">
					<title>Đặt lại mật khẩu</title>
			</head>

			<body>
				<table width="100%" bgcolor="#f5f5f5" cellpadding="0" cellspacing="0">
					<tr>
						<td align="center">
							<table width="600" cellpadding="0" cellspacing="0" bgcolor="#ffffff" style="border-radius: 10px;">
								<tr>
									<td align="center" style="padding: 40px 0;">
										<img src="https://demo.stripocdn.email/content/guids/549c6833-ecb6-463e-b444-8b31671eae94/images/icons8verify480.png" alt="Confirm email" style="display: block; border-radius: 100px;" width="100" title="Confirm email">
									</td>
								</tr>
								<tr>
									<td style="padding: 0 40px;">
										<h2 style="font-family: Public Sans, sans-serif; color: #333333;">Đặt lại mật khẩu</h2>
										<p style="font-family: Public Sans, sans-serif; color: #666666;">Xin chào ${user?.name},</p>
										<p style="font-family: Public Sans, sans-serif; color: #666666;">Chúng tôi đã nhận được yêu cầu đặt lại mật khẩu của bạn. Nhấp vào nút bên dưới để thực hiện việc đặt lại mật khẩu:</p>
										<a href="${resetLink}" style="text-decoration: none;">
											<button style="padding: 10px 20px; border: none; border-radius: 5px; background-color: #436e67; color: white; font-family: Public Sans, sans-serif;">Đặt lại mật khẩu</button>
										</a>
									</td>
								</tr>
								<tr>
									<td align="center" style="padding: 20px 40px;">
										<p style="font-family: Public Sans, sans-serif; color: #666666;">Nếu nút không hoạt động, bạn có thể copy và dán link sau vào trình duyệt:</p>
										<p style="font-family: Public Sans, sans-serif; color: #666666;">${resetLink}</p>
									</td>
								</tr>
								<tr>
									<td align="center" style="padding: 20px 40px;">
										<p style="font-family: Public Sans, sans-serif; color: #333333;">Cảm ơn bạn đã lựa chọn chúng tôi.</p>
										<p style="font-family: Public Sans, sans-serif; color: #333333;">Trân trọng,<br>Hymns Center Team,</p>
									</td>
								</tr>
							</table>
						</td>
					</tr>
				</table>
			</body>

		</html>


	`;

	try {
		// send mail with defined transport object
		let info = await transporter.sendMail({
			from: process.env.MAIL_ACCOUNT, // sender address
			to: process.env.MAIL_ACCOUNT, // list of receivers
			subject: `Đặt lại mật khẩu`, // Subject line
			text: "", // plain text body
			html: `${listItem} `,
		});

		return {
			status: "OK",
			message: "Reset email sent successfully",
		};
	} catch (error) {
		throw new Error(error);
	}
};

module.exports = EmailResetPassword;