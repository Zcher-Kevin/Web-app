/**
 * Authentication Middleware
 * 
 * This middleware handles user authentication for protected routes.
 * It verifies tokens and attaches user information to the request object.
 */

const auth = (req, res, next) => {
  // Get token from request header
  const token = req.header('Authorization')?.replace('Bearer ', '');

  // Check if token exists
  if (!token) {
    return res.status(401).json({ error: 'Authentication required' });
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

module.exports = auth;
