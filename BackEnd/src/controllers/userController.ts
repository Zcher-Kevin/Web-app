/**
 * User Controller
 * 
 * This controller handles all user-related business logic.
 * It processes requests from user routes and interacts with the user model.
 */

import { Request, Response } from 'express';
import User from '../models/User';
import { User as UserType } from '../types';

// Controller methods for user operations
const userController = {
  // Get all users
  getAllUsers: async (req: Request, res: Response): Promise<void> => {
    try {
      const users = await User.getAll();
      res.json(users);
    } catch (error) {
      res.status(500).json({ error: error instanceof Error ? error.message : 'Unknown error occurred' });
    }
  },

  // Get user by ID
  getUserById: async (req: Request, res: Response): Promise<void> => {
    try {
      const userId = parseInt(req.params.id, 10);
      
      if (isNaN(userId)) {
        res.status(400).json({ error: 'Invalid user ID format' });
        return;
      }
      
      const user = await User.getById(userId);
      
      if (!user) {
        res.status(404).json({ error: `User with ID ${userId} not found` });
        return;
      }
      
      res.json(user);
    } catch (error) {
      res.status(500).json({ error: error instanceof Error ? error.message : 'Unknown error occurred' });
    }
  },

  // Create new user
  createUser: async (req: Request, res: Response): Promise<void> => {
    try {
      const userData: UserType = req.body;
      
      // Validate required fields
      if (!userData.username || !userData.email) {
        res.status(400).json({ error: 'Username and email are required' });
        return;
      }
      
      const newUser = await User.create(userData);
      res.status(201).json({ message: 'User created successfully', data: newUser });
    } catch (error) {
      res.status(500).json({ error: error instanceof Error ? error.message : 'Unknown error occurred' });
    }
  },

  // Update user
  updateUser: async (req: Request, res: Response): Promise<void> => {
    try {
      const userId = parseInt(req.params.id, 10);
      
      if (isNaN(userId)) {
        res.status(400).json({ error: 'Invalid user ID format' });
        return;
      }
      
      const userData: Partial<UserType> = req.body;
      
      // Check if user exists
      const existingUser = await User.getById(userId);
      if (!existingUser) {
        res.status(404).json({ error: `User with ID ${userId} not found` });
        return;
      }
      
      const success = await User.update(userId, userData);
      
      if (success) {
        res.json({ message: 'User updated successfully' });
      } else {
        res.status(400).json({ error: 'No changes were made' });
      }
    } catch (error) {
      res.status(500).json({ error: error instanceof Error ? error.message : 'Unknown error occurred' });
    }
  },

  // Delete user
  deleteUser: async (req: Request, res: Response): Promise<void> => {
    try {
      const userId = parseInt(req.params.id, 10);
      
      if (isNaN(userId)) {
        res.status(400).json({ error: 'Invalid user ID format' });
        return;
      }
      
      // Check if user exists
      const existingUser = await User.getById(userId);
      if (!existingUser) {
        res.status(404).json({ error: `User with ID ${userId} not found` });
        return;
      }
      
      const success = await User.delete(userId);
      
      if (success) {
        res.json({ message: 'User deleted successfully' });
      } else {
        res.status(500).json({ error: 'Failed to delete user' });
      }
    } catch (error) {
      res.status(500).json({ error: error instanceof Error ? error.message : 'Unknown error occurred' });
    }
  }
};

export default userController;
