const CateService = require("../services/CateProductService");

const createCate = async (req,res) => {
	try {
		const {
			category,
		} = req.body;
		if (
			!category
		) {
			return res.status(200).json({
				status: "ERR",
				message: "The input is required",
			});
		}
		const response = await CateService.createCateProduct(req.body);
		return res.status(200).json(response);
	} catch (e) {
		return res.status(404).json({
			message: e,
		});
	}
};
const getAllCate = async (req,res) => {
	try {
		const response = await CateService.getAllCate();
		return res.status(200).json(response);
	} catch (e) {
		return res.status(404).json({
			message: e,
		});
	}
};
module.exports = {
	createCate,
	getAllCate
} 
