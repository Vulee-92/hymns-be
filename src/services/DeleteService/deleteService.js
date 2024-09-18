const mongoose = require('mongoose');

const softDeleteMany = async (Model, ids) => {
  const result = await Model.updateMany(
    { _id: { $in: ids } },
    { $set: { isDeleted: true } }
  );
  return result.nModified;
};

const softDeleteOne = async (Model, id) => {
  const result = await Model.findByIdAndUpdate(id, { isDeleted: true }, { new: true });
  return result;
};

const permanentDeleteMany = async (Model, ids) => {
  const result = await Model.deleteMany({ _id: { $in: ids } });
  return result.deletedCount;
};

const permanentDeleteOne = async (Model, id) => {
  const result = await Model.findByIdAndDelete(id);
  return result;
};

module.exports = {
  softDeleteMany,
  softDeleteOne,
  permanentDeleteMany,
  permanentDeleteOne
};