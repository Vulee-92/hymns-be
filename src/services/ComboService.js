const Combo = require('../models/ComboModel');
const Product = require('../models/ProductModel');
const slugify = require('slugify');

const createCombo = (newCombo) => {
  return new Promise(async (resolve, reject) => {
    try {
      const { name, products, collections, brand, category, comboPrice, mainImage, images, description } = newCombo;

      // Tính tổng giá gốc và kiểm tra số lượng tồn kho
      let totalOriginalPrice = 0;
      let minCountInStock = Infinity;
      for (let item of products) {
        const product = await Product.findById(item.product);
        if (!product) {
          return reject(new Error(`Product with id ${item.product} not found`));
        }
        totalOriginalPrice += product.price * item.quantity;
        minCountInStock = Math.min(minCountInStock, Math.floor(product.countInStock / item.quantity));
      }

      const slug = slugify(name, { lower: true });

      const createdCombo = await Combo.create({
        name,
        products,
        collections,
        brand,
        category,
        totalOriginalPrice,
        comboPrice,
        mainImage,
        images,
        description,
        slug,
        countInStock: minCountInStock
      });

      resolve({
        status: 'OK',
        message: 'SUCCESS',
        data: createdCombo
      });
    } catch (e) {
      reject(e);
    }
  });
};

const getAllCombos = () => {
  return new Promise(async (resolve, reject) => {
    try {
      const allCombos = await Combo.find({ isActive: true })
        .populate('products.product')
        .populate('collections')
        .populate('brand')
        .populate('category');
      resolve({
        status: 'OK',
        message: 'Success',
        data: allCombos
      });
    } catch (e) {
      reject(e);
    }
  });
};

const getComboById = (comboId) => {
  return new Promise(async (resolve, reject) => {
    try {
      const combo = await Combo.findById(comboId)
        .populate('products.product')
        .populate('collection')
        .populate('brand')
        .populate('category');
      if (combo) {
        resolve({
          status: 'OK',
          message: 'SUCCESS',
          data: combo
        });
      } else {
        resolve({
          status: 'ERR',
          message: 'Combo not found'
        });
      }
    } catch (e) {
      reject(e);
    }
  });
};

const updateCombo = (id, data) => {
  return new Promise(async (resolve, reject) => {
    try {
      const checkCombo = await Combo.findOne({
        _id: id
      });
      if (checkCombo === null) {
        resolve({
          status: 'ERR',
          message: 'Combo not found'
        });
      }

      const updatedCombo = await Combo.findByIdAndUpdate(id, data, { new: true });
      resolve({
        status: 'OK',
        message: 'SUCCESS',
        data: updatedCombo
      });
    } catch (e) {
      reject(e);
    }
  });
};

const deleteCombo = (id) => {
  return new Promise(async (resolve, reject) => {
    try {
      const checkCombo = await Combo.findOne({
        _id: id
      });
      if (checkCombo === null) {
        resolve({
          status: 'ERR',
          message: 'Combo not found'
        });
      }

      await Combo.findByIdAndDelete(id);
      resolve({
        status: 'OK',
        message: 'Delete combo success',
      });
    } catch (e) {
      reject(e);
    }
  });
};

module.exports = {
  createCombo,
  getAllCombos,
  getComboById,
  updateCombo,
  deleteCombo
};