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
      request.body.userId = decoded.userId;
      next();
    } catch (err) {
      response.status(401).json({ msg: 'Token is not valid' });
    }
  }
  // This function operates on the assumption that the token is authed
  getUserProfile = async (request, response) => {
    try {
      const userId = request.body.userId;

      const userProfile = await UserProfile.findOne({ userId: userId });

      if (!userProfile) {
        return response.status(404).json({ message: 'User not found.' });
      }

      response.json(userProfile);
    } catch (error) {
      response.status(500).json({ message: 'Server error' });
    }
  };

  updateSuccessfulTransaction = async (request, response) => {
    const { userId, transferAmount } = request.body;

    // First, find the amount of points the user has
    try {
      const userProfile = await UserProfile.findOne({ userId: userId });
      userProfile.abcPoints -= transferAmount;
      await userProfile.save();
      response.status(201).json(request.body);
    }
    catch (error) {
      throw error;
    }
  }
}

const userProfileController = new UserProfileController();

module.exports = userProfileController;
