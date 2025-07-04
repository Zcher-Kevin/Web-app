/**
 * Authentication Middleware
 * 
 * This middleware handles user authentication for protected routes.
 * It verifies JWT tokens and attaches user information to the request object.
 */

import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import config from '../config/env';

// Extend the Express Request interface to include the user property
declare global {
  namespace Express {
    interface Request {
      user?: {
        id: string;
        iat?: number;
        exp?: number;
      };
    }
  }
}

const auth = (req: Request, res: Response, next: NextFunction): void => {
  // Get token from request header
  const authHeader = req.header('Authorization');
  const token = authHeader?.replace('Bearer ', '');

  // Check if token exists
  if (!token) {
    res.status(401).json({ error: 'Authentication required' });
    return;
  }

  try {
    // Verify the JWT token
    const decoded = jwt.verify(token, config.jwtSecret || 'default_jwt_secret');
    req.user = decoded as { id: string, iat: number, exp: number };
    next();
  } catch (error) {
    res.status(401).json({ error: 'Invalid or expired token' });
  }
};

export default auth;
