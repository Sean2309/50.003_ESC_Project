//import shet
const loyaltyProgramsController = require('../controllers/loyaltyProgramsController');
const loyaltyProgramsModel = require('../models/loyaltyPrograms');

// =========== Setting up Mock models ==========// 
/* 
  Mock loyaltyProgramQueryModel 
  jest.mock() takes in 2 arguments. The path and a function that returns an object representing mocked implementation of the module
  find:jest.fn() Find a new Jest mock function created by jest.fn(). jest.fn() simulates the behaviour of the original find function  from the module
*/
jest.mock('../models/loyaltyPrograms', () => ({
  find: jest.fn(),
}));

// =========== Test Suite and Cases ======== //
describe('LoyaltyProgramsController', () => {

  let controller; 

  // Create a new instance of the LoyaltyProgramQueryController before each test
  beforeEach(() => {
    controller = loyaltyProgramsController;
  });

  // Clear all mock data after each test
  afterEach(() => {
    jest.clearAllMocks();
  });
    // ====== Unit Test ====== // 
  describe ('Unit Tests', () => {

    test ('1. Get Loyalty Program Data in JSON Format', async() => {
       // Mocking the data returned by the find method
       const loyaltyProgramsPromise = Promise.resolve([
        {
        programId: "GOPOINTS",
        programName: "GoJet Points",
        currencyName: "GoPoints",
        processingTime: "Instant",
        description: "Feel free to adjust this",
        enrollmentLink: "https://www.gojet.com/member/",
        tncLink: "https://www.gojet.com/aa/about-us/en/gb/terms-and-conditions.html",
        membershipFormat: "^\\d{9}[a-zA-Z]$",
        },

        
      ]);

      // Mock the implementation of the find method
      loyaltyProgramsModel.find.mockReturnValue(loyaltyProgramsPromise);

      /* 
        Create mock request and response objects
        jest.fn(): A jest mock function that sets a 'fake'/'mock'response code
        mockReturnThis(): A method that makes the mock function chainable 
          In JS, chaining refers to the technique of calling multiple methods on an object in a single chain, 
          without the need to store intermediate results in variables. 
          Each method in the chain operates on the object returned by the previous method.
            Eg: response.status(200).json({ message: 'Success' }); is a chainable mock function
      */
      const partnerCode = 'DBSSG';
      const request = { params: { partnerCode },};
      const response = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(), // simulate sending a JSON response
      };

      // Call the method to be tested
      await controller.getLoyaltyPrograms(request, response);

      expect(loyaltyProgramsModel.find).toHaveBeenCalledTimes(1);
      expect(response.json).toHaveBeenCalled();
    });



  });
});