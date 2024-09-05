const BlogService = require("../services/BlogService");

const createBlog = async (req, res) => {
	try {
		const { title, description, category, image } = req.body;
		if (!title || !description || !category || !image) {
			return res.status(200).json({
				status: "ERR",
				message: "The input is required",
			});
		}
		const response = await BlogService.createBlog(req.body);
		return res.status(200).json(response);
	} catch (e) {
		return res.status(404).json({
			message: e,
		});
	}
};

const getAllBlogs = async (req, res) => {
	try {
		const response = await BlogService.getAllBlogs();
		return res.status(200).json(response);
	} catch (e) {
		return res.status(404).json({
			message: e,
		});
	}
};

const getBlogDetail = async (req, res) => {
	try {
		const { id } = req.params;
		const response = await BlogService.getBlogDetail(id);
		return res.status(200).json(response);
	} catch (e) {
		return res.status(404).json({
			message: e,
		});
	}
};

const deleteBlog = async (req, res) => {
	try {
		const { id } = req.params;
		const response = await BlogService.deleteBlog(id);
		return res.status(200).json(response);
	} catch (e) {
		return res.status(404).json({
			message: e,
		});
	}
};

const deleteMultipleBlogs = async (req, res) => {
	try {
		const { ids } = req.body; // Expecting an array of IDs in the request body
		const response = await BlogService.deleteMultipleBlogs(ids);
		return res.status(200).json(response);
	} catch (e) {
		return res.status(404).json({
			message: e,
		});
	}
};

const updateBlog = async (req, res) => {
	try {
		const { id } = req.params;
		const response = await BlogService.updateBlog(id, req.body);
		return res.status(200).json(response);
	} catch (e) {
		return res.status(404).json({
			message: e,
		});
	}
};

module.exports = {
	createBlog,
	getAllBlogs,
	getBlogDetail,
	deleteBlog,
	deleteMultipleBlogs,
	updateBlog
};