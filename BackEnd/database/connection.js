/**
 * MySQL Database Connection Configuration
 * 
 * This file establishes and manages the connection to the MySQL database.
 * It uses the mysql2 package for better performance and full promise support.
 */

const mysql = require('mysql2/promise');
const config = require('../config/env');

// Create a connection pool
const pool = mysql.createPool({
  host: config.database.host,
  port: config.database.port,
  user: config.database.user,
  password: config.database.password,
  database: config.database.database,
  waitForConnections: true,
  connectionLimit: config.database.connectionLimit,
  queueLimit: 0
});

// Test the connection
const testConnection = async () => {
  try {
    const connection = await pool.getConnection();
    console.log('MySQL database connection established successfully');
    connection.release();
    return true;
  } catch (error) {
    console.error('Error connecting to MySQL database:', error.message);
    return false;
  }
};

// Export the connection pool and test function
module.exports = {
  pool,
  testConnection
};
