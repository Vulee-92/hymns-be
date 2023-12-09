const UserRouter = require("./UserRouter");
const ProductRouter = require("./ProductRouter");
const OrderRouter = require("./OrderRouter");
const PaymentRouter = require("./PaymentRouter");
const ContactRouter = require("./ContactRoute");
const CateRouter = require("./CateRoute");
const BlogRouter = require("./BlogRoute");
const RecentlyViewedRoute = require("./recentlyViewedRoute");
const routes = (app) => {
	app.use("/api/user",UserRouter);
	app.use("/api/product",ProductRouter);
	app.use("/api/order",OrderRouter);
	app.use("/api/payment",PaymentRouter);
	app.use("/api/contact",ContactRouter);
	app.use("/api/cate",CateRouter);
	app.use("/api/blog",BlogRouter);
	app.use("/api/viewed",RecentlyViewedRoute);
};

module.exports = routes;
