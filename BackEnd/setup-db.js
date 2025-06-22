/**
 * Database Setup and Test Script
 * 
 * This script sets up the MySQL database and tests the connection.
 * Run this script to verify your MySQL setup before starting the server.
 */

const mysql = require('mysql2/promise');
const config = require('./config/env');
const { testConnection } = require('./database/connection');
const { initializeDatabase } = require('./database/init');

// Test MySQL connection without a specific database
async function testRawConnection() {
  const { host, port, user, password } = config.database;
  let connection;
  
  try {
    // Try to connect to MySQL server
    connection = await mysql.createConnection({
      host,
      port,
      user,
      password
    });
    
    console.log('Successfully connected to MySQL server');
    return true;
  } catch (error) {
    console.error('Failed to connect to MySQL server:', error.message);
    console.error(`Please make sure MySQL is running on ${host}:${port} and the credentials are correct`);
    return false;
  } finally {
    if (connection) {
      await connection.end();
    }
  }
}

// Create the database if it doesn't exist
async function createDatabase() {
  const { host, port, user, password, database } = config.database;
  let connection;
  
  try {
    // Connect without database specified
    connection = await mysql.createConnection({
      host,
      port,
      user,
      password
    });
    
    // Create the database if it doesn't exist
    await connection.query(`CREATE DATABASE IF NOT EXISTS ${database}`);
    console.log(`Database '${database}' created or already exists`);
    return true;
  } catch (error) {
    console.error('Failed to create database:', error.message);
    return false;
  } finally {
    if (connection) {
      await connection.end();
    }
  }
}

// Main function to run all tests
async function setupDatabase() {
  console.log('=== MySQL Database Setup ===');
  
  // Test raw connection
  const rawConnectionSuccess = await testRawConnection();
  if (!rawConnectionSuccess) {
    console.error('Failed to connect to MySQL server. Setup aborted.');
    process.exit(1);
  }
  
  // Create database
  const dbCreated = await createDatabase();
  if (!dbCreated) {
    console.error('Failed to create database. Setup aborted.');
    process.exit(1);
  }
  
  // Test connection with database
  const dbConnectionSuccess = await testConnection();
  if (!dbConnectionSuccess) {
    console.error('Failed to connect to the database. Setup aborted.');
    process.exit(1);
  }
  
  // Initialize database tables
  try {
    await initializeDatabase();
    console.log('Database tables initialized successfully');
  } catch (error) {
    console.error('Failed to initialize database tables:', error.message);
    process.exit(1);
  }
  
  console.log('=== Database Setup Complete ===');
  console.log(`Your MySQL database '${config.database.database}' is ready to use`);
  process.exit(0);
}

// Run the setup
setupDatabase();
