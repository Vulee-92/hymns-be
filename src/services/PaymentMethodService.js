const PaymentMethod = require('../models/PaymentMethodModel');
const logger = require('../utils/logger');
const errorHandler = require('../utils/errorHandler');
const { PAGINATION } = require('../constants');
const cache = require('../utils/cache');
const Joi = require('joi');

// Validation schema
const paymentMethodSchema = Joi.object({
  name: Joi.string().required(),
  description: Joi.string(),
  isActive: Joi.boolean().default(true),
  // Thêm các trường khác nếu cần
});

class PaymentMethodService {
  static async createPaymentMethod(newPaymentMethod) {
    try {
      // Validation
      const { error } = paymentMethodSchema.validate(newPaymentMethod);
      if (error) throw new Error(error.details[0].message);

      // Tạo payment method mới
      const createdPaymentMethod = await PaymentMethod.create(newPaymentMethod);

      // Logging
      logger.info(`Payment method created: ${createdPaymentMethod._id}`);

      // Xóa cache
      cache.del('paymentMethods');

      return {
        status: 'OK',
        message: 'Payment method created successfully',
        data: createdPaymentMethod
      };
    } catch (error) {
      return errorHandler(error, 'Error creating payment method');
    }
  }

  static async getAllPaymentMethods(page = 1, limit = PAGINATION.DEFAULT_LIMIT, sort = { createdAt: -1 }) {
    try {
      // Kiểm tra cache
      const cacheKey = `paymentMethods_${page}_${limit}_${JSON.stringify(sort)}`;
      const cachedData = await cache.get(cacheKey);
      if (cachedData) {
        return cachedData;
      }

      // Phân trang và sắp xếp
      const options = {
        page: parseInt(page, 10),
        limit: Math.min(parseInt(limit, 10), PAGINATION.MAX_LIMIT),
        sort: sort,
        lean: true,
        select: '-__v' // Loại bỏ trường không cần thiết
      };

      const paymentMethods = await PaymentMethod.paginate({ isDeleted: false }, options);

      // Lưu vào cache
      cache.set(cacheKey, paymentMethods, 60 * 5); // Cache trong 5 phút

      return {
        status: 'OK',
        message: 'Success',
        data: paymentMethods
      };
    } catch (error) {
      return errorHandler(error, 'Error fetching payment methods');
    }
  }

  static async getPaymentMethodById(id) {
    try {
      const paymentMethod = await PaymentMethod.findOne({ _id: id, isDeleted: false }).lean();
      if (!paymentMethod) {
        throw new Error('Payment method not found');
      }
      return {
        status: 'OK',
        message: 'Success',
        data: paymentMethod
      };
    } catch (error) {
      return errorHandler(error, 'Error fetching payment method');
    }
  }

  static async updatePaymentMethod(id, updateData) {
    try {
      // Validation
      const { error } = paymentMethodSchema.validate(updateData);
      if (error) throw new Error(error.details[0].message);

      const updatedPaymentMethod = await PaymentMethod.findOneAndUpdate(
        { _id: id, isDeleted: false },
        updateData,
        { new: true, runValidators: true }
      );

      if (!updatedPaymentMethod) {
        throw new Error('Payment method not found');
      }

      // Logging
      logger.info(`Payment method updated: ${id}`);

      // Xóa cache
      cache.del('paymentMethods');

      return {
        status: 'OK',
        message: 'Payment method updated successfully',
        data: updatedPaymentMethod
      };
    } catch (error) {
      return errorHandler(error, 'Error updating payment method');
    }
  }

  static async deletePaymentMethod(id) {
    try {
      // Soft delete
      const deletedPaymentMethod = await PaymentMethod.findOneAndUpdate(
        { _id: id, isDeleted: false },
        { isDeleted: true, deletedAt: new Date() },
        { new: true }
      );

      if (!deletedPaymentMethod) {
        throw new Error('Payment method not found');
      }

      // Logging
      logger.info(`Payment method deleted: ${id}`);

      // Xóa cache
      cache.del('paymentMethods');

      return {
        status: 'OK',
        message: 'Payment method deleted successfully'
      };
    } catch (error) {
      return errorHandler(error, 'Error deleting payment method');
    }
  }
}

module.exports = PaymentMethodService;