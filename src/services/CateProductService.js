const CateProduct = require("../models/CateProductModel");
const slugify = require('slugify');

const createCateProduct = (newCate) => {
	return new Promise(async (resolve, reject) => {
		const { category, image } = newCate;
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
			const slug = slugify(category, { lower: true });

			// Tạo cate_id ngẫu nhiên và kiểm tra xem có trùng lặp không
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
				slug,
				image
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
	return new Promise(async (resolve, reject) => {
		try {
			const allCate = await CateProduct.find().sort({ createdAt: -1, updatedAt: -1 });
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

const getCateDetail = (cateId) => {
	return new Promise(async (resolve, reject) => {
		try {
			const cate = await CateProduct.findById(cateId);
			if (cate) {
				resolve({
					status: "OK",
					message: "Success",
					data: cate,
				});
			} else {
				resolve({
					status: "ERR",
					message: "Category not found",
				});
			}
		} catch (e) {
			reject(e);
		}
	});
};

const deleteCate = (cateId) => {
	return new Promise(async (resolve, reject) => {
		try {
			const result = await CateProduct.findByIdAndDelete(cateId);
			if (result) {
				resolve({
					status: "OK",
					message: "Category deleted successfully",
				});
			} else {
				resolve({
					status: "ERR",
					message: "Category not found",
				});
			}
		} catch (e) {
			reject(e);
		}
	});
};

const deleteMultipleCates = (cateIds) => {
	return new Promise(async (resolve, reject) => {
		try {
			const result = await CateProduct.deleteMany({ _id: { $in: cateIds } });
			if (result.deletedCount > 0) {
				resolve({
					status: "OK",
					message: "Categories deleted successfully",
					deletedCount: result.deletedCount,
				});
			} else {
				resolve({
					status: "ERR",
					message: "No categories found to delete",
				});
			}
		} catch (e) {
			reject(e);
		}
	});
};

const updateCate = (cateId, updatedData) => {
	return new Promise(async (resolve, reject) => {
		try {
			const result = await CateProduct.findByIdAndUpdate(cateId, updatedData, { new: true });
			if (result) {
				resolve({
					status: "OK",
					message: "Category updated successfully",
					data: result,
				});
			} else {
				resolve({
					status: "ERR",
					message: "Category not found",
				});
			}
		} catch (e) {
			reject(e);
		}
	});
};

module.exports = {
	createCateProduct,
	getAllCate,
	getCateDetail,
	deleteCate,
	deleteMultipleCates,
	updateCate
};