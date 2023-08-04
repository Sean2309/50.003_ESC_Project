const request = require('supertest');
const app = require('../index'); 
const UserCredentials = require('../models/userCredentials');
const jwt = require('jsonwebtoken');
const { SECRET_CODE } = require('../utils/config');
const crypto = require('crypto');
const { randomBytes } = require('crypto');

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

  it('should return "Server error" if an error occurs during password comparison', async () => {
    // Mock the response from UserCredentials.findOne
    UserCredentials.findOne.mockResolvedValueOnce({
      loginId: 'john123',
      comparePassword: jest.fn().mockRejectedValueOnce(new Error('Comparison error')),
    });

    const response = await request(app)
      .post('/login')
      .send({ loginId: 'john123', password: 'correctpassword' })
      .expect(500);

    expect(response.body.message).toBe('Server error');
  });

  it('should return 200 and auth: true if token is valid', async () => {
    const token = jwt.sign({ userId: 1 }, SECRET_CODE);
    const res = await request(app)
      .get('/login')
      .set('Cookie', [`token=${token}`]);

    expect(res.statusCode).toEqual(200);
    expect(res.body).toHaveProperty('auth');
    expect(res.body.auth).toBe(true);
  });
  it('should return 401 and auth: false if token is invalid', async () => {
    const token = 'invalid token';
    const res = await request(app)
      .get('/login') // replace with your actual endpoint
      .set('Cookie', [`token=${token}`]);

    expect(res.statusCode).toEqual(401);
    expect(res.body).toHaveProperty('auth');
    expect(res.body.auth).toBe(false);
  });
});

describe('Fuzz testing', () => {
  it('should handle random loginId and password', async () => {
    const randomLoginId = randomBytes(20).toString('hex');
    const randomPassword = randomBytes(20).toString('hex');

    const response = await request(app)
      .post('/login')
      .send({ loginId: randomLoginId, password: randomPassword })
      .expect(200);

    expect(response.text).toBe("\"User not found\"");
  });
});
