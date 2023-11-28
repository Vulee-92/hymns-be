const ContactService = require("../services/ContactService");
const JwtService = require("../services/JwtService");

const createContact = async (req,res) => {
	try {
		const { name,email,contactmessenger,phone } = req.body;
		const reg = /^\w+([-+.']\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/;
		const isCheckEmail = reg.test(email);
		if (!name || !email || !contactmessenger || !phone) {
			return res.status(400).json({
				status: "ERR",
				message: "All fields are required",
			});
		} else if (!isCheckEmail) {
			return res.status(400).json({
				status: "ERR",
				message: "Please enter a valid email address",
			});
		}
		const adminEmail = "hymnscenter@gmail.com"; // Lấy địa chỉ email của quản trị viên từ cơ sở dữ liệu hoặc một file cấu hình nào đó
		const result = await ContactService.sendContactEmail(
			{ name,email,contactmessenger,phone },
			adminEmail
		);
		return res.status(200).json(result);
	} catch (e) {
		console.log(e);
		return res.status(500).json({
			status: "ERR",
			message: "An error occurred while sending the message",
		});
	}
};

module.exports = {
	createContact,
};
