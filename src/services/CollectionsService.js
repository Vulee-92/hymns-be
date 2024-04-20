const slugify = require('slugify');
const Collections = require("../models/CollectionsModel");
const createCollectionProduct = (newCollection) => {
	return new Promise(async (resolve,reject) => {
		const { name } = newCollection;
		try {
			// Tạo một số ngẫu nhiên gồm 6 chữ số
			const generateRandomId = Math.floor(100000 + Math.random() * 900000);

			// Kiểm tra xem brand có tồn tại không
			const checkNameCollection = await Collections.findOne({
				name: name,
			});
			// const checkRandomId = await BrandProduct.findOne({
			// 	collection_id: generateRandomId,
			// });

			if (checkNameCollection !== null) {
				resolve({
					status: "ERR",
					message: "The name of product is already",
				});
			}
			const slug = slugify(name,{ lower: true });

			// Tạo brand_id ngẫu nhiên và kiểm tra xem có trùng lặp không
			const checkIdCollection = await Collections.findOne({
				collection_id: generateRandomId,
			});
			if (checkIdCollection !== null) {
				resolve({
					status: "ERR",
					message: "The checkIdBrand of product is already",
				});
			}

			// Tạo mới brand
			const newCollection = await Collections.create({
				name,
				collection_id: generateRandomId,
				slug
			});
			if (newCollection) {
				resolve({
					status: "OK",
					message: "SUCCESS",
					data: newCollection,
				});
			}
		} catch (e) {
			reject(e);
		}
	});
};
const getAllCollections = () => {
	return new Promise(async (resolve,reject) => {
		try {
			const getAllCollections = await Collections.find().sort({ createdAt: -1,updatedAt: -1 });
			resolve({
				status: "OK",
				message: "Success",
				data: getAllCollections,
			});
		} catch (e) {
			reject(e);
		}
	});
};

module.exports = {
	createCollectionProduct,
	getAllCollections
};
