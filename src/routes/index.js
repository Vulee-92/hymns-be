const rateLimit = require('express-rate-limit');
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

// Tạo một limiter chung
const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 phút
  max: 100, // Giới hạn mỗi IP tới 100 requests mỗi 15 phút
  message: 'Too many requests from this IP, please try again later.'
});

// Tạo limiters riêng cho các route cụ thể nếu cần
const userLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 50, // Giới hạn mỗi IP tới 50 requests mỗi 15 phút cho route user
  message: 'Too many user requests from this IP, please try again later.'
});

const routes = (app) => {
  // Áp dụng limiter chung cho tất cả các routes API
  app.use("/api", apiLimiter);

  // Áp dụng limiters cụ thể cho từng route
  app.use("/api/user", userLimiter, UserRouter);
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
  // app.use("/api/viewed", RecentlyViewedRoute);
};

module.exports = routes;