/**
 * Environment Configuration
 * 
 * This file manages environment variables and configuration settings.
 * It centralizes all configuration to make the app more maintainable.
 */

import dotenv from 'dotenv';
import { AppConfig } from '../types';

// Load environment variables from .env file in non-production environments
if (process.env.NODE_ENV !== 'production') {
  dotenv.config();
}

// Export configuration settings
const config: AppConfig = {
  // Server configuration
  port: parseInt(process.env.PORT || '5000', 10),
  nodeEnv: process.env.NODE_ENV || 'development',
  
  // CORS configuration
  corsOrigin: process.env.CORS_ORIGIN || '*',
  
  // MySQL Database configuration
  database: {
    host: process.env.DB_HOST || 'localhost',
    port: parseInt(process.env.DB_PORT || '3306', 10),
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME || 'webappdb',
    connectionLimit: parseInt(process.env.DB_CONNECTION_LIMIT || '10', 10),
  },
  
  // JWT configuration (for future use)
  jwtSecret: process.env.JWT_SECRET || 'your_jwt_secret',
};

export default config;
