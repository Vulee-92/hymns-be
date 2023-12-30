// services/ScheduledTasks.js
const cron = require('node-cron');
const RecentlyViewedService = require('./RecentlyViewedService');

// Chạy cron job mỗi phút
cron.schedule('* * * * *', async () => {
  try {
    console.log('Running cron job to delete recently viewed data...');
    
    // Gọi hàm xóa dữ liệu trong khoảng thời gian cụ thể từ RecentlyViewedService
    await RecentlyViewedService.deleteOldViewedData();
    
    console.log('Cron job completed.');
  } catch (error) {
    console.error('Cron job error:', error);
  }
});