const authManagerController = require('../controllers/authManagerController');
const userCredentials = require('../models/userCredentials');
const userProfile = require('../models/userProfile');
const authManagerRouter = require('express').Router();


jest.mock("../models/userCredentials", () => ({
    findOne: jest.fn(),
  }));

describe('userAuthentication', () => {
    afterEach(() => {
      jest.clearAllMocks();
    });
  
    test('should return "Success" when the user credentials are correct', async () => {
      const mockRequest = {
        body: {
          loginId: 'testuser',
          password: 'testpassword',
        },
      };
  
      const mockResponse = {
        json: jest.fn(),
      };
  
      // Mock the UserCredentials.findOne to return a user with matching credentials
      userCredentials.findOne.mockResolvedValueOnce({
        loginId: 'testuser',
        password: 'testpassword',
      });
  
      // Call the userAuthentication function
      await authManagerController.userAuthentication(mockRequest, mockResponse);
  
      // Assertions
      expect(mockResponse.json).toHaveBeenCalledWith('Success');
    });
  
    test('should return "The password is incorrect" when the user credentials are incorrect', async () => {
      const mockRequest = {
        body: {
          loginId: 'testuser',
          password: 'wrongpassword',
        },
      };
  
      const mockResponse = {
        json: jest.fn(),
      };
  
      // Mock the UserCredentials.findOne to return a user with matching loginId but incorrect password
      userCredentials.findOne.mockResolvedValueOnce({
        loginId: 'testuser',
        password: 'testpassword',
      });
  
      // Call the userAuthentication function
      await authManagerController.userAuthentication(mockRequest, mockResponse);
  
      // Assertions
      expect(mockResponse.json).toHaveBeenCalledWith('The password is incorrect');
    });
  
    test('should return "User not found" when the user is not found', async () => {
      const mockRequest = {
        body: {
          loginId: 'nonexistentuser',
          password: 'testpassword',
        },
      };
  
      const mockResponse = {
        json: jest.fn(),
      };
  
      // Mock the UserCredentials.findOne to return null (user not found)
      userCredentials.findOne.mockResolvedValueOnce(null);
  
      // Call the userAuthentication function
      await authManagerController.userAuthentication(mockRequest, mockResponse);
  
      // Assertions
      expect(mockResponse.json).toHaveBeenCalledWith('User not found');
    });
  });
  