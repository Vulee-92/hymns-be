const rateLimit = require('express-rate-limit');
const express = require('express');
const path = require('path');
const UserRouter = require("./UserRouter");
const ProductRouter = require("./ProductRouter");
const OrderRouter = require("./OrderRouter");
const PaymentRouter = require("./PaymentRouter");
const ContactRouter = require("./ContactRoute");
const BlogCateRouter = require("./BlogCateRouter");
const BlogRouter = require("./BlogRoute");
const recentlyViewedRouter = require("./recentlyViewedRoute");
const CateProductRouter = require("./CateProductRoute");
const BrandProductRouter = require("./BrandProductRoute");
const CollectionsProductRouter = require("./CollectionsRouter");
const NotificationRouter = require("./NotificationRoute");
const CloudinaryRoutes = require("./CloudinaryRoutes");
const CartRouter = require("./CartRouter");
const swaggerUi = require('swagger-ui-express');
const swaggerSpec = require('../utils/swaggerConfig'); // Đảm bảo đường dẫn đúng
const basicAuthMiddleware = require('../middleware/basicAuthMiddleware'); 
const ReviewRouter = require('./ReviewRouter'); // Thêm dòng này
const routes = (app) => {
  app.use("/api/user", UserRouter);
  app.use('/api/cart', CartRouter); // Thêm dòng này
  app.use("/api/product", ProductRouter);
  app.use("/api/order", OrderRouter);
  app.use("/api/payment", PaymentRouter);
  app.use("/api/contact", ContactRouter);
  app.use("/api/blog-category", BlogCateRouter);
  app.use("/api/blog", BlogRouter);
  app.use("/api/cate-product", CateProductRouter);
  app.use("/api/brand-product", BrandProductRouter);
  app.use("/api/collections", CollectionsProductRouter);
  app.use("/api/notifications", NotificationRouter);
  app.use("/api/image", CloudinaryRoutes);
  app.use('/api/recently-viewed', recentlyViewedRouter);
  app.use('/api/reviews', ReviewRouter); // Thêm dòng này

  // Đường dẫn để hiển thị tài liệu Swagger
  app.use('/api-docs', basicAuthMiddleware, swaggerUi.serve, swaggerUi.setup(swaggerSpec));
  
//   // Phục vụ thư mục public
//   app.use('/swagger-ui', express.static(path.join(__dirname, '../../public')));

//   // Phục vụ file swagger.json
//   app.get('/swagger.json', (req, res) => {
//     res.setHeader('Content-Type', 'application/json');
//     res.send(swaggerSpec);
//   });
};

module.exports = routes;