/**
 * User Model
 * 
 * This file defines the User model structure and methods.
 * It handles database operations related to user data using MySQL.
 */

const { pool } = require('../database/connection');

class User {
  constructor(id, username, email, fullName) {
    this.id = id;
    this.username = username;
    this.email = email;
    this.fullName = fullName;
    this.createdAt = new Date();
  }

  /**
   * Get all users from the database
   * @returns {Promise<Array>} Array of user objects
   */
  static async getAll() {
    try {
      const [rows] = await pool.query('SELECT id, username, email, full_name, created_at FROM users');
      return rows;
    } catch (error) {
      console.error('Error fetching users:', error.message);
      return []; // Return empty array on error
    }
  }
  
  /**
   * Get a single user by ID
   * @param {number} id - User ID
   * @returns {Promise<Object|null>} User object or null if not found
   */
  static async getById(id) {
    try {
      const [rows] = await pool.query(
        'SELECT id, username, email, full_name, created_at FROM users WHERE id = ?', 
        [id]
      );
      return rows.length ? rows[0] : null;
    } catch (error) {
      console.error(`Error fetching user with ID ${id}:`, error.message);
      return null;
    }
  }
  
  /**
   * Create a new user
   * @param {Object} userData - User data (username, email, password, full_name)
   * @returns {Promise<Object>} Created user object
   */
  static async create(userData) {
    try {
      const { username, email, password, fullName } = userData;
      const [result] = await pool.query(
        'INSERT INTO users (username, email, password, full_name) VALUES (?, ?, ?, ?)',
        [username, email, password || 'defaultpassword', fullName]
      );
      
      const id = result.insertId;
      return { id, username, email, fullName };
    } catch (error) {
      console.error('Error creating user:', error.message);
      throw error;
    }
  }
  
  /**
   * Update an existing user
   * @param {number} id - User ID to update
   * @param {Object} userData - User data to update
   * @returns {Promise<Object>} Updated user object
   */
  static async update(id, userData) {
    try {
      const { username, email, password, fullName } = userData;
      
      // Build the query dynamically based on provided fields
      let updates = [];
      let values = [];
      
      if (username) {
        updates.push('username = ?');
        values.push(username);
      }
      
      if (email) {
        updates.push('email = ?');
        values.push(email);
      }
      
      if (password) {
        updates.push('password = ?');
        values.push(password);
      }
      
      if (fullName) {
        updates.push('full_name = ?');
        values.push(fullName);
      }
      
      if (updates.length === 0) {
        return { id, ...userData }; // No fields to update
      }
      
      values.push(id); // Add id for the WHERE clause
      
      const [result] = await pool.query(
        `UPDATE users SET ${updates.join(', ')} WHERE id = ?`,
        values
      );
      
      return { id, ...userData };
    } catch (error) {
      console.error(`Error updating user with ID ${id}:`, error.message);
      return { id, ...userData }; // Return the input data on error
    }
  }
  
  /**
   * Delete a user
   * @param {number} id - User ID to delete
   * @returns {Promise<boolean>} True if deleted, false if not found
   */
  static async delete(id) {
    try {
      const [result] = await pool.query('DELETE FROM users WHERE id = ?', [id]);
      return result.affectedRows > 0;
    } catch (error) {
      console.error(`Error deleting user with ID ${id}:`, error.message);
      return false;
    }
  }
}

module.exports = User;
