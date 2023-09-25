const Cate = require("../models/CateBlog");
const createCate = (newCate) => {
  return new Promise(async (resolve, reject) => {
    const {
     title
    } = newCate;
    try {
      const checkNameCate = await Cate.findOne({
        title: title,
      });
      if (checkNameCate !== null) {
        resolve({
          status: "ERR",
          message: "The name of product is already",
        });
      }
      const newCate = await Cate.create({
     			title
      });
      if (newCate) {
        resolve({
          status: "OK",
          message: "SUCCESS",
          data: newCate,
        });
      }
    } catch (e) {
      reject(e);
    }
  });
};
module.exports = {
 createCate
};
