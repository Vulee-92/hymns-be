const ProductService = require("../services/ProductService");


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

		if ((limit && limit < 0) || (page && page < 0)) {
			return res.status(400).json({
				message: "Invalid limit or page value",
			});
		}

		const processedFilter = filter ? processFilter(filter) : null;

		const response = await ProductService.getAllProduct(
			Number(limit) || null,
			Number(page) || 0,
			sort,
			processedFilter
		);

		return res.status(200).json(response);
	} catch (e) {
		return res.status(500).json({
			message: e.message || "Internal Server Error",
		});
	}
};

const processFilter = (filter) => {
	return filter.map((filterItem) => {
		const [label,value] = filterItem.split(",");
		return [label,value].join(",");
	});
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
