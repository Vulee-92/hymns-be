const express = require("express");
const router = express.Router();
const homeController = require('../controllers/HomeController');

/**
 * @swagger
 * /api/home/best-sellers:
 *   get:
 *     summary: Lấy danh sách sản phẩm bán chạy nhất
 *     tags: [Home]
 *     responses:
 *       200:
 *         description: Danh sách sản phẩm bán chạy nhất
 *       400:
 *         description: Lỗi khi lấy thông tin
 */
router.get('/best-sellers', homeController.getBestSellers);

/**
 * @swagger
 * /api/home/new-arrivals:
 *   get:
 *     summary: Lấy danh sách sản phẩm mới về
 *     tags: [Home]
 *     responses:
 *       200:
 *         description: Danh sách sản phẩm mới về
 *       400:
 *         description: Lỗi khi lấy thông tin
 */
router.get('/new-arrivals', homeController.getNewArrivals);

/**
 * @swagger
 * /api/home/specials:
 *   get:
 *     summary: Lấy danh sách sản phẩm đang giảm giá
 *     tags: [Home]
 *     responses:
 *       200:
 *         description: Danh sách sản phẩm đang giảm giá
 *       400:
 *         description: Lỗi khi lấy thông tin
 */
router.get('/specials', homeController.getSpecials);
/**
 * @swagger
 * /api/home/latest-blogs:
 *   get:
 *     summary: Lấy danh sách bài blog mới nhất
 *     tags: [Home]
 *     responses:
 *       200:
 *         description: Danh sách bài blog mới nhất
 *       400:
 *         description: Lỗi khi lấy thông tin
 */
router.get('/latest-blogs', homeController.getLatestBlogs);
module.exports = router;