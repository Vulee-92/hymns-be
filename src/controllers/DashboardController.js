const dashboardService = require('../services/DashboardService');

const getSummary = async (req, res) => {
  try {
    const { startDate, endDate } = req.query;
    const response = await dashboardService.getSummary(startDate, endDate);
    return res.status(200).json(response);
  } catch (e) {
    return res.status(500).json({
      status: "ERR",
      message: e.message || e,
    });
  }
};

module.exports = {
  getSummary
};