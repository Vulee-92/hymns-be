const Product = require("../models/ProductModel");
const Category = require("../models/CateProductModel");
const Brand = require("../models/BrandProductModel");
const Collections = require("../models/CollectionsModel");

const slugify = require('slugify');
const createProduct = (newProduct) => {
	return new Promise(async (resolve,reject) => {
		try {
			const { name,image,countInStock,price,rating,description,discount,fee,category,brand,collections } = newProduct;
			console.log("newProduct",newProduct);
			
			// const checkProduct = await Product.findOne({
			// 	name: name,
			// });
			// if (checkProduct !== null) {
			// 	resolve({
			// 		status: "ERR",
			// 		message: "The name of product is already",
			// 	});
			// }

			// // Nếu có, kiểm tra xem loại sản phẩm đã tồn tại hay chưa
			// const checkCategory = await Category.findOne({ category: category });

			// // Nếu có, kiểm tra xem loại sản phẩm đã tồn tại hay chưa
			// const checkBrand = await Brand.findOne({ brand: brand });

			//1. thêm 1

			// Tạo slug từ name
			const slug = slugify(name,{ lower: true });
			const newProductInstance = new Product({
				name,
				image,
				countInStock: Number(countInStock),
				price,
				rating,
				fee,
				category,
				collections,
				brand,
				description,
				discount: Number(discount),
				slug,
			});

			const createdProduct = await newProductInstance.save();

			if (createdProduct) {
				// Update brand count
				await Brand.updateOne({ brand_id: brand },{ $inc: { count: 1 } });
				// Update category count
				await Category.updateOne({ cate_id: category },{ $inc: { count: 1 } });

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
const updateProduct = (slug,data) => {
	return new Promise(async (resolve,reject) => {
		try {
			console.log("data",data)
			const checkProduct = await Product.findOne({
				slug: slug,
			});
			if (checkProduct === null) {
				resolve({
					status: "ERR",
					message: "The product is not defined",
				});
			}
			// Chuyển đổi brand và category từ name sang id nếu có
			// const brandId = await Brand.findOne({ brand_id: data.brand_id })

			// if (brandId === null) {
			// 	resolve({
			// 		status: "ERR",
			// 		message: "The brandId is not defined",
			// 	});
			// }
			// const categoryId = await Category.findOne({ cate_id: data?.cate_id })

			// if (categoryId === null) {
			// 	resolve({
			// 		status: "ERR",
			// 		message: "The categoryId is not defined",
			// 	});
			// }
			const brandId = data?.brand_id;
			console.log("brandId",brandId)
			const categoryId = data?.cate_id;
			console.log("brandId",categoryId)
			const updatedProduct = await Product.findOneAndUpdate({ slug: slug },
				{ ...data,category: categoryId,brand: brandId },{
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
const getBrandInfo = async (brandId,getTypeByName) => {
	try {
		const brand = await Brand.findById(brandId);
		return brand ? (getTypeByName ? brand.brand : brand._id) : null;
	} catch (error) {
		throw error;
	}
};

const getCategoryInfo = async (categoryId,getTypeByName) => {
	try {
		const category = await Category.findById(categoryId);
		return category ? (getTypeByName ? category.category : category._id) : null;
	} catch (error) {
		throw error;
	}
};

const getDetailsProduct = async (idSlug) => {
	try {
		const product = await Product.findOne({
			slug: idSlug,
		});
		if (!product) {
			return {
				status: "ERR",
				message: "The product is not found",
			};
		}
		return {
			status: 'OK',
			message: 'Success',
			data: product,
		};
	} catch (error) {
		throw new Error(`Error fetching product details: ${error.message}`);
	}
};





// const updateBrandAndCategoryCount = async () => {
// 	try {
// 		// Cập nhật category
// 		const categories = await Category.find({});
// 		for (const category of categories) {
// 			const count = await Product.count({ category: category.cate_id });
// 			await Category.updateOne({ cate_id: category.cate_id },{ $set: { count: count } });
// 		}
// 		// Cập nhật brand
// 		const brands = await Brand.find({});
// 		for (const brand of brands) {
// 			const count = await Product.count({ brand: brand.brand_id });

// 			await Brand.updateOne({ brand_id: brand.brand_id },{ $set: { count: count } });
// 		}



// 		console.log('Brand and category counts updated successfully.');
// 	} catch (error) {
// 		console.error('Error updating brand and category counts:',error);
// 	}
// };

const updateBrandAndCategoryCount = async () => {
	try {
		// Lấy danh sách các thương hiệu và danh mục
		const brands = await Brand.find();
		const categories = await Category.find();

		// Cập nhật số lượng sản phẩm cho từng thương hiệu
		for (const brand of brands) {
			const productCount = await Product.countDocuments({ brand: brand.brand_id });
			await Brand.updateOne({ brand_id: brand.brand_id },{ count: productCount });
		}

		// Cập nhật số lượng sản phẩm cho từng danh mục
		for (const category of categories) {
			const productCount = await Product.countDocuments({ category: category.cate_id });
			await Category.updateOne({ cate_id: category.cate_id },{ count: productCount });
		}

		console.log("Đã cập nhật số lượng sản phẩm cho từng thương hiệu và danh mục thành công.");
	} catch (error) {
		console.error("Lỗi khi cập nhật số lượng sản phẩm cho thương hiệu và danh mục:",error);
	}
};
const updateProductsInBrands = async () => {
	try {
		// Lấy tất cả các sản phẩm từ cơ sở dữ liệu
		const allProducts = await Product.find();

		// Duyệt qua từng sản phẩm và cập nhật vào brand tương ứng
		for (const product of allProducts) {
			const { brand_id,_id } = product;
			// Tìm thương hiệu dựa trên tên brand của sản phẩm
			const brandToUpdate = await Brand.findOne({ brand_id: brand_id });

			if (brandToUpdate) {
				// Nếu tìm thấy thương hiệu, cập nhật sản phẩm vào danh sách sản phẩm của brand
				brandToUpdate.products.push(_id);
				// Lưu lại thay đổi vào cơ sở dữ liệu
				await brandToUpdate.save();
			}
		}

		console.log('Updated products in corresponding brands successfully.');
	} catch (error) {
		console.error('Error updating products in brands:',error);
		throw error;
	}
};
const updateProductsInCates = async () => {
	try {
		// Lấy tất cả các sản phẩm từ cơ sở dữ liệu
		const allProducts = await Product.find();

		// Duyệt qua từng sản phẩm và cập nhật vào brand tương ứng
		for (const cate of allProducts) {
			const { category,_id } = cate;
			// Tìm thương hiệu dựa trên tên brand của sản phẩm
			const brandToUpdate = await Category.findOne({ cate_id: category });

			if (brandToUpdate) {
				// Nếu tìm thấy thương hiệu, cập nhật sản phẩm vào danh sách sản phẩm của brand
				brandToUpdate.products.push(_id);
				// Lưu lại thay đổi vào cơ sở dữ liệu
				await brandToUpdate.save();
			}
		}

		console.log('Updated products in corresponding brands successfully.');
	} catch (error) {
		console.error('Error updating products in brands:',error);
		throw error;
	}
};

const getAllProduct = async (limit, page, sort, vendor, type, collections) => {
	try {
	  // Gán giá trị mặc định cho limit và page nếu không có giá trị truyền vào
	  limit = Number(limit) || 10; // Mặc định hiển thị 10 sản phẩm mỗi trang
	  page = Number(page) || 0; // Mặc định trang đầu tiên là 0
  
	  let filter = {};
	  let collectionsFilter = [];
  
	  // Lọc theo collections
	  if (collections) {
		const collectionsSlug = await Collections.findOne({ slug: collections });
			collectionsFilter = [{ name: collectionsSlug?.name,description: collectionsSlug?.description }]
		if (collectionsSlug) {
		  filter.collections = collectionsSlug.collection_id;
		}
	  }
		// Lấy danh sách các brand và cate từ collections (nếu có)
	  let brandsFromCollections = [];
	  let catesFromCollections = [];
	  if (filter.collections) {
		const productsInCollection = await Product.find({ collections: filter.collections });
  
			const brandsId = [...new Set(productsInCollection.map(product => product.brand))];
  
			// const categoryName = await Brand.find({ brand_id: brandsId });

			catesId = [...new Set(productsInCollection.map(product => product.category))];
			const [brandNames,categoryNames] = await Promise.all([
		  Brand.find({ brand_id: { $in: brandsId } }),
		  Category.find({ cate_id: { $in: catesId } })
		]);
			// const cateName = await Category.find({ cate_id: catesId })
			brandsFromCollections = brandNames.map(item => ({ slug: item.slug,brand: item.brand,count: item.count }));
			catesFromCollections = categoryNames.map(item => ({ slug: item.slug,category: item.category,count: item.count }));
	  }
  
	  // Lọc theo vendor
	  if (vendor && vendor.length > 0) {
		const brandArray = vendor.split(',');
		const brandIds = await Brand.find({ slug: { $in: brandArray } }).distinct('brand_id');
		filter.brand = { $in: brandIds };
	  }
  
	  // Lọc theo type
	  if (type && type.length > 0) {
		const categoryArray = type.split(',');
		const categoryIds = await Category.find({ slug: { $in: categoryArray } }).distinct('cate_id');
		filter.category = { $in: categoryIds };
	  }
		// Lọc theo type
		if (type && type.length > 0) {
			const categoryArray = type.split(',');
			const categoryIds = await Category.find({ slug: { $in: categoryArray } }).distinct('cate_id');
			filter.category = { $in: categoryIds };
  
		}
	  // Truy vấn dữ liệu với các điều kiện lọc và sắp xếp
		let query = Product.find(filter).sort({ createdAt: -1,updatedAt: -1 });
  
	  // Áp dụng phân trang nếu có
		if (limit) {
	  query = query.limit(limit).skip(page * limit);
		}
  
	  const allProduct = await query;

		const totalProduct = await Product.count();
		// Định nghĩa đối tượng để lưu trữ tổng số lượng sản phẩm cho từng thương hiệu và từng danh mục

		// Lấy danh sách các brand và cate từ collections (nếu có)

		if (filter.collections && vendor) {
			const productsInCollection = await Product.find({ collections: filter.collections,brand: filter.brand });

			const categoriesId = [...new Set(productsInCollection.map(product => product.category))];
			const cateName = await Category.find({ cate_id: { $in: categoriesId } });
			catesFromCollections = cateName.map(item => ({ slug: item.slug,category: item.category,count: item.count }));
		} else if (filter.collections && type) {
			const productsInCollection = await Product.find({ collections: filter.collections,category: filter.category });

			const brandsId = [...new Set(productsInCollection.map(product => product.brand))];
			const brandName = await Brand.find({ brand_id: { $in: brandsId } });
			brandsFromCollections = brandName.map(item => ({ slug: item.slug,brand: item.brand,count: item.count }));
		}
		// await updateProductsInCates();
		// await updateProductsInBrands();
		// Update brand count
		// await updateBrandAndCategoryCount();
		// Gọi hàm để cập nhật sản phẩm
	  return {
		status: "OK",
		message: "Success",
		data: allProduct,
		total: totalProduct,
			pageCurrent: Number(page) + 1,
			totalPage: Math.ceil(totalProduct / Number(limit) || 1),
		brands: brandsFromCollections,
		categories: catesFromCollections,
		collections: collectionsFilter
	  };
	} catch (e) {
	  throw e;
	}
  };

const getAllProductAllowBrand = async (limit,page,sort,type,brand) => {
	try {
		let filter = {};
		let BrandFilter = [];

		// Lọc theo collections
		if (brand) {
			const brandSlug = await Brand.findOne({ slug: brand });
			BrandFilter = [{ name: brandSlug?.brand }]
			if (brandSlug) {
				filter.brand = brandSlug.brand_id;
			}
		}
		// Lấy danh sách các brand và cate từ collections (nếu có)
		let catesFromCollections = [];
		if (filter.brand) {
			const productsInBrand = await Product.find({ brand: filter.brand });

			const brandsId = [...new Set(productsInBrand.map(product => product.brand))];


			catesId = [...new Set(productsInBrand.map(product => product.category))];
			const [brandNames,categoryNames] = await Promise.all([
				Brand.find({ brand_id: { $in: brandsId } }),
				Category.find({ cate_id: { $in: catesId } })
			]);
			// const cateName = await Category.find({ cate_id: catesId })
			catesFromCollections = categoryNames.map(item => ({ slug: item.slug,category: item.category,count: item.count }));
		}



		// Lọc theo type
		if (type && type.length > 0) {
			const categoryArray = type.split(',');
			const categoryIds = await Category.find({ slug: { $in: categoryArray } }).distinct('cate_id');
			filter.category = { $in: categoryIds };
		}

		// Truy vấn dữ liệu với các điều kiện lọc và sắp xếp
		let query = Product.find(filter).sort({ createdAt: -1,updatedAt: -1 });

		// Áp dụng phân trang nếu có
		if (limit) {
			query = query.limit(limit).skip(page * limit);
		}

		const allProduct = await query;

		const totalProduct = await Product.count();


		return {
			status: "OK",
			message: "Success",
			data: allProduct,
			total: totalProduct,
			pageCurrent: Number(page) + 1,
			totalPage: Math.ceil(totalProduct / Number(limit) || 1),
			categories: catesFromCollections,
			brand: BrandFilter
		};
	} catch (e) {
		throw e;
	}
};




const searchProduct = async (filter) => {
	try {
		const totalProduct = await Product.count();

		// Tách filter thành một mảng các từ
		const keywords = filter.split(' ');

		// Tạo một mảng các biểu thức chính quy cho mỗi từ
		const regexArray = keywords.map(keyword => new RegExp(keyword,'i'));

		// Tạo một biểu thức chính quy tổng hợp cho tất cả các từ
		const combinedRegex = regexArray.map(regex => `(?=.*${regex.source})`).join('');

		// Sử dụng biểu thức chính quy tổng hợp để tìm kiếm
		const searchResult = await Product.find({ name: { '$regex': `^${combinedRegex}.*$`,$options: 'i' } })
			.sort({ createdAt: -1,updatedAt: -1 });

		return {
			status: 'OK',
			message: 'Success',
			data: searchResult,
			total: totalProduct,
		};
	} catch (e) {
		throw e;
	}
};


const getAllType = (selectedTypes) => {
	return new Promise(async (resolve,reject) => {
		try {
			let aggregationPipeline = [
				{
					$group: {
						_id: "$type",
						count: { $sum: 1 },
					},
				},
			];

			if (selectedTypes.length > 0) {
				aggregationPipeline.unshift({
					$match: {
						type: { $in: selectedTypes },
					},
				});
			}

			const allType = await Product.aggregate(aggregationPipeline);

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


const getAllBrand = async (selectedTypes) => {
	try {
		if (!selectedTypes || !Array.isArray(selectedTypes)) {
			throw new Error("Invalid selected types");
		}

		let aggregationPipeline = [];

		// Thêm match stage nếu có loại sản phẩm được chọn
		if (selectedTypes.length > 0) {
			aggregationPipeline.push({
				$match: {
					type: { $in: selectedTypes },
				},
			});
		}

		// Lookup to Brand collection
		aggregationPipeline.push({
			$lookup: {
				from: 'brandproducts', // Collection name of Brand
				localField: 'brand', // Field in Product model
				foreignField: '_id', // Field in Brand model
				as: 'brandInfo',
			},
		});

		// Unwind brandInfo array
		aggregationPipeline.push({ $unwind: '$brandInfo' });

		// Group by brand name and count
		aggregationPipeline.push({
			$group: {
				_id: '$brandInfo.brand', // Field in Brand model
				count: { $sum: 1 },
			},
		});

		// Execute aggregation pipeline
		const allBrands = await Product.aggregate(aggregationPipeline);

		// Format kết quả trước khi trả về
		const result = allBrands.map((brand) => ({
			brand: brand._id,
			count: brand.count,
		}));

		return {
			status: 'OK',
			message: 'Success',
			data: result,
		};
	} catch (error) {
		// Trả về lỗi nếu có bất kỳ lỗi nào xảy ra trong quá trình thực thi
		return {
			status: 'ERR',
			message: error.message,
		};
	}
};

module.exports = {
	createProduct,
	updateProduct,
	getDetailsProduct,
	deleteProduct,
	getAllProduct,
	deleteManyProduct,
	getAllType,
	getAllBrand,
	searchProduct,
	getAllProductAllowBrand
};
