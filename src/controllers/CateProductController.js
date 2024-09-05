const CateService = require("../services/CateProductService");

const createCate = async (req, res) => {
	try {
		const { category, image } = req.body;
		if (!category || !image) {
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

const getAllCate = async (req, res) => {
	try {
		const response = await CateService.getAllCate();
		return res.status(200).json(response);
	} catch (e) {
		return res.status(404).json({
			message: e,
		});
	}
};

const getCateDetail = async (req, res) => {
	try {
		const { id } = req.params;
		const response = await CateService.getCateDetail(id);
		return res.status(200).json(response);
	} catch (e) {
		return res.status(404).json({
			message: e,
		});
	}
};

const deleteCate = async (req, res) => {
	try {
		const { id } = req.params;
		const response = await CateService.deleteCate(id);
		return res.status(200).json(response);
	} catch (e) {
		return res.status(404).json({
			message: e,
		});
	}
};

const deleteMultipleCates = async (req, res) => {
	try {
		const { ids } = req.body; // Expecting an array of IDs in the request body
		const response = await CateService.deleteMultipleCates(ids);
		return res.status(200).json(response);
	} catch (e) {
		return res.status(404).json({
			message: e,
		});
	}
};

const updateCate = async (req, res) => {
	try {
		const { id } = req.params;
		const response = await CateService.updateCate(id, req.body);
		return res.status(200).json(response);
	} catch (e) {
		return res.status(404).json({
			message: e,
		});
	}
};

module.exports = {
	createCate,
	getAllCate,
	getCateDetail,
	deleteCate,
	deleteMultipleCates,
	updateCate
};