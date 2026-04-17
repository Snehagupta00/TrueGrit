import { clerkMiddleware } from '@clerk/express';

/**
 * Middleware to require authentication
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next function
 */
const requireAuth = (req, res, next) => {
  try {
    // Use req.auth() as a function (new API)
    const auth = req.auth();
    const { userId } = auth;
    
    if (!userId) {
      return res.status(401).json({
        success: false,
        message: 'Authentication required. Please sign in to continue.',
        error: 'UNAUTHORIZED'
      });
    }

    req.userId = userId;
    next();
  } catch (error) {
    console.error('❌ Authentication error:', error.message);
    return res.status(401).json({
      success: false,
      message: 'Invalid authentication token',
      error: 'INVALID_TOKEN'
    });
  }
};

/**
 * Middleware to optionally get user info (doesn't require auth)
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next function
 */
const getUser = (req, res, next) => {
  try {
    // Use req.auth() as a function (new API)
    const auth = req.auth();
    const { userId } = auth;
    req.userId = userId || null;
    next();
  } catch (error) {
    req.userId = null;
    next();
  }
};

export { requireAuth, getUser, clerkMiddleware };