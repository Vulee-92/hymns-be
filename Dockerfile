# Sử dụng image gốc chứa Node.js
FROM node:21-alpine

# Tạo thư mục làm việc trong container
WORKDIR /hymns-be

# Sao chép package.json và package-lock.json vào thư mục làm việc
COPY package*.json ./

# Cài đặt các dependencies của ứng dụng
RUN npm install

# Sao chép mã nguồn ứng dụng vào thư mục làm việc trong container
COPY . .

# Mở cổng mạng trên container
EXPOSE 443

# Khởi chạy ứng dụng khi container được khởi động
CMD ["npm", "start"]
