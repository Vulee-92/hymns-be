const User = require("../models/UserModel");
const Order = require("../models/OrderModel");

const getSummary = async (startDate, endDate) => {
  try {
    // Tính toán ngày bắt đầu và ngày kết thúc
    const start = startDate ? new Date(startDate) : new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
    const end = endDate ? new Date(endDate) : new Date();

    // Lấy số lượng người dùng đăng ký
    const userCount = await User.countDocuments({
      createdAt: { $gte: start, $lte: end }
    });

    // Lấy số lượng đơn hàng
    const orderCount = await Order.countDocuments({
      createdAt: { $gte: start, $lte: end }
    });

    // Lấy tổng doanh thu
    const totalRevenue = await Order.aggregate([
      { $match: { createdAt: { $gte: start, $lte: end } } },
      { $group: { _id: null, total: { $sum: "$totalPrice" } } }
    ]);

    // Lấy đơn hàng mới nhất với các thông tin cần thiết
    const newOrders = await Order.find({
      createdAt: { $gte: start, $lte: end }
    })
    .sort({ createdAt: -1 })
    .limit(5)
    .select('shippingAddress.fullName orderItems.name totalPrice createdAt orderStatus');

    // Lấy danh sách sản phẩm bán chạy nhất
    const topProducts = await Order.aggregate([
      { $match: { createdAt: { $gte: start, $lte: end } } },
      { $unwind: "$orderItems" },
      { $group: { _id: "$orderItems.name", totalSold: { $sum: "$orderItems.amount" } } },
      { $sort: { totalSold: -1 } },
      { $limit: 5 }
    ]);

    // Lấy danh sách người dùng mới đăng ký
    const newUsers = await User.find({
      createdAt: { $gte: start, $lte: end }
    })
    .sort({ createdAt: -1 })
    .limit(5)
    .select('name email createdAt');

    // Lấy số lượng đơn hàng theo trạng thái
    const orderStatusCount = await Order.aggregate([
      { $match: { createdAt: { $gte: start, $lte: end } } },
      { $group: { _id: "$orderStatus", count: { $sum: 1 } } }
    ]);

    // Lấy doanh thu theo ngày
    const dailyRevenue = await Order.aggregate([
      { $match: { createdAt: { $gte: start, $lte: end } } },
      { $group: { _id: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } }, total: { $sum: "$totalPrice" } } },
      { $sort: { _id: 1 } }
    ]);

    return {
      status: "OK",
      data: {
        userCount,
        orderCount,
        totalRevenue: totalRevenue[0] ? totalRevenue[0].total : 0,
        newOrders,
        topProducts,
        newUsers,
        orderStatusCount,
        dailyRevenue
      }
    };
  } catch (e) {
    throw new Error(e.message || e);
  }
};

module.exports = {
  getSummary
};