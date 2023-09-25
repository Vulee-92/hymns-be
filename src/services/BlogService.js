const Blog = require("../models/BlogModel");
const createBlog = (newBlog) => {
  return new Promise(async (resolve, reject) => {
    const {
     title,
		 description,
		 category,
		 image
    } = newBlog;
    try {
      const checkNameBlog = await Blog.findOne({
        title: title,
      });
      if (checkNameBlog !== null) {
        resolve({
          status: "ERR",
          message: "The name of Blog is already",
        });
      }
      const newBlog = await Blog.create({
			title,
		 description,
		 category,
		 image
      });
      if (newBlog) {
        resolve({
          status: "OK",
          message: "SUCCESS",
          data: newBlog,
        });
      }
    } catch (e) {
      reject(e);
    }
  });
};
const getAllBlog = (limit, page, sort, filter) => {
  return new Promise(async (resolve, reject) => {
    try {
      const totalBlog = await Blog.count();
      let allBlog = [];
      if (filter) {
        const label = filter[0];
        const allObjectFilter = await Blog.find({
          [label]: { $regex: filter[1] },
        })
          .limit(limit)
          .skip(page * limit)
          .sort({ createdAt: -1, updatedAt: -1 });
        resolve({
          status: "OK",
          message: "Success",
          data: allObjectFilter,
          total: totalBlog,
          pageCurrent: Number(page + 1),
          totalPage: Math.ceil(totalBlog / limit),
        });
      }
      if (sort) {
        const objectSort = {};
        objectSort[sort[1]] = sort[0];
        const allBlogSort = await Blog.find()
          .limit(limit)
          .skip(page * limit)
          .sort(objectSort)
          .sort({ createdAt: -1, updatedAt: -1 });
        resolve({
          status: "OK",
          message: "Success",
          data: allBlogSort,
          total: totalBlog,
          pageCurrent: Number(page + 1),
          totalPage: Math.ceil(totalBlog / limit),
        });
      }
      if (!limit) {
        allBlog = await Blog.find().sort({
          createdAt: -1,
          updatedAt: -1,
        });
      } else {
        allBlog = await Blog.find()
          .limit(limit)
          .skip(page * limit)
          .sort({ createdAt: -1, updatedAt: -1 });
      }
      resolve({
        status: "OK",
        message: "Success",
        data: allBlog,
        total: totalBlog,
        pageCurrent: Number(page + 1),
        totalPage: Math.ceil(totalBlog / limit),
      });
    } catch (e) {
      reject(e);
    }
  });
};
const getDetailsBlog = (id) => {
  return new Promise(async (resolve, reject) => {
    try {
      const blog = await Blog.findOne({
        _id: id,
      });
      if (blog === null) {
        resolve({
          status: "ERR",
          message: "The blog is not defined",
        });
      }

      resolve({
        status: "OK",
        message: "SUCESS",
        data: blog,
      });
    } catch (e) {
      reject(e);
    }
  });
};

const updateBlog = (id, data) => {
  return new Promise(async (resolve, reject) => {
    try {
      const checkBlog = await Blog.findOne({
        _id: id,
      });
      if (checkBlog === null) {
        resolve({
          status: "ERR",
          message: "The Blog is not defined",
        });
      }

      const updatedBlog = await Blog.findByIdAndUpdate(id, data, {
        new: true,
      });
      resolve({
        status: "OK",
        message: "SUCCESS",
        data: updatedBlog,
      });
    } catch (e) {
      reject(e);
    }
  });
};

const deleteBlog = (id) => {
  return new Promise(async (resolve, reject) => {
    try {
      const checkBlog = await Blog.findOne({
        _id: id,
      });
      if (checkBlog === null) {
        resolve({
          status: "ERR",
          message: "The Blog is not defined",
        });
      }

      await Blog.findByIdAndDelete(id);
      resolve({
        status: "OK",
        message: "Delete Blog success",
      });
    } catch (e) {
      reject(e);
    }
  });
};

const deleteManyBlog = (ids) => {
  return new Promise(async (resolve, reject) => {
    try {
      await Blog.deleteMany({ _id: ids });
      resolve({
        status: "OK",
        message: "Delete Blog success",
      });
    } catch (e) {
      reject(e);
    }
  });
};
module.exports = {
 createBlog,
 getAllBlog,
 getDetailsBlog,
 deleteBlog,
 updateBlog,
 deleteManyBlog
};
