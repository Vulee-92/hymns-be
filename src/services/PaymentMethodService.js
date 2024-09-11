const PaymentMethod = require('../models/PaymentMethodModel');

const createPaymentMethod = async (newPaymentMethod) => {
  try {
    const createdPaymentMethod = await PaymentMethod.create(newPaymentMethod);
    return {
      status: 'OK',
      message: 'Payment method created successfully',
      data: createdPaymentMethod
    };
  } catch (error) {
    throw new Error('Error creating payment method: ' + error.message);
  }
};

const getAllPaymentMethods = async () => {
  try {
    const paymentMethods = await PaymentMethod.find();
    return {
      status: 'OK',
      message: 'Success',
      data: paymentMethods
    };
  } catch (error) {
    throw new Error('Error fetching payment methods: ' + error.message);
  }
};

const getPaymentMethodById = async (id) => {
  try {
    const paymentMethod = await PaymentMethod.findById(id);
    if (!paymentMethod) {
      return { status: 'ERR', message: 'Payment method not found' };
    }
    return {
      status: 'OK',
      message: 'Success',
      data: paymentMethod
    };
  } catch (error) {
    throw new Error('Error fetching payment method: ' + error.message);
  }
};

const updatePaymentMethod = async (id, data) => {
  try {
    const updatedPaymentMethod = await PaymentMethod.findByIdAndUpdate(id, data, { new: true });
    if (!updatedPaymentMethod) {
      return { status: 'ERR', message: 'Payment method not found' };
    }
    return {
      status: 'OK',
      message: 'Payment method updated successfully',
      data: updatedPaymentMethod
    };
  } catch (error) {
    throw new Error('Error updating payment method: ' + error.message);
  }
};

const deletePaymentMethod = async (id) => {
  try {
    const deletedPaymentMethod = await PaymentMethod.findByIdAndDelete(id);
    if (!deletedPaymentMethod) {
      return { status: 'ERR', message: 'Payment method not found' };
    }
    return {
      status: 'OK',
      message: 'Payment method deleted successfully'
    };
  } catch (error) {
    throw new Error('Error deleting payment method: ' + error.message);
  }
};

module.exports = {
  createPaymentMethod,
  getAllPaymentMethods,
  getPaymentMethodById,
  updatePaymentMethod,
  deletePaymentMethod
};