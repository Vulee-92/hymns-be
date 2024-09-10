const swaggerAutogen = require('swagger-autogen')();
const dotenv = require('dotenv');
dotenv.config();

const localServerUrl = 'http://localhost:3003';
const devServerUrl = process.env.DEV_SERVER_URL || 'http://dev.example.com';
const prodServerUrl = process.env.PROD_SERVER_URL || 'http://prod.example.com';

const doc = {
  openapi: '3.0.0',
  info: {
    title: 'API WEBSITE',
    version: '3.0.0',
    description: 'API documentation for your project',
  },
  servers: [
    {
      url: devServerUrl, // URL server development
      description: 'Development server'
    },
    {
      url: prodServerUrl, // URL server production
      description: 'Production server'
    },
  ],
  components: {
    securitySchemes: {
      bearerAuth: {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
      },
    },
  },
  security: [
    {
      bearerAuth: [],
    },
  ],
};

const outputFile = './swagger-output.json';
const endpointsFiles = ['./src/routes/*.js']; // Đường dẫn tới các file route của bạn

swaggerAutogen(outputFile, endpointsFiles, doc).then(() => {
  console.log('Swagger documentation generated successfully.');
  process.exit(); // Thoát sau khi tạo tài liệu Swagger
});