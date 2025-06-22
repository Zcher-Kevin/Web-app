/**
 * User Controller
 * 
 * This controller handles all user-related business logic.
 * It processes requests from user routes and interacts with the user model.
 */

const User = require('../models/User');

// Controller methods for user operations
const userController = {
  // Get all users
  getAllUsers: async (req, res) => {
    try {
      const users = await User.getAll();
      res.json(users);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  // Get user by ID
  getUserById: async (req, res) => {
    try {
      const userId = req.params.id;
      const user = await User.getById(userId);
      
      if (!user) {
        return res.status(404).json({ error: `User with ID ${userId} not found` });
      }
      
      res.json(user);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  // Create new user
  createUser: async (req, res) => {
    try {
      const userData = req.body;
      
      // Validate required fields
      if (!userData.username || !userData.email) {
        return res.status(400).json({ error: 'Username and email are required' });
      }
      
      const newUser = await User.create(userData);
      res.status(201).json({ message: 'User created successfully', data: newUser });
    } catch (error) {
      // Check for duplicate entry
      if (error.code === 'ER_DUP_ENTRY') {
        return res.status(409).json({ error: 'Username or email already exists' });
      }
      
      res.status(500).json({ error: error.message });
    }
  },

  // Update existing user
  updateUser: async (req, res) => {
    try {
      const userId = req.params.id;
      const userData = req.body;
      
      // Check if user exists
      const existingUser = await User.getById(userId);
      if (!existingUser) {
        return res.status(404).json({ error: `User with ID ${userId} not found` });
      }
      
      const updatedUser = await User.update(userId, userData);
      res.json({ message: `User ${userId} updated successfully`, data: updatedUser });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  // Delete user
  deleteUser: async (req, res) => {
    try {
      const userId = req.params.id;
      
      // Try to delete the user
      const deleted = await User.delete(userId);
      
      if (!deleted) {
        return res.status(404).json({ error: `User with ID ${userId} not found` });
      }
      
      res.json({ message: `User ${userId} deleted successfully` });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
};

module.exports = userController;
