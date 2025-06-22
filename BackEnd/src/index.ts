/**
 * Main Entry Point for the Express Server
 * 
 * This file initializes the Express application, configures middleware,
 * connects to routes, and starts the server.
 */

import express, { Request, Response, NextFunction } from 'express';
import cors from 'cors';
import path from 'path';
import config from './config/env';
import apiRoutes from './routes/api';
import { testConnection } from './database/connection';
import { initializeDatabase } from './database/init';

// Initialize Express app
const app = express();
const PORT = config.port || 5000;

// CORS Configuration
app.use(cors());

// Body parsers
app.use(express.json()); // Parse JSON request body
app.use(express.urlencoded({ extended: true })); // Parse URL-encoded request body

// Static files
app.use(express.static(path.join(__dirname, 'public')));

// Health check endpoint
app.get('/health', (req: Request, res: Response) => {
  res.status(200).json({ status: 'ok', message: 'Server is running' });
});

// API Routes
app.use('/api', apiRoutes);

// Home route
app.get('/', (req: Request, res: Response) => {
  res.json({ message: 'Welcome to the API' });
});

// Database status endpoint
app.get('/db-status', async (req: Request, res: Response) => {
  const isConnected = await testConnection();
  res.json({ 
    status: isConnected ? 'connected' : 'disconnected',
    database: config.database.database,
    host: config.database.host
  });
});

// Start server
const startServer = async (): Promise<void> => {
  try {
    // Initialize database
    await initializeDatabase();
    
    // Start listening
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  } catch (error) {
    console.error('Failed to start server:', error instanceof Error ? error.message : String(error));
    process.exit(1);
  }
};

startServer();
