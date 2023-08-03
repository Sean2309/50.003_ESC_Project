const jwt = require('jsonwebtoken');
const userProfileController = require('../../controllers/userProfileController');
const { SECRET_CODE } = require('../../utils/config');
const UserProfile = require('../../models/userProfile');

describe('authenticateToken middleware', () => {
  it('should pass authentication and call the next middleware if a valid token is provided', () => {
    const mockRequest = {
      cookies: {
        token: jwt.sign({ userId: 'testUser' }, SECRET_CODE),
      },
      body: {}
    };
    const mockResponse = {};
    const mockNext = jest.fn();

    userProfileController.authenticateToken(mockRequest, mockResponse, mockNext);

    expect(mockNext).toHaveBeenCalled();
    expect(mockRequest.body.userId).toEqual('testUser');
  });

  it('should return 403 if no token is provided', () => {
    const mockRequest = {
      cookies: {},
    };
    const mockResponse = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
    const mockNext = jest.fn();

    userProfileController.authenticateToken(mockRequest, mockResponse, mockNext);

    expect(mockResponse.status).toHaveBeenCalledWith(403);
    expect(mockResponse.json).toHaveBeenCalledWith({ msg: 'No token, authorization denied' });
    expect(mockNext).not.toHaveBeenCalled();
  });

  it('should return 401 if an invalid token is provided', () => {
    const mockRequest = {
      cookies: {
        token: 'invalid-token',
      },
    };
    const mockResponse = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
    const mockNext = jest.fn();

    userProfileController.authenticateToken(mockRequest, mockResponse, mockNext);

    expect(mockResponse.status).toHaveBeenCalledWith(401);
    expect(mockResponse.json).toHaveBeenCalledWith({ msg: 'Token is not valid' });
    expect(mockNext).not.toHaveBeenCalled();
  });
});

describe('get User Profile', () => {
  describe('getUserProfile', () => {
    it('should return user profile if user exists', async () => {
      // Arrange
      const mockUserProfile = { firstName: 'Test', lastName: 'User' };
      
      jest.spyOn(UserProfile, 'findOne').mockResolvedValue(mockUserProfile);

      const mockRequest = {
        body: { userId: 'test' },
      };
      const mockResponse = {
        json: jest.fn(),
        status: jest.fn(() => mockResponse),
      };

      // Act
      await userProfileController.getUserProfile(mockRequest, mockResponse);

      // Assert
      expect(UserProfile.findOne).toHaveBeenCalledWith({ userId: 'test' });
      expect(mockResponse.json).toHaveBeenCalledWith(mockUserProfile);
    });

    it('should return 404 if user does not exist', async () => {
      // Arrange
      jest.spyOn(UserProfile, 'findOne').mockResolvedValue(null);

      const mockRequest = {
        body: { userId: 'nonexistent' },
      };
      const mockResponse = {
        json: jest.fn(),
        status: jest.fn(() => mockResponse),
      };

      // Act
      await userProfileController.getUserProfile(mockRequest, mockResponse);

      // Assert
      expect(UserProfile.findOne).toHaveBeenCalledWith({ userId: 'nonexistent' });
      expect(mockResponse.status).toHaveBeenCalledWith(404);
      expect(mockResponse.json).toHaveBeenCalledWith({ message: 'User not found.' });
    });

    it('should return 500 if an error occurs', async () => {
      // Arrange
      UserProfile.findOne.mockRejectedValue(new Error('Test error'));
      const mockRequest = {
        query: { id: 'test' },
      };
      const mockResponse = {
        json: jest.fn(),
        status: jest.fn(() => mockResponse),
      };

      // Act
      await userProfileController.getUserProfile(mockRequest, mockResponse);

      // Assert
      expect(UserProfile.findOne).toHaveBeenCalledWith({ userId: 'test' });
      expect(mockResponse.status).toHaveBeenCalledWith(500);
      expect(mockResponse.json).toHaveBeenCalledWith({ message: 'Server error' });
    });
  });
});

