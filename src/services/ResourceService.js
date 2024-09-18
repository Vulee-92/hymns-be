const Resource = require('../models/Resource');

const ResourceService = {
  async createResource(resourceData) {
    return await Resource.create(resourceData);
  },

  async getAllResources() {
    return await Resource.find();
  },

  async getResourceByCode(code) {
    return await Resource.findOne({ code });
  },

  async updateResource(code, updateData) {
    return await Resource.findOneAndUpdate({ code }, updateData, { new: true });
  },

  async deleteResource(code) {
    return await Resource.findOneAndDelete({ code });
  }
};

module.exports = ResourceService;