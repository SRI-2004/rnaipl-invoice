
const jwt = require('jsonwebtoken');


const verifyToken = (req, res, next) => {

  const tokenBearer = req.headers['authorization'];
  const token = tokenBearer.split(' ')[1];
  if (!token) {
    return res.status(401).json({ message: 'No token provided' });
  }

  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) {
      return res.status(401).json({ message: 'Invalid token' });
    }
    req.user = decoded; 
    next(); 
  });
};


const isAdmin = (req, res, next) => {

  if (!req.user || !req.user.isAdmin) {
    return res.status(403).json({ message: 'Unauthorized' });
  }
  next(); 
};

const chalk = require('chalk');
const requestLogger = (req, res, next) => {
  res.on('finish', () => {
    // Log the status code and request method
    console.log(chalk.green(`[REQUEST] ${req.method} ${req.originalUrl} - Status: ${res.statusCode}`));
  });
  next();
};
// Use the middleware in your Express app



module.exports = { verifyToken, isAdmin, requestLogger };
