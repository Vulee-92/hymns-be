const Product = require("../models/ProductModel");

const slugify = require('slugify');

// const createProduct = (newProduct) => {
// 	return new Promise(async (resolve,reject) => {
// 		const {
// 			name,
// 			image,
// 			type,
// 			countInStock,
// 			price,
// 			rating,
// 			description,
// 			discount,
// 			fee
// 		} = newProduct;
// 		try {
// 			const checkProduct = await Product.findOne({
// 				name: name,
// 			});
// 			if (checkProduct !== null) {
// 				resolve({
// 					status: "ERR",
// 					message: "The name of product is already",
// 				});
// 			}

// 			// Tạo slug từ name
// 			const slug = slugify(name,{
// 				lower: true,
// 				remove: /[*+~.()'"!:@]/g,
// 				replacement: '-'
// 			});


// 			const newProduct = await Product.create({
// 				name,
// 				image,
// 				type,
// 				countInStock: Number(countInStock),
// 				price,
// 				rating,
// 				fee,
// 				description,
// 				discount: Number(discount),
// 				slug, // Thêm slug vào đối tượng newProduct
// 			});
// 			if (newProduct) {
// 				resolve({
// 					status: "OK",
// 					message: "SUCCESS",
// 					data: newProduct,
// 				});
// 			}
// 		} catch (e) {
// 			reject(e);
// 		}
// 	});
// };
const createProduct = (newProduct) => {
	return new Promise(async (resolve,reject) => {
		const { name,image,type,countInStock,price,rating,description,discount,fee } = newProduct;

		try {
			const checkProduct = await Product.findOne({
				name: name,
			});

			if (checkProduct !== null) {
				resolve({
					status: "ERR",
					message: "The name of product is already",
				});
			}

			// Tạo slug từ name
			const slug = slugify(name,{
				lower: true,
				remove: /[*+~.()'"!:@]/g,
				replacement: '-'
			});

			const newProductInstance = new Product({
				name,
				image,
				type,
				countInStock: Number(countInStock),
				price,
				rating,
				fee,
				description,
				discount: Number(discount),
				slug,
			});

			const createdProduct = await newProductInstance.save();

			if (createdProduct) {
				resolve({
					status: 'OK',
					message: 'SUCCESS',
					data: createdProduct,
				});
			}
		} catch (e) {
			reject(e);
		}
	});
};


const updateProduct = (id,data) => {
	return new Promise(async (resolve,reject) => {
		try {
			const checkProduct = await Product.findOne({
				_id: id,
			});
			if (checkProduct === null) {
				resolve({
					status: "ERR",
					message: "The product is not defined",
				});
			}

			const updatedProduct = await Product.findByIdAndUpdate(id,data,{
				new: true,
			});
			resolve({
				status: "OK",
				message: "SUCCESS",
				data: updatedProduct,
			});
		} catch (e) {
			reject(e);
		}
	});
};

const deleteProduct = (id) => {
	return new Promise(async (resolve,reject) => {
		try {
			const checkProduct = await Product.findOne({
				_id: id,
			});
			if (checkProduct === null) {
				resolve({
					status: "ERR",
					message: "The product is not defined",
				});
			}

			await Product.findByIdAndDelete(id);
			resolve({
				status: "OK",
				message: "Delete product success",
			});
		} catch (e) {
			reject(e);
		}
	});
};

const deleteManyProduct = (ids) => {
	return new Promise(async (resolve,reject) => {
		try {
			await Product.deleteMany({ _id: ids });
			resolve({
				status: "OK",
				message: "Delete product success",
			});
		} catch (e) {
			reject(e);
		}
	});
};

const getDetailsProduct = (idSlug) => {
	return new Promise(async (resolve,reject) => {
		try {
			const product = await Product.findOne({
				slug: idSlug,
			});
			if (product === null) {
				resolve({
					status: "ERR",
					message: "The product is not defined",
				});
			}

			resolve({
				status: "OK",
				message: "SUCESS",
				data: product,
			});
		} catch (e) {
			reject(e);
		}
	});
};




const getAllProduct = async (limit,page,sort,filter) => {
	try {
		const query = {};

		if (filter && filter.length > 0) {
			filter.forEach((filterItem) => {
				const [label,value] = filterItem.split(",");
				query[label] = { $regex: value.replace(/_/g,' '),$options: 'i' };
			});
		}

		const totalProduct = await Product.count(query);

		let sortQuery = { createdAt: -1,updatedAt: -1 };
		if (sort && sort.length === 2) {
			sortQuery = { [sort[1]]: sort[0],...sortQuery };
		}

		const allProduct = await Product.find(query)
			.limit(Number(limit) || null)
			.skip(Number(page) * Number(limit) || 0)
			.sort(sortQuery);

		return {
			status: "OK",
			message: "Success",
			data: allProduct,
			total: totalProduct,
			pageCurrent: Number(page) + 1,
			totalPage: Math.ceil(totalProduct / Number(limit) || 1),
		};
	} catch (e) {
		throw e;
	}
};



const getAllType = () => {
	return new Promise(async (resolve,reject) => {
		try {
			const allType = await Product.aggregate([
				{
					$group: {
						_id: "$type",
						count: { $sum: 1 },
					},
				},
			]);

			const result = allType.map((type) => ({
				type: type._id,
				count: type.count,
			}));
			resolve({
				status: "OK",
				message: "Success",
				data: result,
			});
		} catch (e) {
			reject(e);
		}
	});
};
module.exports = {
	createProduct,
	updateProduct,
	getDetailsProduct,
	deleteProduct,
	getAllProduct,
	deleteManyProduct,
	getAllType,
};
