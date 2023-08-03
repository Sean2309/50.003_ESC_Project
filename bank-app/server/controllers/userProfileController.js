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
      return response.status(401).json({ msg: 'No token, authorization denied' });
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

    const encryptedUserId = request.query.id;

    // Note: Will only work if the userId is ecrypted using the same algorithm
    // Decrypt the userId
    const decipher = crypto.createDecipher('aes256', 'a password'); // replace 'aes256' and 'a password' with your actual algorithm and password
    let decrypted = decipher.update(encryptedUserId, 'hex', 'utf8');
    decrypted += decipher.final('utf8');

    const userId = decrypted;

    const userProfile = await UserProfile.findOne({ userId });

    response.json(userProfile);
  };
}

const userProfileController = new UserProfileController();

module.exports = userProfileController;
