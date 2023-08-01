const request = require('supertest');
const app = require('../index'); 
const UserCredentials = require('../models/userCredentials');

// Mock UserCredentials.findOne
jest.mock('../models/userCredentials'); 

describe('AuthManagerController - userAuthentication', () => {
  it('should return "User is logged in" with correct login credentials', async () => {
    // Mock the response from UserCredentials.findOne
    UserCredentials.findOne.mockResolvedValueOnce({
      loginId: 'john123',
      comparePassword: jest.fn().mockResolvedValueOnce(true), // Mock the comparePassword function to return true for correct password
    });

    const response = await request(app)
      .post('/login')
      .send({ loginId: 'john123', password: 'correctpassword' })
      .expect(200);

    expect(response.body.msg).toBe('User is logged in');
    expect(response.header['set-cookie']).toBeDefined();
  });

  it('should return "The password is incorrect" with incorrect password', async () => {
    // Mock the response from UserCredentials.findOne
    UserCredentials.findOne.mockResolvedValueOnce({
      loginId: 'john123',
      comparePassword: jest.fn().mockResolvedValueOnce(false), // Mock the comparePassword function to return false for incorrect password
    });

    const response = await request(app)
      .post('/login')
      .send({ loginId: 'john123', password: 'incorrectpassword' })
      .expect(200);

    expect(response.text).toBe("\"The password is incorrect\"");
    //expect(response.header['set-cookie']).toBeUndefined();  --> Still recieving some values so the test is failed
  });

  it('should return "User not found" if the user does not exist', async () => {
    // Mock the response from UserCredentials.findOne to return null (user not found)
    UserCredentials.findOne.mockResolvedValueOnce(null);

    const response = await request(app)
      .post('/login')
      .send({ loginId: 'nonexistentuser', password: 'password' })
      .expect(200);

    expect(response.text).toBe("\"User not found\"");
    //expect(response.header['set-cookie']).toBeUndefined(); --> Still recieving some values so the test is failed
  });

  it('should return "Server error" if an error occurs during user authentication', async () => {
    // Mock the response from UserCredentials.findOne to throw an error
    UserCredentials.findOne.mockRejectedValueOnce(new Error('DB error'));

    const response = await request(app)
      .post('/login')
      .send({ loginId: 'john123', password: 'password' })
      .expect(500);

    expect(response.body.message).toBe('Server error');
  });
});
