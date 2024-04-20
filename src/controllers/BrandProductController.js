const BrandService = require("../services/BrandProductService");

const createBrand = async (req,res) => {
	try {
		const {
			brand,
		} = req.body;
		if (
			!brand
		) {
			return res.status(200).json({
				status: "ERR",
				message: "The input is required",
			});
		}
		const response = await BrandService.createBrandProduct(req.body);
		return res.status(200).json(response);
	} catch (e) {
		return res.status(404).json({
			message: e,
		});
	}
};
const getAllBrand = async (req,res) => {
	try {
		const response = await BrandService.getAllBrand();
		return res.status(200).json(response);
	} catch (e) {
		return res.status(404).json({
			message: e,
		});
	}
};
module.exports = {
	createBrand,
	getAllBrand
} 
