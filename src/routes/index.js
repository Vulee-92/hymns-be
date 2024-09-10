const path = require('path');
const express = require('express');
const BlogRouter = require("./BlogRoute");
const CartRouter = require("./CartRouter");
const UserRouter = require("./UserRouter");
const OrderRouter = require("./OrderRouter");
const ReviewRouter = require('./ReviewRouter'); 
const ContactRouter = require("./ContactRoute");
const rateLimit = require('express-rate-limit');
const swaggerUi = require('swagger-ui-express');
const ProductRouter = require("./ProductRouter");
const PaymentRouter = require("./PaymentRouter");
const BlogCateRouter = require("./BlogCateRouter");
const swaggerSpec = require('../utils/swaggerConfig'); 
const CloudinaryRoutes = require("./CloudinaryRoutes");
const CateProductRouter = require("./CateProductRoute");
const BrandProductRouter = require("./BrandProductRoute");
const NotificationRouter = require("./NotificationRoute");
const recentlyViewedRouter = require("./recentlyViewedRoute");
const CollectionsProductRouter = require("./CollectionsRouter");
const basicAuthMiddleware = require('../middleware/basicAuthMiddleware'); 
const DashboardRouter = require('./DashboardRouter'); 
const HomeRouter = require("./HomeRouter");
const routes = (app) => {
  app.use('/api/home', HomeRouter); 
  app.use("/api/blog", BlogRouter); 
  app.use("/api/user", UserRouter);
  app.use('/api/cart', CartRouter);
  app.use("/api/order", OrderRouter);
  app.use('/api/reviews', ReviewRouter); 
  app.use("/api/product", ProductRouter);
  app.use("/api/payment", PaymentRouter);
  app.use("/api/contact", ContactRouter);
  app.use("/api/image", CloudinaryRoutes);
  app.use('/api/dashboard', DashboardRouter); 
  app.use("/api/blog-category", BlogCateRouter);
  app.use("/api/brand-product", BrandProductRouter);
  app.use("/api/notifications", NotificationRouter);
  app.use("/api/category-product", CateProductRouter);
  app.use("/api/collection", CollectionsProductRouter);
  app.use('/api/recently-viewed', recentlyViewedRouter);

  // Đường dẫn để hiển thị tài liệu Swagger
  app.use('/api-docs', basicAuthMiddleware, swaggerUi.serve, swaggerUi.setup(swaggerSpec));

};

module.exports = routes;