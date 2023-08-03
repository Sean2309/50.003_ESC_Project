//import shet
const { default: axios } = require('axios');
const loyaltyProgramsController = require('../../controllers/loyaltyProgramsController');
const loyaltyProgramsModel = require('../../models/loyaltyPrograms');
const cron = require('node-cron');
const { response } = require('express');
// =========== Setting up Mock models ==========// 
/* 
  Mock loyaltyProgramQueryModel 
  jest.mock() takes in 2 arguments. The path and a function that returns an object representing mocked implementation of the module
  find:jest.fn() Find a new Jest mock function created by jest.fn(). jest.fn() simulates the behaviour of the original find function  from the module
*/
jest.mock('../models/loyaltyPrograms', () => ({
  find: jest.fn(),
  deleteMany: jest.fn().mockResolvedValue({}),
  create: jest.fn().mockResolvedValue({}),
}));
jest.mock('axios');
// =========== Test Suite and Cases ======== //
describe('Test getLoyaltyPrograms function', () => {
  let controller; 
  beforeEach(() => {
    controller = loyaltyProgramsController;
    jest.useFakeTimers();
  });

  // Clear all mock data after each test
  afterEach(() => {
    jest.clearAllMocks();
    jest.runOnlyPendingTimers()
    jest.useRealTimers()
  });
    // ====== Unit Test ====== // 
    test ('1. getLoyaltyPrograms works', async() => {
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


    test ('2. loyalty programs are in json format', async() => {
      const loyaltyProgramsPromise =[
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
      ];
      loyaltyProgramsModel.find.mockReturnValue(loyaltyProgramsPromise);
      const response = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };
      await controller.getLoyaltyPrograms({}, response);
      expect(response.json).toHaveBeenCalledWith({ loyaltyPrograms: loyaltyProgramsPromise });

    });

    test ('3. updateloyaltyprograms should fetch data and update the db', async() => {
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
      axios.get.mockResolvedValue({ data: loyaltyProgramsPromise, status: 200 });
      await controller.updateLoyaltyPrograms();
      expect(axios.get).toHaveBeenCalledWith('http://localhost:3003/api/loyaltyprograms/DBSSG');
      expect(loyaltyProgramsModel.deleteMany).toHaveBeenCalledTimes(1);
      expect(loyaltyProgramsModel.create).toHaveBeenCalledWith(loyaltyProgramsPromise);

    });


    test('4. updateLoyaltyPrograms should handle errors ', async () => {
      const errorMessage = 'API Error';
  
      // Mock axios.get to throw an error
      axios.get.mockRejectedValue(new Error(errorMessage));
  
      // Call the method to be tested
      await loyaltyProgramsController.updateLoyaltyPrograms();
  
      // Check if axios.get was called with the correct URL and partner code
      expect(axios.get).toHaveBeenCalledWith('http://localhost:3003/api/loyaltyprograms/DBSSG');
  
      // Check if deleteMany was not called since there was an error
      expect(loyaltyProgramsModel.deleteMany).not.toHaveBeenCalled();
  
      // Check if create was not called since there was an error
      expect(loyaltyProgramsModel.create).not.toHaveBeenCalled();
    });  

    test('5. populatedb works ', async () => {
      const mockLoyaltyPrograms = [
        {
          programId: 'GOPOINTS',
          programName: 'GoJet Points',
          currencyName: 'GoPoints',
          processingTime: 'Instant',
          description: 'Feel free to adjust this',
          enrollmentLink: 'https://www.gojet.com/member/',
          tncLink: 'https://www.gojet.com/aa/about-us/en/gb/terms-and-conditions.html',
          membershipFormat: '^\\d{9}[a-zA-Z]$',
          currencyRate: 1,
        },
        {
          programId: 'ASIAMILES',
          programName: 'Asia Miles',
          currencyName: 'Asia Miles',
          processingTime: 'Instant',
          description: 'Feel free to adjust this',
          enrollmentLink: 'https://www.cathaypacific.com/cx/en_HK/membership/sign-up.html',
          tncLink: 'https://www.cathaypacific.com/cx/en_HK/legal-and-privacy/data-privacy-and-security-policy.html',
          membershipFormat: '^\\d{11}$',
          currencyRate: 1.1,
        },
      ];

        await controller.populateDb();
        expect(loyaltyProgramsModel.deleteMany).toHaveBeenCalledTimes(1);
        expect(loyaltyProgramsModel.create).toHaveBeenCalledWith(mockLoyaltyPrograms);


    });
  });
