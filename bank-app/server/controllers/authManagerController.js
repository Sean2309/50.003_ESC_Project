const jwt = require('jsonwebtoken');
const UserCredentials = require('../models/userCredentials');
const UserProfile = require('../models/userProfile');
const { generateWebSocketId } = require('../controllers/notificationSendingController');
const { SECRET_CODE } = require('../utils/config');

class AuthManagerController {
  constructor() {
  }

  // Handle the POST request to authenticate a user
  userAuthentication = async (request, response) => {
    try {
      const { loginId, password } = request.body;

      // Find the user by loginId
      const user = await UserCredentials.findOne({ loginId });

      if (user) {
        const isMatch = await user.comparePassword(password);

        if (isMatch) {
          // If the email and password are correct, create a JWT token
          // Secrete Key saved in .env file
          const mysecretkey = SECRET_CODE;

          // Payload to generate JWT
          const payload = {
            userId: user.userId,
          };
          // Create a jsonwebtoken that expires in 5 days
          const token = jwt.sign(payload, mysecretkey, { expiresIn: '5d' });

          // Store into cookie
          response.cookie('token', token, { httpOnly: true });

          response.status(200).json({
            msg: 'User is logged in',
          });
        } else {
          response.clearCookie('token');
          response.json('The password is incorrect');
        }
      } else {
        response.clearCookie('token');
        response.json('User not found');
      }
    } catch (error) {
      response.status(500).json({ message: 'Server error' });
    }
  };

  // Retrieve token set in cookies and verify, if verified, set auth to true
  userAuthorization = async (request, response) => {
    const { token } = request.cookies;
    //console.log("Auth: ",token)

    try {
      const decoded = jwt.verify(token, SECRET_CODE);

      // if token is verified, then set auth to true
      
      // id for notif system. 
      //TODO: we need to protect this somehow
      response.status(200).json({ message: 'Authorized', auth: true, id: decoded.userId});
    } catch (error) {
      response.status(401).json({ message: 'Authorization error', auth: false });
    }
  };

  // createUser for easy debug and call it during instantiation
  createUser = async () => {
    await UserCredentials.deleteMany({});
    await UserProfile.deleteMany({});

    const userCredentials = new UserCredentials({
      loginId: 'john123',
      password: 'password',
      userId: '1',
    });

    await userCredentials.save();

    const userProfile = new UserProfile({
      firstName: 'John',
      lastName: 'Yeet',
      abcPoints: 10000,
      emailAddress: 'johnyeet@gmail.com',
      phoneNumber: '88889912',
      notificationMethod: '1',
      userId: userCredentials.userId,
    });

    await userProfile.save();
  };
}

const authManagerController = new AuthManagerController();

module.exports = authManagerController;
