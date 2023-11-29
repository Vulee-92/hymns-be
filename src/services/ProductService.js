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

const getDetailsProduct = (id) => {
	return new Promise(async (resolve,reject) => {
		try {
			const product = await Product.findOne({
				_id: id,
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





const getAllProduct = (limit,page,sort,filter) => {
	return new Promise(async (resolve,reject) => {
		try {
			const totalProduct = await Product.count();
			let allProduct = [];
			if (filter) {
				const label = filter[0];
				const allObjectFilter = await Product.find({
					[label]: { $regex: filter[1] },
				})
					.limit(limit)
					.skip(page * limit)
					.sort({ createdAt: -1,updatedAt: -1 });
				resolve({
					status: "OK",
					message: "Success",
					data: allObjectFilter,
					total: totalProduct,
					pageCurrent: Number(page + 1),
					totalPage: Math.ceil(totalProduct / limit),
				});
			}
			if (sort) {
				const objectSort = {};
				objectSort[sort[1]] = sort[0];
				const allProductSort = await Product.find()
					.limit(limit)
					.skip(page * limit)
					.sort(objectSort)
					.sort({ createdAt: -1,updatedAt: -1 });
				resolve({
					status: "OK",
					message: "Success",
					data: allProductSort,
					total: totalProduct,
					pageCurrent: Number(page + 1),
					totalPage: Math.ceil(totalProduct / limit),
				});
			}
			if (!limit) {
				allProduct = await Product.find().sort({
					createdAt: -1,
					updatedAt: -1,
				});
			} else {
				allProduct = await Product.find()
					.limit(limit)
					.skip(page * limit)
					.sort({ createdAt: -1,updatedAt: -1 });
			}
			resolve({
				status: "OK",
				message: "Success",
				data: allProduct,
				total: totalProduct,
				pageCurrent: Number(page + 1),
				totalPage: Math.ceil(totalProduct / limit),
			});
		} catch (e) {
			reject(e);
		}
	});
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
