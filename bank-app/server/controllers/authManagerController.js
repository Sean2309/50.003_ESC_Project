const UserCredentials = require('../models/userCredentials');
const UserProfile = require('../models/userProfile');
const jwt = require("jsonwebtoken");

class AuthManagerController {
  constructor() {
    this.createUser();
  }

  // Handle the POST request to authenticate a user
  userAuthentication = async (request, response) => {
    try {
      const { loginId, password } = request.body;
  
      // Find the user by loginId
      const user = await UserCredentials.findOne({ loginId: loginId });
  
      if (user) {
        const isMatch = await user.comparePassword(password);
  
        if (isMatch) {
          // If the email and password are correct, create a JWT token
          // Secrete Key saved in .env file
          const mysecretkey = process.env.SECRET_CODE;

          // Payload to generate JWT
          const payload = {
            fullName: user.fullName,
            email: user.email,
            password: user.password,
          };
          // Create a jsonwebtoken that expires in 5 days
          const token = jwt.sign(payload, mysecretkey, { expiresIn: '5d' });
          // Send the token back to the client
          response.status(200).json({
            msg: "User is logged in",
            token: token
          });
          
        } else {
          response.json("The password is incorrect");
        }
      } else {
        response.json("User not found");
      }
    } catch (error) {
      console.error(error);
      response.status(500).json({ message: 'Server error' });
    }
  }

  
  // createUser for easy debug and call it during instantiation
  createUser = async (request, response) => {
    await UserCredentials.deleteMany({});
    await UserProfile.deleteMany({});

    const userCredentials = new UserCredentials({
      loginId: 'john123',
      password: 'password',
      userId: '1'
    });

    await userCredentials.save();

    const userProfile = new UserProfile({
      firstName: 'John',
      lastName: 'Yeet',
      abcPoints: 10000,
      emailAddress: 'johnyeet@gmail.com',
      phoneNumber: '88889912',
      userId: userCredentials.userId
    });
    
    await userProfile.save();
  }
}

const authManagerController = new AuthManagerController();

module.exports = authManagerController;
