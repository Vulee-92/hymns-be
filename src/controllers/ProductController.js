const ProductService = require("../services/ProductService");


const createProduct = async (req,res) => {
	try {
		const {
			name,
			image, // Thay đổi tên trường
			countInStock,
			price,
			collection,
			rating,
			discount,
			category,brand,
		} = req.body;

		if (
			!name

		) {
			return res.status(500).json({
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
		const productIdSlug = req.params.id;
		const data = req.body;
		if (!productIdSlug) {
			return res.status(200).json({
				status: "ERR",
				message: "The productId is required",
			});
		}

		const response = await ProductService.updateProduct(productIdSlug,data);

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
		// res.render('blogPost',{
		// 	title: post.title,
		// 	description: post.description,
		// 	imageUrl: primaryImage,
		// 	// Other necessary data you may need in your template
		// });
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
		const { collections } = req.params;
		const { limit,page,sort,vendor,type } = req.query;
		if ((limit && limit < 0) || (page && page < 0)) {
			return res.status(400).json({
				message: "Invalid limit or page value",
			});
		}

		const response = await ProductService.getAllProduct(

			limit,page,sort,vendor,type,collections,
			Number(limit) || null,
			Number(page) || 0,
		);

		return res.status(200).json(response);
	} catch (e) {
		return res.status(500).json({
			message: e.message || "Internal Server Error",
		});
	}
};
const getAllProductAllowBrand = async (req,res) => {
	try {
		const { brand } = req.params;
		const { limit,page,sort,type } = req.query;
		if ((limit && limit < 0) || (page && page < 0)) {
			return res.status(400).json({
				message: "Invalid limit or page value",
			});
		}

		const response = await ProductService.getAllProductAllowBrand(

			limit,page,sort,type,brand,
			Number(limit) || null,
			Number(page) || 0,
		);

		return res.status(200).json(response);
	} catch (e) {
		return res.status(500).json({
			message: e.message || "Internal Server Error",
		});
	}
};

// const getAllProduct = async (req,res) => {
// 	try {
// 		const { limit,page,sort,filter } = req.query;

// 		if ((limit && limit < 0) || (page && page < 0)) {
// 			return res.status(400).json({
// 				message: "Invalid limit or page value",
// 			});
// 		}

// 		let filterValues = [];
// 		if (Array.isArray(filter)) {
// 			// Xử lý filter nếu là mảng
// 			filterValues = filter.map(item => item.toLowerCase());
// 		} else {
// 			filterValues.push(filter.toLowerCase()); // Chuyển filter thành chuỗi và chuyển thành chữ thường, sau đó đưa vào mảng
// 		}


// 		const response = await ProductService.getAllProduct(
// 			Number(limit) || null,
// 			Number(page) || 0,
// 			sort,
// 			filterValues // Sử dụng filterValues như một mảng
// 		);

// 		return res.status(200).json(response);
// 	} catch (e) {
// 		return res.status(500).json({
// 			message: e.message || "Internal Server Error",
// 		});
// 	}
// };






// const processFilter = (filter) => {
// 	return filter.map((filterItem) => {
// 		const [label,value] = filterItem.split(",");
// 		return [label,value].join(",");
// 	});
// };


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
const getAllBrand = async (req,res) => {
	try {
		const response = await ProductService.getAllBrand();
		return res.status(200).json(response);
	} catch (e) {
		return res.status(404).json({
			message: e,
		});
	}
};
const getAllCategory = async (req,res) => {
	try {
		const response = await ProductService.getAllCategory();
		return res.status(200).json(response);
	} catch (e) {
		return res.status(404).json({
			message: e,
		});
	}
};
// const getAllProduct = async (req,res) => {
// 	try {
// 		const { limit,page,sort,category,brand,priceRange } = req.query;
// 		if ((limit && limit < 0) || (page && page < 0)) {
// 			return res.status(400).json({
// 				message: "Invalid limit or page value",
// 			});
// 		}

// 		const filters = {
// 			category,
// 			brand,
// 			priceRange: priceRange, // Giả sử priceRange được gửi dưới dạng JSON từ client
// 		};

// 		const response = await ProductService.getAllProduct(
// 			Number(limit) || null,
// 			Number(page) || 0,
// 			sort,
// 			filters
// 		);

// 		return res.status(200).json(response);
// 	} catch (e) {
// 		return res.status(500).json({
// 			message: e.message || "Internal Server Error",
// 		});
// 	}
// };
// const getAllProduct = async (req,res) => {
// 	try {
// 		const { limit,page,sort } = req.query;

// 		if ((limit && limit < 0) || (page && page < 0)) {
// 			return res.status(400).json({
// 				message: "Invalid limit or page value",
// 			});
// 		}

// 		const response = await ProductService.getAllProduct(
// 			Number(limit) || null,
// 			Number(page) || 0,
// 			sort
// 		);

// 		return res.status(200).json(response);
// 	} catch (e) {
// 		return res.status(500).json({
// 			message: e.message || "Internal Server Error",
// 		});
// 	}
// };
const searchProduct = async (req,res) => {
	try {
		const { filter } = req.query;

		if (!filter) {
			return res.status(400).json({
				message: "Filter parameter is required",
			});
		}

		const searchResult = await ProductService.searchProduct(filter);

		return res.status(200).json(searchResult);
	} catch (e) {
		return res.status(500).json({
			message: e.message || "Internal Server Error",
		});
	}
};



module.exports = {
	createProduct,
	updateProduct,
	getDetailsProduct,
	deleteProduct,
	getAllProduct,
	getAllProductAllowBrand,
	deleteMany,
	getAllType,
	getAllBrand,
	getAllCategory,
	searchProduct
};
