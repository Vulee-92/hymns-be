const swaggerJSDoc = require('swagger-jsdoc');
const dotenv = require('dotenv');
dotenv.config();

const serverUrl = process.env.NODE_ENV === 'production' 
  ? process.env.PROD_SERVER_URL 
  : process.env.DEV_SERVER_URL;

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'API WEBSITE',
      version: '1.0.0', 
      description: 'API documentation for your project',
    },
    servers: [
      {
        url: serverUrl, // Sử dụng URL server từ biến môi trường
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
  },
  apis: ['./src/routes/*.js'], // Đường dẫn đến các file chứa chú thích Swagger
};

const swaggerSpec = swaggerJSDoc(options);

module.exports = swaggerSpec;