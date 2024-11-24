import jwt from 'jsonwebtoken';

const authMiddleware = (req, res, next) => {
  const token = req.headers['authorization'];

  // Check if the token is provided
  if (!token) {
    return res.status(401).json({ 
      status: 'error', 
      message: 'No token provided, authorization denied' 
    });
  }

  try {
    // Verify the token
    const decoded = jwt.verify(token, process.env.JWT_SECRET); 
    req.user = decoded; // Attach user data (like id) to the request object
    next(); 
  } catch (error) {
    return res.status(401).json({ 
      status: 'error', 
      message: 'Token is not valid' 
    });
  }
};

export default authMiddleware;
