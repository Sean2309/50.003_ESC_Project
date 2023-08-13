// Import necessary modules
const mongoose = require('mongoose');
const UserCredentials = require('../../models/userCredentials');
const config = require('../../utils/config');

// Test suite for the UserCredentials Model
describe('UserCredentials Model Test', () => {
    let savedUser;  // Variable to store the saved user during tests
  
    // Before all tests, establish a connection to the MongoDB database
    beforeAll(async () => {
        mongoose.connect(config.MONGODB_URL)
          .then((res) => console.log('connected'))
          .catch((err) => console.error('error'));
    });
  
    // Before each test, create and save a new user in the database
    beforeEach(async () => {
      const userCredentials = new UserCredentials({
        loginId: 'test',
        password: 'password',
        userId: '1',
      });
  
      savedUser = await userCredentials.save();
    });
  
    // Test to ensure the user's password is hashed before saving in the database
    it('should hash user password before saving to database', async () => {
      expect(savedUser.password).not.toBe('password');
    });
  
    // Test to ensure the hashed password can be correctly compared with a plain text password
    it('should compare hashed password with a plain text password', async () => {
      const result = await savedUser.comparePassword('password');
      expect(result).toBe(true);
    });
  
    // After each test, delete all users to ensure a clean state for the next test
    afterEach(async () => {
      await UserCredentials.deleteMany({});
    });
  
    // After all tests, close the database connection
    afterAll(async () => {
      await mongoose.connection.close();
    });
  });
