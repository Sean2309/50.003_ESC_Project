const UserProfile = require('../models/userProfile');
const { SECRET_CODE } = require('../utils/config');
const crypto = require('crypto');
const jwt = require('jsonwebtoken');

class UserProfileController {
  authenticateToken(request, response, next) {
    // Get token from cookies
    const { token } = request.cookies;

    // Check if no token
    if (!token) {
      return response.status(403).json({ msg: 'No token, authorization denied' });
    }

    // Verify token
    try {
      const decoded = jwt.verify(token, SECRET_CODE);
      request.user = decoded.user;
      next();
    } catch (err) {
      response.status(401).json({ msg: 'Token is not valid' });
    }
  }
  // This function operates on the assumption that the token is authed
  getUserProfile = async (request, response) => {
    try {
      const userId = request.query.id;
  
      const userProfile = await UserProfile.findOne({ userId: userId });
  
      if (!userProfile) {
        return response.status(404).json({ message: 'User not found.' });
      }
  
      response.json(userProfile);
    } catch (error) {
      console.error('Error fetching user profile:', error);
      response.status(500).json({ message: 'Server error' });
    }
  };
}

const userProfileController = new UserProfileController();

module.exports = userProfileController;
