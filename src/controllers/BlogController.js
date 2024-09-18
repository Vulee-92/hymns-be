const BlogService = require("../services/BlogService");
const { softDelete } = require('./DeleteController/DeleteController');
const Blog = require('../models/BlogModel');
const errorHandler = require('../utils/errorHandler');
const logger = require('../utils/logger');
const { DEFAULT_PAGE_SIZE, MAX_PAGE_SIZE } = require('../utils/constants');
const Joi = require('joi');

const blogSchema = Joi.object({
    title: Joi.string().required(),
    description: Joi.string().required(),
    category: Joi.string().required(),
    image: Joi.string().required()
});

const createBlog = async (req, res) => {
    try {
        const { error } = blogSchema.validate(req.body);
        if (error) {
            return res.status(400).json({
                status: "ERR",
                message: error.details[0].message
            });
        }

        const response = await BlogService.createBlog(req.body);
        logger.info(`Blog created: ${response._id}`);
        return res.status(201).json(response);
    } catch (error) {
        logger.error(`Error creating blog: ${error.message}`);
        return errorHandler(res, error);
    }
};

const getAllBlogs = async (req, res) => {
    try {
        const { page = 1, limit = DEFAULT_PAGE_SIZE, sort = '-createdAt' } = req.query;
        const options = {
            page: parseInt(page, 10),
            limit: Math.min(parseInt(limit, 10), MAX_PAGE_SIZE),
            sort
        };
        const response = await BlogService.getAllBlogs(options);
        return res.status(200).json(response);
    } catch (error) {
        logger.error(`Error getting all blogs: ${error.message}`);
        return errorHandler(res, error);
    }
};

const getBlogDetail = async (req, res) => {
    try {
        const { id } = req.params;
        const response = await BlogService.getBlogDetail(id);
        if (!response) {
            return res.status(404).json({
                status: "ERR",
                message: "Blog not found"
            });
        }
        return res.status(200).json(response);
    } catch (error) {
        logger.error(`Error getting blog detail: ${error.message}`);
        return errorHandler(res, error);
    }
};

const updateBlog = async (req, res) => {
    try {
        const { id } = req.params;
        const { error } = blogSchema.validate(req.body);
        if (error) {
            return res.status(400).json({
                status: "ERR",
                message: error.details[0].message
            });
        }
        const response = await BlogService.updateBlog(id, req.body);
        if (!response) {
            return res.status(404).json({
                status: "ERR",
                message: "Blog not found"
            });
        }
        logger.info(`Blog updated: ${id}`);
        return res.status(200).json(response);
    } catch (error) {
        logger.error(`Error updating blog: ${error.message}`);
        return errorHandler(res, error);
    }
};

const deleteBlog = async (req, res) => {
    try {
        const { id } = req.params;
        const response = await softDelete(Blog)(req, res);
        logger.info(`Blog soft deleted: ${id}`);
        return response;
    } catch (error) {
        logger.error(`Error deleting blog: ${error.message}`);
        return errorHandler(res, error);
    }
};

const deleteMultipleBlogs = async (req, res) => {
    try {
        const { ids } = req.body;
        const response = await softDelete(Blog)(req, res);
        logger.info(`Multiple blogs soft deleted: ${ids.join(', ')}`);
        return response;
    } catch (error) {
        logger.error(`Error deleting multiple blogs: ${error.message}`);
        return errorHandler(res, error);
    }
};

module.exports = {
    createBlog,
    getAllBlogs,
    getBlogDetail,
    updateBlog,
    deleteBlog,
    deleteMultipleBlogs
};