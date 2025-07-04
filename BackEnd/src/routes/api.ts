/**
 * API Routes Configuration
 * 
 * This file defines all API routes and connects them to their respective controllers.
 * It serves as a central router for organizing endpoint paths.
 */

import express, { Router } from 'express';
import userController from '../controllers/userController';
import authController from '../controllers/authController';
import auth from '../middleware/auth';

const router: Router = express.Router();

// Authentication routes
router.post('/auth/register', authController.register);
router.post('/auth/login', authController.login);
router.get('/auth/me', auth, authController.getCurrentUser);

// User routes (protected with auth middleware)
router.get('/users', auth, userController.getAllUsers);
router.get('/users/:id', auth, userController.getUserById);
router.post('/users', auth, userController.createUser);
router.put('/users/:id', auth, userController.updateUser);
router.delete('/users/:id', auth, userController.deleteUser);

// Add other routes as needed
// Example: router.use('/products', productRoutes);

export default router;
