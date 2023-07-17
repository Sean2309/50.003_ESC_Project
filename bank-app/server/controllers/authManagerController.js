const UserCredentials = require('../models/userCredentials');
const UserProfile = require('../models/userProfile');

class AuthManagerController {
  constructor() {
    //this.createUser();
  }

  // Handle the POST request to authenticate a user
  userAuthentication = async (request, response) => {
    try {
      const { loginId, password } = request.body;

      // Find the user by email
      // TODO: Implement security features, e.g. hash password
      UserCredentials.findOne({ loginId: loginId })
        .then(user => {
          if (user) {
            if (user.password == password) {
              response.json("Success")
            } else {
              response.json("The password is incorrect")
            }
          } else {
            response.json("User not found")
          }
        })
    } catch (error) {
      console.error(error);
      response.status(500).json({ message: 'Server error' });
    }
  }

  /*
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
  }*/
}

const authManagerController = new AuthManagerController();

module.exports = authManagerController;
