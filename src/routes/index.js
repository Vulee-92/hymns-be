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
const ComboRouter = require('./ComboRouter'); 
const HomeRouter = require("./HomeRouter");
const ShippingRouter = require("./ShippingRouter"); 
const CarrierRouter = require("./CarrierRouter"); 
const PaymentMethodRouter = require("./PaymentMethodRouter");
const RoleRouter = require("./RoleRouter");
const FeatureRouter = require("./FeatureRouter");
const FeaturePackageRouter = require("./FeaturePackageRouter");
const BannerRouter = require('./BannerRouter');

const routes = (app) => {
  app.use('/api/home', HomeRouter); 
  app.use("/api/blog", BlogRouter); 
  app.use("/api/user", UserRouter);
  app.use('/api/cart', CartRouter);
  app.use('/api/combo', ComboRouter);
  app.use('/api/shipping', ShippingRouter);
  app.use("/api/order", OrderRouter);
  app.use('/api/reviews', ReviewRouter); 
  app.use("/api/product", ProductRouter);
  app.use("/api/payment", PaymentRouter);
  app.use("/api/contact", ContactRouter);
  app.use("/api/images", CloudinaryRoutes);
  app.use('/api/dashboard', DashboardRouter); 
  app.use("/api/blog-category", BlogCateRouter);
  app.use("/api/brand-product", BrandProductRouter);
  app.use("/api/notifications", NotificationRouter);
  app.use("/api/category-product", CateProductRouter);
  app.use("/api/collection", CollectionsProductRouter);
  app.use('/api/recently-viewed', recentlyViewedRouter);
  app.use('/api/carrier', CarrierRouter); 
  app.use('/api/payment-method', PaymentMethodRouter); 
  app.use('/api/role', RoleRouter); 
  app.use('/api/banner', BannerRouter);
	
  // Thêm các route mới
  app.use('/api/feature', FeatureRouter);
  app.use('/api/feature-package', FeaturePackageRouter);
  // Đường dẫn để hiển thị tài liệu Swagger
  app.use('/api-docs', basicAuthMiddleware, swaggerUi.serve, swaggerUi.setup(swaggerSpec));

};

module.exports = routes;