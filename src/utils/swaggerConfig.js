const swaggerJSDoc = require('swagger-jsdoc');
const dotenv = require('dotenv');
dotenv.config();

const localServerUrl = 'http://localhost:3003';
const devServerUrl = process.env.DEV_SERVER_URL || 'http://dev.example.com';
const prodServerUrl = process.env.PROD_SERVER_URL || 'http://prod.example.com';

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
  },
  apis: ['./src/routes/*.js'], // Đường dẫn đến các file chứa chú thích Swagger
};

const swaggerSpec = swaggerJSDoc(options);

module.exports = swaggerSpec;