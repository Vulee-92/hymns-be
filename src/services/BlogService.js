const Blog = require("../models/BlogModel");
const slugify = require('slugify');

const createBlog = (newBlog) => {
	return new Promise(async (resolve, reject) => {
		const { title, description, category, image } = newBlog;
		try {
			const slug = slugify(title, { lower: true });

			const checkTitleBlog = await Blog.findOne({ title });
			if (checkTitleBlog !== null) {
				resolve({
					status: "ERR",
					message: "The title of the blog is already taken",
				});
			}

			const newBlog = await Blog.create({
				title,
				description,
				category,
				image,
				slug
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

const getAllBlogs = (limit, page, sort, filter) => {
  return new Promise(async (resolve, reject) => {
    try {
      const totalBlog = await Blog.countDocuments();
      let query = Blog.find();

      // Apply filter if provided
      if (filter) {
        const [label, value] = filter;
        query = query.find({ [label]: { $regex: value, $options: 'i' } });
      }

      // Apply sorting if provided
      if (sort) {
        const [order, field] = sort;
        const sortOrder = {};
        sortOrder[field] = order === 'asc' ? 1 : -1;
        query = query.sort(sortOrder);
      } else {
        query = query.sort({ createdAt: -1, updatedAt: -1 });
      }

      // Apply pagination if limit is provided
      if (limit) {
        query = query.limit(limit).skip(page * limit);
      }

      const allBlog = await query.exec();

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



const getBlogDetail = (blogId) => {
	return new Promise(async (resolve, reject) => {
		try {
			const blog = await Blog.findById(blogId);
			if (blog) {
				resolve({
					status: "OK",
					message: "Success",
					data: blog,
				});
			} else {
				resolve({
					status: "ERR",
					message: "Blog not found",
				});
			}
		} catch (e) {
			reject(e);
		}
	});
};

const deleteBlog = (blogId) => {
	return new Promise(async (resolve, reject) => {
		try {
			const result = await Blog.findByIdAndDelete(blogId);
			if (result) {
				resolve({
					status: "OK",
					message: "Blog deleted successfully",
				});
			} else {
				resolve({
					status: "ERR",
					message: "Blog not found",
				});
			}
		} catch (e) {
			reject(e);
		}
	});
};

const deleteMultipleBlogs = (blogIds) => {
	return new Promise(async (resolve, reject) => {
		try {
			const result = await Blog.deleteMany({ _id: { $in: blogIds } });
			if (result.deletedCount > 0) {
				resolve({
					status: "OK",
					message: "Blogs deleted successfully",
					deletedCount: result.deletedCount,
				});
			} else {
				resolve({
					status: "ERR",
					message: "No blogs found to delete",
				});
			}
		} catch (e) {
			reject(e);
		}
	});
};

const updateBlog = (blogId, updatedData) => {
	return new Promise(async (resolve, reject) => {
		try {
			const result = await Blog.findByIdAndUpdate(blogId, updatedData, { new: true });
			if (result) {
				resolve({
					status: "OK",
					message: "Blog updated successfully",
					data: result,
				});
			} else {
				resolve({
					status: "ERR",
					message: "Blog not found",
				});
			}
		} catch (e) {
			reject(e);
		}
	});
};

module.exports = {
	createBlog,
	getAllBlogs,
	getBlogDetail,
	deleteBlog,
	deleteMultipleBlogs,
	updateBlog
};