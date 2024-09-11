const Carrier = require('../models/CarrierModel');

const createCarrier = (newCarrier) => {
  return new Promise(async (resolve, reject) => {
    try {
      const createdCarrier = await Carrier.create(newCarrier);
      resolve({
        status: 'OK',
        message: 'Carrier created successfully',
        data: createdCarrier
      });
    } catch (e) {
      reject(e);
    }
  });
};

const getAllCarriers = () => {
  return new Promise(async (resolve, reject) => {
    try {
      const allCarriers = await Carrier.find();
      resolve({
        status: 'OK',
        message: 'Success',
        data: allCarriers
      });
    } catch (e) {
      reject(e);
    }
  });
};

const getCarrierById = (carrierId) => {
  return new Promise(async (resolve, reject) => {
    try {
      const carrier = await Carrier.findById(carrierId);
      if (carrier) {
        resolve({
          status: 'OK',
          message: 'Success',
          data: carrier
        });
      } else {
        resolve({
          status: 'ERR',
          message: 'Carrier not found'
        });
      }
    } catch (e) {
      reject(e);
    }
  });
};

const updateCarrier = (id, data) => {
  return new Promise(async (resolve, reject) => {
    try {
      const updatedCarrier = await Carrier.findByIdAndUpdate(id, data, { new: true });
      resolve({
        status: 'OK',
        message: 'Carrier updated successfully',
        data: updatedCarrier
      });
    } catch (e) {
      reject(e);
    }
  });
};

const deleteCarrier = (id) => {
  return new Promise(async (resolve, reject) => {
    try {
      await Carrier.findByIdAndDelete(id);
      resolve({
        status: 'OK',
        message: 'Carrier deleted successfully'
      });
    } catch (e) {
      reject(e);
    }
  });
};

module.exports = {
  createCarrier,
  getAllCarriers,
  getCarrierById,
  updateCarrier,
  deleteCarrier
};