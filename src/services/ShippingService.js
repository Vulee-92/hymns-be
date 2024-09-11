const Shipping = require('../models/ShippingModel');
const Carrier = require('../models/CarrierModel');

const createShipping = (newShipping) => {
  return new Promise(async (resolve, reject) => {
    try {
      const carrier = await Carrier.findById(newShipping.carrier);
      if (!carrier) {
        return reject(new Error('Carrier not found'));
      }
      const createdShipping = await Shipping.create(newShipping);
      resolve({
        status: 'OK',
        message: 'Shipping created successfully',
        data: createdShipping
      });
    } catch (e) {
      reject(e);
    }
  });
};

const getAllShippings = () => {
  return new Promise(async (resolve, reject) => {
    try {
      const allShippings = await Shipping.find().populate('orderId').populate('carrier');
      resolve({
        status: 'OK',
        message: 'Success',
        data: allShippings
      });
    } catch (e) {
      reject(e);
    }
  });
};

const getShippingById = (shippingId) => {
  return new Promise(async (resolve, reject) => {
    try {
      const shipping = await Shipping.findById(shippingId).populate('orderId').populate('carrier');
      if (shipping) {
        resolve({
          status: 'OK',
          message: 'Success',
          data: shipping
        });
      } else {
        resolve({
          status: 'ERR',
          message: 'Shipping not found'
        });
      }
    } catch (e) {
      reject(e);
    }
  });
};

const updateShipping = (id, data) => {
  return new Promise(async (resolve, reject) => {
    try {
      if (data.carrier) {
        const carrier = await Carrier.findById(data.carrier);
        if (!carrier) {
          return reject(new Error('Carrier not found'));
        }
      }
      const updatedShipping = await Shipping.findByIdAndUpdate(id, data, { new: true });
      resolve({
        status: 'OK',
        message: 'Shipping updated successfully',
        data: updatedShipping
      });
    } catch (e) {
      reject(e);
    }
  });
};

const deleteShipping = (id) => {
  return new Promise(async (resolve, reject) => {
    try {
      await Shipping.findByIdAndDelete(id);
      resolve({
        status: 'OK',
        message: 'Shipping deleted successfully'
      });
    } catch (e) {
      reject(e);
    }
  });
};

module.exports = {
  createShipping,
  getAllShippings,
  getShippingById,
  updateShipping,
  deleteShipping
};