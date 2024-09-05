const UserRouter = require("./UserRouter");
const ProductRouter = require("./ProductRouter");
const OrderRouter = require("./OrderRouter");
const PaymentRouter = require("./PaymentRouter");
const ContactRouter = require("./ContactRoute");
const CateRouter = require("./CateRoute");
const BlogRouter = require("./BlogRoute");
const RecentlyViewedRoute = require("./recentlyViewedRoute");
const CateProductRouter = require("./CateProductRoute");
const BrandProductRouter = require("./BrandProductRoute");
const CollectionsProductRouter = require("./CollectionsRouter");
const NotificationRouter = require("./NotificationRoute");
const CloudinaryRoutes = require("./CloudinaryRoutes");
const swaggerUi = require('swagger-ui-express');
const swaggerSpec = require('../utils/swaggerConfig'); // Đảm bảo đường dẫn đúng
const basicAuthMiddleware = require('../middleware/basicAuthMiddleware'); 
const routes = (app) => {
  app.use("/api/user", UserRouter);
  app.use("/api/product", ProductRouter);
  app.use("/api/order", OrderRouter);
  app.use("/api/payment", PaymentRouter);
  app.use("/api/contact", ContactRouter);
  app.use("/api/cate", CateRouter);
  app.use("/api/blog", BlogRouter);
  app.use("/api/cate-product", CateProductRouter);
  app.use("/api/brand-product", BrandProductRouter);
  app.use("/api/collections", CollectionsProductRouter);
  app.use("/api/notifications", NotificationRouter);
  app.use("/api/image", CloudinaryRoutes);
  // app.use("/api/viewed", RecentlyViewedRoute);

  // Đường dẫn để hiển thị tài liệu Swagger
  app.use('/api-docs',basicAuthMiddleware, swaggerUi.serve, swaggerUi.setup(swaggerSpec));
};

module.exports = routes;