/**
 * Authentication Middleware
 * 
 * This middleware handles user authentication for protected routes.
 * It verifies tokens and attaches user information to the request object.
 */

import { Request, Response, NextFunction } from 'express';

// Extend the Express Request interface to include the user property
declare global {
  namespace Express {
    interface Request {
      user?: {
        id: string;
        role: string;
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
    // In a real app, you would verify the token using JWT or another method
    // const decoded = jwt.verify(token, process.env.JWT_SECRET);
    // req.user = decoded;
    
    // For now, just simulate authentication
    req.user = { id: '123', role: 'user' };
    next();
  } catch (error) {
    res.status(401).json({ error: 'Invalid token' });
  }
};

export default auth;
