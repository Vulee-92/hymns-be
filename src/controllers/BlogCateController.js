const CateService = require("../services/CateService");

const createCate = async (req, res) => {
  try {
    const {
    title
    } = req.body;
    if (
      !title
    ) {
      return res.status(200).json({
        status: "ERR",
        message: "The input is required",
      });
    }
    const response = await CateService.createCate(req.body);
    return res.status(200).json(response);
  } catch (e) {
    return res.status(404).json({
      message: e,
    });
  }
};
// const updateCategory = (async (req, res) => {
//   const { id } = req.params;
//   validateMongoDbId(id);
//   try {
//     const updatedCategory = await Category.findByIdAndUpdate(id, req.body, {
//       new: true,
//     });
//     res.json(updatedCategory);
//   } catch (error) {
//     throw new Error(error);
//   }
// });
// const deleteCategory = (async (req, res) => {
//   const { id } = req.params;
//   validateMongoDbId(id);
//   try {
//     const deletedCategory = await Category.findByIdAndDelete(id);
//     res.json(deletedCategory);
//   } catch (error) {
//     throw new Error(error);
//   }
// });
// const getCategory = (async (req, res) => {
//   const { id } = req.params;
//   validateMongoDbId(id);
//   try {
//     const getaCategory = await Category.findById(id);
//     res.json(getaCategory);
//   } catch (error) {
//     throw new Error(error);
//   }
// });
// const getallCategory = (async (req, res) => {
//   try {
//     const getallCategory = await Category.find();
//     res.json(getallCategory);
//   } catch (error) {
//     throw new Error(error);
//   }
// });
module.exports = {
createCate,
} 
