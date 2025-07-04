/**
 * Authentication Controller
 * 
 * This controller handles user authentication including login, registration,
 * and other auth-related operations.
 */

import { Request, Response } from 'express';
import User from '../models/User';
import { User as UserType } from '../types';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import config from '../config/env';

// Controller methods for authentication operations
const authController = {
  // Register a new user
  register: async (req: Request, res: Response): Promise<void> => {
    try {
      const { username, email, password, fullName } = req.body;
      
      // Validate required fields
      if (!username || !email || !password) {
        res.status(400).json({ error: 'Username, email, and password are required' });
        return;
      }
      
      // Check if user already exists
      const existingUser = await User.findByUsername(username);
      if (existingUser) {
        res.status(409).json({ error: 'Username already taken' });
        return;
      }

      // Check if email already exists
      const existingEmail = await User.findByEmail(email);
      if (existingEmail) {
        res.status(409).json({ error: 'Email already registered' });
        return;
      }
      
      // Hash password
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);
      
      // Create user with hashed password
      const userData: UserType = {
        username,
        email,
        password: hashedPassword,
        fullName
      };
      
      const newUser = await User.create(userData);
      
      if (!newUser) {
        res.status(500).json({ error: 'Failed to create user' });
        return;
      }
      
      // Generate token for auto-login
      const token = jwt.sign(
        { id: newUser.id },
        config.jwtSecret || 'default_jwt_secret',
        { expiresIn: '1d' }
      );
      
      // Return user without password and with token
      res.status(201).json({
        message: 'User registered successfully',
        user: {
          id: newUser.id,
          username: newUser.username,
          email: newUser.email,
          fullName: newUser.fullName
        },
        token
      });
    } catch (error) {
      res.status(500).json({ error: error instanceof Error ? error.message : 'Unknown error occurred' });
    }
  },

  // Login user
  login: async (req: Request, res: Response): Promise<void> => {
    try {
      const { username, password } = req.body;
      
      // Validate required fields
      if (!username || !password) {
        res.status(400).json({ error: 'Username and password are required' });
        return;
      }
      
      // Find user
      const user = await User.findByUsernameWithPassword(username);
      
      if (!user) {
        res.status(401).json({ error: 'Invalid credentials' });
        return;
      }
      
      // Verify password
      const isMatch = await bcrypt.compare(password, user.password || '');
      
      if (!isMatch) {
        res.status(401).json({ error: 'Invalid credentials' });
        return;
      }
      
      // Generate token
      const token = jwt.sign(
        { id: user.id },
        config.jwtSecret || 'default_jwt_secret',
        { expiresIn: '1d' }
      );
      
      // Return user without password and with token
      res.json({
        message: 'Login successful',
        user: {
          id: user.id,
          username: user.username,
          email: user.email,
          fullName: user.fullName
        },
        token
      });
    } catch (error) {
      res.status(500).json({ error: error instanceof Error ? error.message : 'Unknown error occurred' });
    }
  },

  // Get current user info
  getCurrentUser: async (req: Request, res: Response): Promise<void> => {
    try {
      // User should be attached to request by auth middleware
      if (!req.user || !req.user.id) {
        res.status(401).json({ error: 'Unauthorized' });
        return;
      }
      
      const userId = parseInt(req.user.id, 10);
      const user = await User.getById(userId);
      
      if (!user) {
        res.status(404).json({ error: 'User not found' });
        return;
      }
      
      res.json({
        user: {
          id: user.id,
          username: user.username,
          email: user.email,
          fullName: user.fullName
        }
      });
    } catch (error) {
      res.status(500).json({ error: error instanceof Error ? error.message : 'Unknown error occurred' });
    }
  }
};

export default authController;
