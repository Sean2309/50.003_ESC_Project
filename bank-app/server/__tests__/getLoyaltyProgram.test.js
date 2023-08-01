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

      const response = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(), // simulate sending a JSON response
      };

      // Call the method to be tested
      await controller.getLoyaltyPrograms({}, response);

      expect(loyaltyProgramsModel.find).toHaveBeenCalledTimes(1);
      expect(response.json).toHaveBeenCalled();
    });



  });
});