const CollectionsService = require("../services/CollectionsService");

const createCollection = async (req,res) => {
	try {
		const {
			name,
		} = req.body;
		if (
			!name
		) {
			return res.status(200).json({
				status: "ERR",
				message: "The input is required",
			});
		}
		const response = await CollectionsService.createCollectionProduct(req.body);
		return res.status(200).json(response);
	} catch (e) {
		return res.status(404).json({
			message: e,
		});
	}
};
const getAllCollections = async (req,res) => {
	try {
		const response = await CollectionsService.getAllCollections();
		return res.status(200).json(response);
	} catch (e) {
		return res.status(404).json({
			message: e,
		});
	}
};
module.exports = {
	createCollection,
	getAllCollections
} 
