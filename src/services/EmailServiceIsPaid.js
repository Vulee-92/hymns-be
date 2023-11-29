const nodemailer = require("nodemailer");
const dotenv = require("dotenv");
dotenv.config();
var inlineBase64 = require("nodemailer-plugin-inline-base64");
const sendEmailOrderIsPaid = async (updatedOrder,isPaidSuccess) => {
	console.log("updatedOrder",updatedOrder)
	console.log("updatedOrder",isPaidSuccess)
	let transporter = nodemailer.createTransport({
		host: "smtp.gmail.com",
		port: 465,
		secure: true, // use TLS
		auth: {
			user: process.env.MAIL_ACCOUNT, // generated ethereal user
			pass: process.env.MAIL_PASSWORD,
		},
	});
	transporter.use("compile",inlineBase64({ cidPrefix: "somePrefix_" }));

	const formatter = new Intl.NumberFormat("vi-VN",{
		style: "currency",
		currency: "VND",
		minimumFractionDigits: 0,
	});
	const convert = (str) => {
		var date = new Date(str),
			mnth = ("0" + (date.getMonth() + 1)).slice(-2),
			day = ("0" + date.getDate()).slice(-2);
		return [day,mnth,date.getFullYear()].join("-");
	};
	let listItem = "";
	const attachImage = [];
	listItem += `
		<html>

			<head>
				<meta charset="UTF-8">
					<title>Thanh Toán Thành Công</title>
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
										<h2 style="font-family: Public Sans, sans-serif; color: #333333;">${updatedOrder?.orderStatus ? `Thanh toán cho đơn hàng ${updatedOrder?.codeOrder} thành công` : `Huỷ đơn hàng ${updatedOrder?.codeOrder} thành công`}</h2>
										<p style="font-family: Public Sans, sans-serif; color: #666666;">Xin chào ${updatedOrder?.shippingAddress?.fullName},</p>
										<p style="font-family: Public Sans, sans-serif; color: #666666;">${!updatedOrder?.isPaid ? `Thanh toán cho đơn hàng ${updatedOrder?.codeOrder}  của bạn đã được xử lý thành công. Chúng tôi đang chuẩn bị gói hàng cho bạn. Cảm ơn bạn đã lựa chọn chúng tôi!` : `Đơn hàng ${updatedOrder?.codeOrder} đã được huỷ theo yêu cầu. `}</p>
										<p style="font-family: Public Sans, sans-serif; color: #666666;">Để theo dõi đơn hàng, vui lòng click vào nút dưới đây:</p>
										<a href="${isPaidSuccess}" style="text-decoration: none;">
											<button style="padding: 10px 20px; border: none; border-radius: 5px; background-color: #436e67; color: white; font-family: Public Sans, sans-serif;">Theo Dõi Đơn Hàng</button>
										</a>
									</td>
								</tr>
								<tr>
									<td align="center" style="padding: 20px 40px;">
										<p style="font-family: Public Sans, sans-serif; color: #666666;">Nếu nút không hoạt động, bạn có thể copy và dán link sau vào trình duyệt:</p>
										<p style="font-family: Public Sans, sans-serif; color: #666666;">${isPaidSuccess}</p>
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

		</html>`;
	// send mail with defined transport object
	let info = await transporter.sendMail({
		from: process.env.MAIL_ACCOUNT, // sender address
		to: updatedOrder?.shippingAddress?.email && "hymnscenter@gmail.com",// list of receivers
		subject: `Đơn hàng thanh toán thành công`, // Subject line
		text: "", // plain text body
		html: `${listItem} `,
		attachments: attachImage,
	});
};

module.exports = {
	sendEmailOrderIsPaid
}
