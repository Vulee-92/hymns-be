const productService = require("../services/ProductService");


const createProduct = async (req,res) => {
	try {
		const {
			name,
			mainImage, 
			image, // Thay đổi tên trường
			countInStock,
			price,
			collection,
			rating,
			discount,
			category,brand,
		} = req.body;

		if (
			!name || !mainImage

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
		console.log("response: ",response);
		
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

const ProductService = require("../services/ProductService");

const getAllCategory = async (req, res) => {
  try {
    const response = await ProductService.getAllCategory();
    return res.status(200).json(response);
  } catch (e) {
    return res.status(404).json({
      message: e,
    });
  }
};

const getAllBrand = async (req, res) => {
  try {
    const { selectedTypes } = req.query;
    const typesArray = selectedTypes ? selectedTypes.split(',') : [];
    const response = await ProductService.getAllBrand(typesArray);
    return res.status(200).json(response);
  } catch (e) {
    return res.status(404).json({
      message: e,
    });
  }
};

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
	getAllBrand,
	getAllCategory,
	searchProduct
};
