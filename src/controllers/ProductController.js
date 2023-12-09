const ProductService = require("../services/ProductService");
const RecentlyViewedController = require('../controllers/RecentlyViewedController');
const { v4: uuidv4 } = require('uuid'); // Sử dụng thư viện uuid để tạo UUID độc nhất

const createProduct = async (req,res) => {
	try {
		const {
			name,
			image, // Thay đổi tên trường
			type,
			countInStock,
			price,
			rating,
			description,
			discount,
		} = req.body;

		if (
			!name ||
			!image || // Thay đổi tên trường
			!type ||
			!countInStock ||
			!price ||
			!rating ||
			!discount
		) {
			return res.status(200).json({
				status: "ERR",
				message: "The input is required",
			});
		}

		const response = await ProductService.createProduct(req.body);

		return res.status(200).json(response);
	} catch (e) {
		return res.status(404).json({
			message: e,
		});
	}
};

const updateProduct = async (req,res) => {
	try {
		const productId = req.params.id;
		const { image,...data } = req.body;

		if (!productId) {
			return res.status(200).json({
				status: "ERR",
				message: "The productId is required",
			});
		}

		const response = await ProductService.updateProduct(productId,{
			image, // Thay đổi tên trường
			...data,
		});

		return res.status(200).json(response);
	} catch (e) {
		return res.status(404).json({
			message: e,
		});
	}
};

// const getDetailsProduct = async (req,res) => {
// 	try {
// 		const productIdSlug = req.params.id;
// 		console.log("productIdSlug",productIdSlug)
// 		if (!productIdSlug) {
// 			return res.status(200).json({
// 				status: "ERR",
// 				message: "The productId is required",
// 			});
// 		}
// 		const response = await ProductService.getDetailsProduct(productIdSlug);
// 		return res.status(200).json(response);
// 	} catch (e) {
// 		return res.status(404).json({
// 			message: e,
// 		});
// 	}
// };
const getDetailsProduct = async (req,res) => {
	try {
		const productIdSlug = req.params.id;
		if (!productIdSlug) {
			return res.status(200).json({
				status: "ERR",
				message: "The productId is required",
			});
		}





		const response = await ProductService.getDetailsProduct(productIdSlug);
		return res.status(200).json(response);
	} catch (e) {
		return res.status(404).json({
			message: e,
		});
	}
};

const deleteProduct = async (req,res) => {
	try {
		const productId = req.params.id;
		if (!productId) {
			return res.status(200).json({
				status: "ERR",
				message: "The productId is required",
			});
		}
		const response = await ProductService.deleteProduct(productId);
		return res.status(200).json(response);
	} catch (e) {
		return res.status(404).json({
			message: e,
		});
	}
};



const deleteMany = async (req,res) => {
	try {
		const ids = req.body.ids;
		if (!ids) {
			return res.status(200).json({
				status: "ERR",
				message: "The ids is required",
			});
		}
		const response = await ProductService.deleteManyProduct(ids);
		return res.status(200).json(response);
	} catch (e) {
		return res.status(404).json({
			message: e,
		});
	}
};

const getAllProduct = async (req,res) => {
	try {
		const { limit,page,sort,filter } = req.query;
		const response = await ProductService.getAllProduct(
			Number(limit) || null,
			Number(page) || 0,
			sort,
			filter
		);
		return res.status(200).json(response);
	} catch (e) {
		return res.status(404).json({
			message: e,
		});
	}
};

const getAllType = async (req,res) => {
	try {
		const response = await ProductService.getAllType();
		return res.status(200).json(response);
	} catch (e) {
		return res.status(404).json({
			message: e,
		});
	}
};

module.exports = {
	createProduct,
	updateProduct,
	getDetailsProduct,
	deleteProduct,
	getAllProduct,
	deleteMany,
	getAllType,
};
