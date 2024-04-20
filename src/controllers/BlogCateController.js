const CateService = require("../services/CateService");

const createCate = async (req,res) => {
	try {
		const {
			title
		} = req.body;
		if (
			!title
		) {
			return res.status(200).json({
				status: "ERR",
				message: "The input is required",
			});
		}
		const response = await CateService.createCate(req.body);
		return res.status(200).json(response);
	} catch (e) {
		return res.status(404).json({
			message: e,
		});
	}
};

module.exports = {
	createCate,
} 
