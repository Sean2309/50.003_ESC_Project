// Import necessary dependencies and modules
const loyaltyProgramQueryController = require('../../controllers/loyaltyProgramQueryController');
const loyaltyProgramQueryModel = require('../../models/loyaltyProgramQueryModel');
const currencyRateModel = require('../../models/currencyRateModel');
const CurrencyRateModel = require('../../models/currencyRateModel');


describe('LoyaltyProgramQueryController', () => {

  
  let controller;

  beforeEach(() => {
    // Controller instance
    controller = loyaltyProgramQueryController;
  });

  
  afterEach(() => {
    // Clear all mock data after each test
    jest.clearAllMocks();
  });

  describe('GetLoyaltyPrograms function', () => {
      test('should return 200 when valid partner code is provided', async () => {
        // Replace mongoose find method with mock loyalty program data 
        const findMock = jest.fn().mockResolvedValue([]);
        loyaltyProgramQueryModel.find = findMock;

        // Replace mongoose findOne method with mock currency rates data 
        const findOneMock = jest.fn().mockResolvedValue({ currencyRates: [] });
        currencyRateModel.findOne = findOneMock;
  
        // Mock response object
        const response = {
          status: jest.fn().mockReturnThis(),
          json: jest.fn(),
        };
  
        // Simulate GET request 
        const partnerCode = 'DBSSG';
        const mockRequest = { params: { partnerCode } };
        await controller.getLoyaltyPrograms(mockRequest, response);
  
        // Assertions
        expect(loyaltyProgramQueryModel.find).toHaveBeenCalledTimes(1); // Ensure fetchLoyaltyPrograms is called
        expect(currencyRateModel.findOne).toHaveBeenCalledTimes(1); // Ensure fetchCurrencyRates is called
        expect(response.status).toHaveBeenCalledWith(200); // Ensure response status is 200
      });
  
      test('should return 500 when there is an error in fetching loyalty programs', async () => {

        // Replace mongoose findOne method with mock currency rates data  
        const findOneMock = jest.fn().mockResolvedValue({ currencyRates: [] });
        currencyRateModel.findOne = findOneMock;
  

        // Replace mongoose find method with mock error message
        const errorMessage = 'Database connection error';
        const mock_find_Error = jest.fn().mockRejectedValue(new Error(errorMessage));
        loyaltyProgramQueryModel.find = mock_find_Error;
      
      
        // Mock response object
        const response = {
          status: jest.fn().mockReturnThis(),
          json: jest.fn(),
        };
      
        // Simulate GET request
        const partnerCode = 'Invalid';
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

    // Mock data 
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

    // Promise resolved with mock data when mongoose find() / findOne()  called
    loyaltyProgramQueryModel.find.mockResolvedValue(mockLoyaltyPrograms);
    currencyRateModel.findOne.mockResolvedValue(mockCurrencyRates);

    // Call the function
    const loyaltyProgramsWithRates = await controller.fetchLoyaltyProgramsWithRates('DBSSG');

    // Assertions
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

    // Promise resolved with mock data when mongoose find() / findOne()  called
    loyaltyProgramQueryModel.find.mockResolvedValue(mockLoyaltyPrograms);
    currencyRateModel.findOne.mockResolvedValue(mockCurrencyRates);

    // Call the function
    const loyaltyProgramsWithRates = await controller.fetchLoyaltyProgramsWithRates('DBSSG');

    // Assertions
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

      // Promise resolved with mock data when mongoose findOne()  called
      currencyRateModel.findOne = jest.fn().mockResolvedValue(mockCurrencyRates);

      // Call function
      const result = await controller.fetchCurrencyRates(mockPartnerCode);

      // Assertions
      expect(result).toEqual(mockCurrencyRates);
      expect(currencyRateModel.findOne).toHaveBeenCalledTimes(1);
      expect(currencyRateModel.findOne).toHaveBeenCalledWith({ partnerCode: mockPartnerCode });
    });
  });

});
});
});