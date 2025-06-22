/**
 * Database Initialization Script
 * 
 * This script creates the necessary tables in the MySQL database if they don't exist.
 * It also establishes relationships between tables and sets up initial data if needed.
 */

import { pool } from './connection';
import { RowDataPacket } from 'mysql2/promise';

// SQL statements to create tables
const createTablesQueries = {
  // Users table
  createUsersTable: `
    CREATE TABLE IF NOT EXISTS users (
      id INT AUTO_INCREMENT PRIMARY KEY,
      username VARCHAR(50) NOT NULL UNIQUE,
      email VARCHAR(100) NOT NULL UNIQUE,
      password VARCHAR(255) NOT NULL,
      full_name VARCHAR(100),
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
    )
  `,
  
  // Products table (example)
  createProductsTable: `
    CREATE TABLE IF NOT EXISTS products (
      id INT AUTO_INCREMENT PRIMARY KEY,
      name VARCHAR(100) NOT NULL,
      description TEXT,
      price DECIMAL(10, 2) NOT NULL,
      image_url VARCHAR(255),
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
    )
  `,
  
  // Orders table (example)
  createOrdersTable: `
    CREATE TABLE IF NOT EXISTS orders (
      id INT AUTO_INCREMENT PRIMARY KEY,
      user_id INT NOT NULL,
      total_amount DECIMAL(10, 2) NOT NULL,
      status ENUM('pending', 'processing', 'completed', 'cancelled') DEFAULT 'pending',
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
      FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
    )
  `,
  
  // Order Items table (example)
  createOrderItemsTable: `
    CREATE TABLE IF NOT EXISTS order_items (
      id INT AUTO_INCREMENT PRIMARY KEY,
      order_id INT NOT NULL,
      product_id INT NOT NULL,
      quantity INT NOT NULL,
      price DECIMAL(10, 2) NOT NULL,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
      FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE,
      FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE RESTRICT
    )
  `
};

// Initialize the database
const initializeDatabase = async (): Promise<boolean> => {
  try {
    console.log('Initializing database...');
    
    // Create tables
    await pool.query(createTablesQueries.createUsersTable);
    console.log('Users table created or already exists');
    
    await pool.query(createTablesQueries.createProductsTable);
    console.log('Products table created or already exists');
    
    await pool.query(createTablesQueries.createOrdersTable);
    console.log('Orders table created or already exists');
    
    await pool.query(createTablesQueries.createOrderItemsTable);
    console.log('Order Items table created or already exists');
    
    // Check if tables were created successfully
    const [tables] = await pool.query<RowDataPacket[]>('SHOW TABLES');
    console.log('Database tables:', tables.map(table => Object.values(table)[0]).join(', '));
    
    console.log('Database initialization completed successfully');
    return true;
  } catch (error) {
    console.error('Error initializing database:', error instanceof Error ? error.message : String(error));
    return false;
  }
};

// Export the initialization function
export { initializeDatabase };
