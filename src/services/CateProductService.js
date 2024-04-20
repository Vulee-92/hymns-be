const CateProduct = require("../models/CateProductModel");
const slugify = require('slugify');
const createCateProduct = (newCate) => {
	return new Promise(async (resolve,reject) => {
		const {
			category
		} = newCate;
		try {
			const generateRandomId = Math.floor(100000 + Math.random() * 900000);

			const checkNameCate = await CateProduct.findOne({
				category: category,
			});
			if (checkNameCate !== null) {
				resolve({
					status: "ERR",
					message: "The category of product is already",
				});
			}
			const slug = slugify(category,{ lower: true });


			// Tạo brand_id ngẫu nhiên và kiểm tra xem có trùng lặp không
			const checkIdCate = await CateProduct.findOne({
				cate_id: generateRandomId,
			});
			if (checkIdCate !== null) {
				resolve({
					status: "ERR",
					message: "The checkIdCate of product is already",
				});
			}

			const newCate = await CateProduct.create({
				category,
				cate_id: generateRandomId,
				slug
			});
			if (newCate) {
				resolve({
					status: "OK",
					message: "SUCCESS",
					data: newCate,
				});
			}
		} catch (e) {
			reject(e);
		}
	});
};
const getAllCate = () => {
	return new Promise(async (resolve,reject) => {
		try {
			const allCate = await CateProduct.find().sort({ createdAt: -1,updatedAt: -1 });
			resolve({
				status: "OK",
				message: "Success",
				data: allCate,
			});
		} catch (e) {
			reject(e);
		}
	});
};

module.exports = {
	createCateProduct,
	getAllCate
};
