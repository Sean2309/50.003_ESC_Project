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

  let controller; 



  // Create a new instance of the LoyaltyProgramQueryController before each test
  beforeEach(() => {
    controller = loyaltyProgramQueryController;
  });

  // Clear all mock data after each test
  afterEach(() => {
    jest.clearAllMocks();
  });


  // ====== Unit Test ====== // 
  describe ('Unit Tests', () => {

  //   test ('4.4. Established Server database connection', async() => {
  //     const response = await request(app).get('/api/loyaltyprograms');
    
  //     // Assert that the necessary methods have been called
  //     expect(response.status).toHaveBeenCalledWith(200);
  //     expect(response.json).toHaveBeenCalled();
  // });

    test ('4.5. Loyalty Program Data in JSON Format', async() => {
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


      const partnerCode = 'DBSSG';
      const request = { params: { partnerCode },};
      const response = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(), // simulate sending a JSON response
      };

      // Call the method to be tested
      await controller.getLoyaltyPrograms(request, response);

      expect(loyaltyProgramQueryModel.find).toHaveBeenCalledTimes(1);
      expect(response.json).toHaveBeenCalled();
    });


  test ('4.6. CurrencyRate Data in JSON Format', async() => {
    // Mocking the data returned by the find method
    const currencyRatesPromise = Promise.resolve([
     {
      partnerCode: "DBSSG",
          currencyRates: [
            {
              programId: "GOPOINTS",
              currencyRate: 1.1
            },
            {
              programId: "ASIAMILES",
              currencyRate: 1
            }
          ]
     },
   ]);

 
   const partnerCode = 'DBSSG';  
    // Mock the implementation of the find method with the mock data
    currencyRateModel.findOne = jest.fn().mockResolvedValue({ partnerCode, ...currencyRatesPromise[0] });
 
   const request = { params: { partnerCode },};
   const response = {
     status: jest.fn().mockReturnThis(),
     json: jest.fn(), 
   };

   await controller.getLoyaltyPrograms(request, response);

   expect(currencyRateModel.findOne).toHaveBeenCalledTimes(1);
   expect(response.json).toHaveBeenCalled();
   });

  //  test ('4.7. Combined loyalty program and currency rate data format', async() => {

  //   const loyaltyProgramsPromise = Promise.resolve([
  //     {
  //       programId: "GOPOINTS",
  //       programName: "GoJet Points",
  //       currencyName: "GoPoints",
  //       processingTime: "Instant",
  //       description: "Feel free to adjust this",
  //       enrollmentLink: "https://www.gojet.com/member/",
  //       tncLink: "https://www.gojet.com/aa/about-us/en/gb/terms-and-conditions.html",
  //       membershipFormat: "^\\d{9}[a-zA-Z]$",
  //     },
  //   ]);

  //   const currencyRatesPromise = Promise.resolve([
  //     {
  //       partnerCode: "DBSSG",
  //           currencyRates: [
  //             {
  //               programId: "GOPOINTS",
  //               currencyRate: 1.1
  //             },
  //             {
  //               programId: "ASIAMILES",
  //               currencyRate: 1
  //             }
  //           ]
  //      },
  //  ]);



  //  const partnerCode = 'DBSSG';  

  //  loyaltyProgramQueryModel.find.mockReturnValue(loyaltyProgramsPromise); 
  //   currencyRateModel.findOne = jest.fn().mockResolvedValue({ partnerCode, ...currencyRatesPromise[0] });
 
  //  const request = { params: { partnerCode },};
  //  const response = {
  //    status: jest.fn().mockReturnThis(),
  //    json: jest.fn(), 
  //  };



  //  await controller.getLoyaltyPrograms(request, response);

  //  // Assert the response data
  //  const responseData = response.json.mock.calls[0][0];

  //  expect(responseData[0]).toEqual({
  //   programId: "GOPOINTS",
  //   programName: "GoJet Points",
  //   currencyName: "GoPoints",
  //   processingTime: "Instant",
  //   description: "Feel free to adjust this",
  //   enrollmentLink: "https://www.gojet.com/member/",
  //   tncLink: "https://www.gojet.com/aa/about-us/en/gb/terms-and-conditions.html",
  //   membershipFormat: "^\\d{9}[a-zA-Z]$",
  //   currencyRate: 1.0,
  //    });
  //   })


});
});