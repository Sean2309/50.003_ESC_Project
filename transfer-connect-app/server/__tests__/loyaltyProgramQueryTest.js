// Import necessary dependencies and modules
const loyaltyProgramQueryController = require('../controllers/loyaltyProgramQueryController');
const loyaltyProgramQueryModel = require('../models/loyaltyProgramQueryModel');
const currencyRateModel = require('../models/currencyRateModel');


// =========== Setting up Mock models ==========// 
/* 
  Mock loyaltyProgramQueryModel 
  jest.mock() takes in 2 arguments. The path and a function that returns an object representing mocked implementation of the module
  find:jest.fn() Find a new Jest mock function created by jest.fn(). jest.fn() simulates the behaviour of the original find function  from the module
*/
jest.mock('../models/loyaltyProgramQueryModel', () => ({
  find: jest.fn(),
}));

jest.mock('../models/currencyRateModel', () => ({
  find: jest.fn(),
}));

// =========== Test Suite and Cases ======== //

describe('LoyaltyProgramQueryController', () => {

  // Create a new instance of the LoyaltyProgramQueryController before each test
  beforeEach(() => {
    controller = new loyaltyProgramQueryController();
  });

  // Clear all mock data after each test
  afterEach(() => {
    jest.clearAllMocks();
  });



  /*
  Unit Test: 
  Integration test: Correct data returned from db  
  */


  // ====== Unit Test ====== // 
  describe ('Unit Tests', () => {
    test ('1. Call loyaltyProgramQuery Model in json format', async() => {
       // Mocking the data returned by the find method
       const loyaltyProgramsPromise = Promise.resolve([
        {
          programID: 'GOPOINTS',
          programName: 'GoJet Points',
          currencyName: 'GoPoints',
          processingTime: 'Instant',
          description: 'YOL',
          enrollmentLink: 'https://www.gojet.com/member/',
          tncLink: 'https://www.gojet.com/aa/about-us/en/gb/terms-and-conditions.html',
          membershipFormat: '9digits1letter',
        },

        
      ]);

      // Mock the implementation of the find method
      loyaltyProgramQueryModel.find.mockReturnValue(loyaltyProgramsPromise);

      /* 
        Create mock request and response objects
        jest.fn(): A jest mock function that sets a 'fake'/'mock'response code
        mockReturnThis(): A method that makes the mock function chainable 
          In JS, chaining refers to the technique of calling multiple methods on an object in a single chain, 
          without the need to store intermediate results in variables. 
          Each method in the chain operates on the object returned by the previous method.
            Eg: response.status(200).json({ message: 'Success' }); is a chainable mock function
      */
      const request = {};
      const response = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(), // simulate sending a JSON response
      };

      // Call the method to be tested
      await controller.getLoyaltyPrograms(request, response, 'BankApp');

      expect(loyaltyProgramQueryModel.find).toHaveBeenCalledTimes(1);
      expect(response.json).toHaveBeenCalled();
    });

  test ('2. Call currencyRateModel in json format', async() => {
    // Mocking the data returned by the find method
    const currencyRatesPromise = Promise.resolve([
     {
      appName: 'BankApp',
      programID: 'GOPOINTS,KRISFLYER',
      currencyRate: '1.0,1.5',
     },
   ]);

   currencyRateModel.find.mockReturnValue(currencyRatesPromise);
   const request = {};
   const response = {
     status: jest.fn().mockReturnThis(),
     json: jest.fn(), 
   };

   await controller.getLoyaltyPrograms(request, response, 'BankApp');
   expect(currencyRateModel.find).toHaveBeenCalledTimes(1);
   expect(response.json).toHaveBeenCalled();
   } )

   test ('3. Output of getLoyaltyPrograms() in Serialized json format', async() => {

    const loyaltyProgramsPromise = Promise.resolve([
      {
        programID: 'GOPOINTS',
        programName: 'GoJet Points',
        currencyName: 'GoPoints',
        processingTime: 'Instant',
        description: 'YOL',
        enrollmentLink: 'https://www.gojet.com/member/',
        tncLink: 'https://www.gojet.com/aa/about-us/en/gb/terms-and-conditions.html',
        membershipFormat: '9digits1letter',
      },
    ]);

    const currencyRatesPromise = Promise.resolve([
     {
      appName: 'BankApp',
      programID: 'GOPOINTS,KRISFLYER',
      currencyRate: '1.0,1.5',
     },
   ]);

   loyaltyProgramQueryModel.find.mockReturnValue(loyaltyProgramsPromise); 
   currencyRateModel.find.mockReturnValue(currencyRatesPromise);
   const request = {};
   const response = {
     status: jest.fn().mockReturnThis(),
     json: jest.fn(), 
   };

   await controller.getLoyaltyPrograms(request, response, 'BankApp');

   // Assert the response data
   const responseData = response.json.mock.calls[0][0];
   expect(responseData).toHaveLength(1);

   expect(responseData[0]).toEqual({
     programID: 'GOPOINTS',
     programName: 'GoJet Points',
     currencyName: 'GoPoints',
     processingTime: 'Instant',
     description: 'YOL',
     enrollmentLink: 'https://www.gojet.com/member/',
     tncLink: 'https://www.gojet.com/aa/about-us/en/gb/terms-and-conditions.html',
     membershipFormat: '9digits1letter',
     currencyRate: 1.0,
     });
    })


  
})
  // ======Integration  Test ===== // 
  describe('Integration Tests', () => {
    test('return serialized JSON file with loyalty program details', async () => {

      // Mock the data returned by the find methods
      const loyaltyProgramsPromise = Promise.resolve([
        {
          programID: 'GOPOINTS',
          programName: 'GoJet Points',
          currencyName: 'GoPoints',
          processingTime: 'Instant',
          description: 'YOL',
          enrollmentLink: 'https://www.gojet.com/member/',
          tncLink: 'https://www.gojet.com/aa/about-us/en/gb/terms-and-conditions.html',
          membershipFormat: '9digits1letter',
        },
      ]);

      const currencyRatesPromise = Promise.resolve([
        {
          appName: 'BankApp',
          programID: 'GOPOINTS,KRISFLYER',
          currencyRate: '1.0,1.5',
        },
      ]);

      // Mock the implementation of the find methods
      loyaltyProgramQueryModel.find.mockReturnValue(loyaltyProgramsPromise);
      currencyRateModel.find.mockReturnValue(currencyRatesPromise);

      // Create mock request and response objects
      const request = {};
      const response = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };

      // Call the method to be tested
      await controller.getLoyaltyPrograms(request, response, 'BankApp');

      // Assert that the necessary methods have been called
      expect(loyaltyProgramQueryModel.find).toHaveBeenCalledTimes(1);
      expect(currencyRateModel.find).toHaveBeenCalledTimes(1);
      expect(response.status).toHaveBeenCalledWith(200);
      expect(response.json).toHaveBeenCalled();

      // Assert the response data
      const responseData = response.json.mock.calls[0][0];
      expect(responseData).toHaveLength(1);
      expect(responseData[0]).toEqual({
        programID: 'GOPOINTS',
        programName: 'GoJet Points',
        currencyName: 'GoPoints',
        processingTime: 'Instant',
        description: 'YOL',
        enrollmentLink: 'https://www.gojet.com/member/',
        tncLink: 'https://www.gojet.com/aa/about-us/en/gb/terms-and-conditions.html',
        membershipFormat: '9digits1letter',
        currencyRate: 1.0,
      });
    });

    test('should return an error response when an exception occurs', async () => {
      
      // Mock the find methods to throw an error
      loyaltyProgramQueryModel.find.mockRejectedValue(new Error('Database error'));

      // Create mock request and response objects
      const request = {};
      const response = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };

      // Call the method to be tested
      await controller.getLoyaltyPrograms(request, response, 'BankApp');

      // Assert that the necessary methods have been called
      expect(loyaltyProgramQueryModel.find).toHaveBeenCalledTimes(1);
      expect(response.status).toHaveBeenCalledWith(500);
      expect(response.json).toHaveBeenCalledWith({ message: 'Database error' });
    });
  });
});
