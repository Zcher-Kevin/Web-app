/**
 * Database Setup and Test Script
 * 
 * This script sets up the MySQL database and tests the connection.
 * Run this script to verify your MySQL setup before starting the server.
 */

import mysql from 'mysql2/promise';
import config from '../config/env';
import { testConnection } from '../database/connection';
import { initializeDatabase } from '../database/init';

// Test MySQL connection without a specific database
async function testRawConnection(): Promise<boolean> {
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
    console.error('Failed to connect to MySQL server:', error instanceof Error ? error.message : String(error));
    console.error(`Please make sure MySQL is running on ${host}:${port} and the credentials are correct`);
    return false;
  } finally {
    if (connection) {
      await connection.end();
    }
  }
}

// Create the database if it doesn't exist
async function createDatabase(): Promise<boolean> {
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
    
    // Use the database
    await connection.query(`USE ${database}`);
    console.log(`Using database '${database}'`);
    
    return true;
  } catch (error) {
    console.error('Failed to create database:', error instanceof Error ? error.message : String(error));
    return false;
  } finally {
    if (connection) {
      await connection.end();
    }
  }
}

// Run all setup steps
async function runSetup(): Promise<void> {
  console.log('Starting database setup...');
  
  // Step 1: Test raw connection to MySQL server
  const rawConnectionSuccess = await testRawConnection();
  if (!rawConnectionSuccess) {
    console.error('Could not connect to MySQL server. Please check your connection settings.');
    process.exit(1);
  }
  
  // Step 2: Create database if it doesn't exist
  const databaseCreated = await createDatabase();
  if (!databaseCreated) {
    console.error('Failed to create or access database.');
    process.exit(1);
  }
  
  // Step 3: Test connection with the database
  const dbConnectionSuccess = await testConnection();
  if (!dbConnectionSuccess) {
    console.error('Failed to connect to the database after creation.');
    process.exit(1);
  }
  
  // Step 4: Initialize database tables
  const dbInitialized = await initializeDatabase();
  if (!dbInitialized) {
    console.error('Failed to initialize database tables.');
    process.exit(1);
  }
  
  console.log('Database setup completed successfully!');
  console.log('You can now start the server with npm start or npm run dev');
  process.exit(0);
}

// Run the setup process
runSetup().catch(error => {
  console.error('An unexpected error occurred during setup:', error instanceof Error ? error.message : String(error));
  process.exit(1);
});
