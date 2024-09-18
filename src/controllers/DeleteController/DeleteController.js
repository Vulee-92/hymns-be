const deleteService = require('../../services/DeleteService/deleteService');

const softDelete = (Model) => async (req, res) => {
  try {
    const { ids } = req.body;
    let result;
    if (Array.isArray(ids)) {
      result = await deleteService.softDeleteMany(Model, ids);
    } else {
      result = await deleteService.softDeleteOne(Model, ids);
    }
    res.json({ status: 'OK', message: 'Soft delete successful', result });
  } catch (error) {
    res.status(500).json({ status: 'ERR', message: error.message });
  }
};

const permanentDelete = (Model) => async (req, res) => {
  try {
    const { ids } = req.body;
    let result;
    if (Array.isArray(ids)) {
      result = await deleteService.permanentDeleteMany(Model, ids);
    } else {
      result = await deleteService.permanentDeleteOne(Model, ids);
    }
    res.json({ status: 'OK', message: 'Permanent delete successful', result });
  } catch (error) {
    res.status(500).json({ status: 'ERR', message: error.message });
  }
};

module.exports = {
  softDelete,
  permanentDelete
};