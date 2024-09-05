const slugify = require('slugify');
const BrandProduct = require("../models/BrandProductModel");
const createBrandProduct = (newBrand) => {
	return new Promise(async (resolve,reject) => {
		const { brand } = newBrand;
		try {
			// Tạo một số ngẫu nhiên gồm 6 chữ số
			const generateRandomId = Math.floor(100000 + Math.random() * 900000);

			// Kiểm tra xem brand có tồn tại không
			const checkNameBrand = await BrandProduct.findOne({
				brand: brand,
			});

			if (checkNameBrand !== null) {
				resolve({
					status: "ERR",
					message: "The name of product is already",
				});
			}
			const slug = slugify(brand,{ lower: true });

			// Tạo brand_id ngẫu nhiên và kiểm tra xem có trùng lặp không
			const checkIdBrand = await BrandProduct.findOne({
				brand_id: generateRandomId,
			});
			if (checkIdBrand !== null) {
				resolve({
					status: "ERR",
					message: "The checkIdBrand of product is already",
				});
			}

			// Tạo mới brand
			const newBrand = await BrandProduct.create({
				brand,
				brand_id: generateRandomId,
				slug
			});
			if (newBrand) {
				resolve({
					status: "OK",
					message: "SUCCESS",
					data: newBrand,
				});
			}
		} catch (e) {
			reject(e);
		}
	});
};
const getAllBrand = () => {
	return new Promise(async (resolve,reject) => {
		try {
			const allBrand = await BrandProduct.find().sort({ createdAt: -1,updatedAt: -1 });
			resolve({
				status: "OK",
				message: "Success",
				data: allBrand,
			});
		} catch (e) {
			reject(e);
		}
	});
};
const deleteBrand = (brandId) => {
	return new Promise(async (resolve, reject) => {
		try {
			const result = await BrandProduct.findByIdAndDelete(brandId);
			if (result) {
				resolve({
					status: "OK",
					message: "Brand deleted successfully",
				});
			} else {
				resolve({
					status: "ERR",
					message: "Brand not found",
				});
			}
		} catch (e) {
			reject(e);
		}
	});
};

const updateBrand = (brandId, updatedData) => {
	return new Promise(async (resolve, reject) => {
		try {
			const result = await BrandProduct.findByIdAndUpdate(brandId, updatedData, { new: true });
			if (result) {
				resolve({
					status: "OK",
					message: "Brand updated successfully",
					data: result,
				});
			} else {
				resolve({
					status: "ERR",
					message: "Brand not found",
				});
			}
		} catch (e) {
			reject(e);
		}
	});
};
const getBrandDetail = (brandId) => {
	return new Promise(async (resolve, reject) => {
		try {
			const brand = await BrandProduct.findById(brandId);
			if (brand) {
				resolve({
					status: "OK",
					message: "Success",
					data: brand,
				});
			} else {
				resolve({
					status: "ERR",
					message: "Brand not found",
				});
			}
		} catch (e) {
			reject(e);
		}
	});
};
const deleteMultipleBrands = (brandIds) => {
	return new Promise(async (resolve, reject) => {
		try {
			const result = await BrandProduct.deleteMany({ _id: { $in: brandIds } });
			if (result.deletedCount > 0) {
				resolve({
					status: "OK",
					message: "Brands deleted successfully",
					deletedCount: result.deletedCount,
				});
			} else {
				resolve({
					status: "ERR",
					message: "No brands found to delete",
				});
			}
		} catch (e) {
			reject(e);
		}
	});
};
module.exports = {
	createBrandProduct,
	getAllBrand,
	deleteBrand,
	updateBrand,
	getBrandDetail,
	deleteMultipleBrands
};
