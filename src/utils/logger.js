const winston = require('winston');
const path = require('path');

// Định nghĩa các cấp độ log tùy chỉnh
const levels = {
  error: 0,
  warn: 1,
  info: 2,
  http: 3,
  debug: 4,
};

// Định nghĩa màu sắc cho mỗi cấp độ log
const colors = {
  error: 'red',
  warn: 'yellow',
  info: 'green',
  http: 'magenta',
  debug: 'white',
};

// Thêm màu sắc vào Winston
winston.addColors(colors);

// Định nghĩa format cho logs
const format = winston.format.combine(
  winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss:ms' }),
  winston.format.colorize({ all: true }),
  winston.format.printf(
    (info) => `${info.timestamp} ${info.level}: ${info.message}`,
  ),
);

// Định nghĩa các transports
const transports = [
  // Ghi tất cả logs vào file error.log
  new winston.transports.File({
    filename: path.join(__dirname, '..', '..', 'logs', 'error.log'),
    level: 'error',
  }),
  // Ghi tất cả logs vào file all.log
  new winston.transports.File({
    filename: path.join(__dirname, '..', '..', 'logs', 'all.log'),
  }),
  // Hiển thị tất cả logs trên console
  new winston.transports.Console(),
];

// Tạo instance logger
const logger = winston.createLogger({
  level: process.env.NODE_ENV === 'development' ? 'debug' : 'warn',
  levels,
  format,
  transports,
});

module.exports = logger;