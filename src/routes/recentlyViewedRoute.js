// routes/recentlyViewedRoute.js
const express = require('express');
const router = express.Router();
const RecentlyViewedController = require('../controllers/RecentlyViewedController');


router.post('/viewed-product/:id',RecentlyViewedController.updateRecentlyViewed);
router.get('/viewed-user',RecentlyViewedController.getRecentlyViewed); // Thêm endpoint mới

module.exports = router;
