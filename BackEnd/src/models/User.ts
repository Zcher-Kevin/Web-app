/**
 * User Model
 * 
 * This file defines the User model structure and methods.
 * It handles database operations related to user data using MySQL.
 */

import { pool } from '../database/connection';
import { RowDataPacket, ResultSetHeader } from 'mysql2/promise';
import { User as UserType } from '../types';

interface UserRow extends RowDataPacket {
  id: number;
  username: string;
  email: string;
  full_name: string | null;
  created_at: Date;
}

class User {
  id?: number;
  username: string;
  email: string;
  fullName?: string;
  createdAt: Date;

  constructor(username: string, email: string, id?: number, fullName?: string) {
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
  static async getAll(): Promise<UserType[]> {
    try {
      const [rows] = await pool.query<UserRow[]>('SELECT id, username, email, full_name, created_at FROM users');
      return rows.map(row => ({
        id: row.id,
        username: row.username,
        email: row.email,
        createdAt: row.created_at
      }));
    } catch (error) {
      console.error('Error fetching users:', error instanceof Error ? error.message : String(error));
      return []; // Return empty array on error
    }
  }
  
  /**
   * Get a single user by ID
   * @param {number} id - User ID
   * @returns {Promise<Object|null>} User object or null if not found
   */
  static async getById(id: number): Promise<UserType | null> {
    try {
      const [rows] = await pool.query<UserRow[]>(
        'SELECT id, username, email, full_name, created_at FROM users WHERE id = ?', 
        [id]
      );
      if (rows.length === 0) return null;
      
      const user = rows[0];
      return {
        id: user.id,
        username: user.username,
        email: user.email,
        createdAt: user.created_at
      };
    } catch (error) {
      console.error(`Error fetching user with ID ${id}:`, error instanceof Error ? error.message : String(error));
      return null;
    }
  }
  
  /**
   * Find a user by their username
   * @param {string} username - Username to search for
   * @returns {Promise<Object|null>} User object or null if not found
   */
  static async findByUsername(username: string): Promise<UserType | null> {
    try {
      const [rows] = await pool.query<UserRow[]>(
        'SELECT id, username, email, full_name, created_at FROM users WHERE username = ?', 
        [username]
      );
      if (rows.length === 0) return null;
      
      const user = rows[0];
      return {
        id: user.id,
        username: user.username,
        email: user.email,
        createdAt: user.created_at
      };
    } catch (error) {
      console.error(`Error finding user with username ${username}:`, error instanceof Error ? error.message : String(error));
      return null;
    }
  }
  
  /**
   * Find a user by their email
   * @param {string} email - Email to search for
   * @returns {Promise<Object|null>} User object or null if not found
   */
  static async findByEmail(email: string): Promise<UserType | null> {
    try {
      const [rows] = await pool.query<UserRow[]>(
        'SELECT id, username, email, full_name, created_at FROM users WHERE email = ?', 
        [email]
      );
      if (rows.length === 0) return null;
      
      const user = rows[0];
      return {
        id: user.id,
        username: user.username,
        email: user.email,
        createdAt: user.created_at
      };
    } catch (error) {
      console.error(`Error finding user with email ${email}:`, error instanceof Error ? error.message : String(error));
      return null;
    }
  }
  
  /**
   * Find a user by username and include password for auth
   * @param {string} username - Username to search for
   * @returns {Promise<Object|null>} User object with password or null if not found
   */
  static async findByUsernameWithPassword(username: string): Promise<(UserType & { password: string }) | null> {
    try {
      const [rows] = await pool.query<(UserRow & { password: string })[]>(
        'SELECT id, username, email, password, full_name, created_at FROM users WHERE username = ?', 
        [username]
      );
      if (rows.length === 0) return null;
      
      const user = rows[0];
      return {
        id: user.id,
        username: user.username,
        email: user.email,
        password: user.password,
        fullName: user.full_name,
        createdAt: user.created_at
      };
    } catch (error) {
      console.error(`Error finding user with username ${username}:`, error instanceof Error ? error.message : String(error));
      return null;
    }
  }
  
  /**
   * Create a new user
   * @param {Object} userData - User data object
   * @returns {Promise<Object|null>} Created user object or null on error
   */
  static async create(userData: UserType): Promise<UserType | null> {
    try {
      const [result] = await pool.query<ResultSetHeader>(
        'INSERT INTO users (username, email, password, full_name) VALUES (?, ?, ?, ?)',
        [userData.username, userData.email, userData.password, userData.fullName || null]
      );
      
      if (result.affectedRows === 0) return null;
      
      return {
        id: result.insertId,
        username: userData.username,
        email: userData.email
      };
    } catch (error) {
      console.error('Error creating user:', error instanceof Error ? error.message : String(error));
      return null;
    }
  }
  
  /**
   * Update a user
   * @param {number} id - User ID
   * @param {Object} userData - User data to update
   * @returns {Promise<boolean>} Success status
   */
  static async update(id: number, userData: Partial<UserType>): Promise<boolean> {
    try {
      // Build the dynamic parts of the query based on the provided data
      const updates: string[] = [];
      const values: any[] = [];
      
      if (userData.username) {
        updates.push('username = ?');
        values.push(userData.username);
      }
      
      if (userData.email) {
        updates.push('email = ?');
        values.push(userData.email);
      }
      
      if (userData.password) {
        updates.push('password = ?');
        values.push(userData.password);
      }
      
      if (userData.fullName) {
        updates.push('full_name = ?');
        values.push(userData.fullName);
      }
      
      if (updates.length === 0) return false; // No updates to make
      
      // Add the ID at the end of the values array for the WHERE clause
      values.push(id);
      
      const [result] = await pool.query<ResultSetHeader>(
        `UPDATE users SET ${updates.join(', ')} WHERE id = ?`,
        values
      );
      
      return result.affectedRows > 0;
    } catch (error) {
      console.error(`Error updating user with ID ${id}:`, error instanceof Error ? error.message : String(error));
      return false;
    }
  }
  
  /**
   * Delete a user
   * @param {number} id - User ID
   * @returns {Promise<boolean>} Success status
   */
  static async delete(id: number): Promise<boolean> {
    try {
      const [result] = await pool.query<ResultSetHeader>('DELETE FROM users WHERE id = ?', [id]);
      return result.affectedRows > 0;
    } catch (error) {
      console.error(`Error deleting user with ID ${id}:`, error instanceof Error ? error.message : String(error));
      return false;
    }
  }
}

export default User;
