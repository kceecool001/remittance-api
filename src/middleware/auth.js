const jwt = require('jsonwebtoken');
const User = require('../models/User');

const auth = async (req, res, next) => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '');

    if (!token) {
      return res.status(401).json({
        error: 'Authentication required'
      });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key');
    const user = await User.findOne({
      where: { id: decoded.userId, isActive: true }
    });

    if (!user) {
      return res.status(401).json({
        error: 'Invalid authentication token'
      });
    }

    req.user = {
      id: user.id,
      email: user.email,
      kycStatus: user.kycStatus
    };

    next();
  } catch (error) {
    res.status(401).json({
      error: 'Invalid authentication token'
    });
  }
};

module.exports = auth;