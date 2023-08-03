// Import necessary dependencies and modules
const loyaltyProgramQueryController = require('../../controllers/loyaltyProgramQueryController');
const loyaltyProgramQueryModel = require('../../models/loyaltyProgramQueryModel');
const currencyRateModel = require('../../models/currencyRateModel');
const CurrencyRateModel = require('../../models/currencyRateModel');



//Mock models 
jest.mock('../../models/loyaltyProgramQueryModel', () => ({
  find: jest.fn(),
  deleteMany: jest.fn(),
  create: jest.fn().mockResolvedValue([]), // Mock implementation with an empty array

}));

jest.mock('../../models/currencyRateModel', () => ({
  find: jest.fn(),
  deleteMany: jest.fn(),
  create: jest.fn()
}));

describe('LoyaltyProgramQueryController', () => {

  let controller;

  // Controller instance
  beforeEach(() => {
    controller = loyaltyProgramQueryController;
  });

  // Clear all mock data after each test
  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('GetLoyaltyPrograms function', () => {
      test('should return 200 when valid partner code is provided', async () => {

        // Mock find method 
        const findMock = jest.fn().mockResolvedValue([]);
        loyaltyProgramQueryModel.find = findMock;
        // Mock findOne method 
        const findOneMock = jest.fn().mockResolvedValue({ currencyRates: [] });
        currencyRateModel.findOne = findOneMock;
  
        // Create a mock response object
        const response = {
          status: jest.fn().mockReturnThis(),
          json: jest.fn(),
        };
  
        // Simulate a GET request to the endpoint
        const partnerCode = 'DBSSG';
        const mockRequest = { params: { partnerCode } };
        await controller.getLoyaltyPrograms(mockRequest, response);
  
        // Assertions
        expect(loyaltyProgramQueryModel.find).toHaveBeenCalledTimes(1); // Ensure fetchLoyaltyPrograms is called
        expect(currencyRateModel.findOne).toHaveBeenCalledTimes(1); // Ensure fetchCurrencyRates is called
        expect(response.status).toHaveBeenCalledWith(200); // Ensure response status is 200
      });
  
      test('should return 500 when there is an error in fetching loyalty programs', async () => {
        // Mock findOne method 
        const findOneMock = jest.fn().mockResolvedValue({ currencyRates: [] });
        currencyRateModel.findOne = findOneMock;
  

        // Mock find method to throw an error
        const errorMessage = 'Database connection error';
        const mock_find_Error = jest.fn().mockRejectedValue(new Error(errorMessage));
        loyaltyProgramQueryModel.find = mock_find_Error;
      
      
        // Create a mock response object
        const response = {
          status: jest.fn().mockReturnThis(),
          json: jest.fn(),
        };
      
        // Simulate a GET request to the endpoint
        const partnerCode = 'DBSG';
        const mockRequest = { params: { partnerCode } };
        await controller.getLoyaltyPrograms(mockRequest, response);
      
        // Assertions
        expect(loyaltyProgramQueryModel.find).toHaveBeenCalledTimes(1);
        expect(currencyRateModel.findOne).toHaveBeenCalledTimes(0);
        expect(response.status).toHaveBeenCalledWith(500);
        expect(response.json).toHaveBeenCalledWith({ message: errorMessage });
      });
    


describe('fetchLoyaltyProgramsWithRates function', () => {
  test('should map currencyRates to loyaltyPrograms correctly', async () => {
    // Mock loyalty programs and currency rates
    const mockLoyaltyPrograms = [
      { programId: 'GOPOINTS', currencyRate: 0 }, 
      { programId: 'ASIAMILES', currencyRate: 0 }, 
    ];

    const mockCurrencyRates = {
      partnerCode: 'DBSSG',
      currencyRates: [
        { programId: 'GOPOINTS', currencyRate: 1.1 },
        { programId: 'ASIAMILES', currencyRate: 1 },
      ],
    };

    // Set up mock data for fetchLoyaltyPrograms and fetchCurrencyRates
    loyaltyProgramQueryModel.find.mockResolvedValue(mockLoyaltyPrograms);
    currencyRateModel.findOne.mockResolvedValue(mockCurrencyRates);

    // Call the function
    const loyaltyProgramsWithRates = await controller.fetchLoyaltyProgramsWithRates('DBSSG');

    // Check the result
    expect(loyaltyProgramsWithRates).toEqual([
      { programId: 'GOPOINTS', currencyRate: 1.1 },
      { programId: 'ASIAMILES', currencyRate: 1 },
    ]);
  });

  test('should handle missing currencyRate in currencyRates', async () => {
    // Mock loyalty programs and currency rates
    const mockLoyaltyPrograms = [
      { programId: 'GOPOINTS', currencyRate: 0 }, 
      { programId: 'ASIAMILES', currencyRate: 0 }, 
    ];
    const mockCurrencyRates = {
      partnerCode: 'DBSSG',
      currencyRates: [
        { programId: 'GOPOINTS' }, // Missing currencyRate 
        { programId: 'ASIAMILES', currencyRate: 1 },
      ],
    };

    // Set up mock data for fetchLoyaltyPrograms and fetchCurrencyRates
    loyaltyProgramQueryModel.find.mockResolvedValue(mockLoyaltyPrograms);
    currencyRateModel.findOne.mockResolvedValue(mockCurrencyRates);

    // Call the function
    const loyaltyProgramsWithRates = await controller.fetchLoyaltyProgramsWithRates('DBSSG');

    // Check the result
    expect(loyaltyProgramsWithRates).toEqual([
      { programId: 'GOPOINTS', currencyRate: undefined }, 
      { programId: 'ASIAMILES', currencyRate: 1 },
    ]);
  });
  describe('fetchCurrencyRates function', () => {
    test('should return mock currency rates for a valid partnerCode', async () => {
      // Mock data
      const mockPartnerCode = 'DBSSG';
      const mockCurrencyRates = {
        partnerCode: mockPartnerCode,
        currencyRates: [
          { programId: 'GOPOINTS', currencyRate: 1.1 },
          { programId: 'ASIAMILES', currencyRate: 1 },
        ],
      };

      // Mock the CurrencyRateModel to return the mock currency rates
      CurrencyRateModel.findOne = jest.fn().mockResolvedValue(mockCurrencyRates);

      // Call the fetchCurrencyRates method
      const result = await controller.fetchCurrencyRates(mockPartnerCode);

      // Assertions
      expect(result).toEqual(mockCurrencyRates);
      expect(CurrencyRateModel.findOne).toHaveBeenCalledTimes(1);
      expect(CurrencyRateModel.findOne).toHaveBeenCalledWith({ partnerCode: mockPartnerCode });
    });
  });

});
});
});