/**
 * API Routes Configuration
 * 
 * This file defines all API routes and connects them to their respective controllers.
 * It serves as a central router for organizing endpoint paths.
 */

const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');

// User routes
router.get('/users', userController.getAllUsers);
router.get('/users/:id', userController.getUserById);
router.post('/users', userController.createUser);
router.put('/users/:id', userController.updateUser);
router.delete('/users/:id', userController.deleteUser);

// Add other routes as needed
// Example: router.use('/products', require('./productRoutes'));

module.exports = router;
