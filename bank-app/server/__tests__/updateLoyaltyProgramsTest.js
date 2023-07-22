const axios = require('axios');
const loyaltyProgramsController = require('../controllers/loyaltyProgramsController');
const LoyaltyPrograms = require('../models/loyaltyPrograms');

// Mock Axios to simulate the HTTP GET request/response
jest.mock('axios');

// =========== Test Suite and Cases ======== //
describe('LoyaltyProgramsController', () => {
  // Other test suites and cases...

  // Test Suite for updateLoyaltyPrograms function
  describe('updateLoyaltyPrograms', () => {
    // Mocked response data from the HTTP GET request
    const mockedResponseData = [
      {
        programID: "GOPOINTS",
        programName: "GoJet Points",
        currencyName: "GoPoints",
        processingTime: "Instant",
        description: "Feel free to adjust this",
        enrollmentLink: "https://www.gojet.com/member/",
        tncLink: "https://www.gojet.com/aa/about-us/en/gb/terms-and-conditions.html",
        membershipFormat: "^\\d{9}[a-zA-Z]$",
        currencyRate: 1
        // Other properties...
      },
      // Add more mocked data if needed...
    ];

    // Mock the implementation of LoyaltyPrograms model methods
    LoyaltyPrograms.deleteMany = jest.fn().mockResolvedValue();
    LoyaltyPrograms.create = jest.fn().mockResolvedValue();

    test('Updates loyalty programs successfully', async () => {
      // Mock the Axios GET request with resolved Promise containing the mocked response data
      axios.get.mockResolvedValue({ data: mockedResponseData });

      // Call the updateLoyaltyPrograms function
      await loyaltyProgramsController.updateLoyaltyPrograms();

      // Assert that Axios.get is called with the correct URL
      expect(axios.get).toHaveBeenCalledWith('http://example.com/api/loyalty-programs');

      // Assert that LoyaltyPrograms.deleteMany is called
      expect(LoyaltyPrograms.deleteMany).toHaveBeenCalledTimes(1);

      // Assert that LoyaltyPrograms.create is called with the mocked response data
      expect(LoyaltyPrograms.create).toHaveBeenCalledWith(mockedResponseData);

      // Assert that getLoyaltyPrograms is called at least once
      // You may need to modify the getLoyaltyPrograms function to allow mocking its behavior for testing
      expect(loyaltyProgramsController.getLoyaltyPrograms).toHaveBeenCalled();
    });

    test('Handles errors during data update', async () => {
      // Mock the Axios GET request with rejected Promise containing an error
      const errorMessage = 'Failed to fetch data';
      axios.get.mockRejectedValue(new Error(errorMessage));

      // Mock console.error to suppress log output during the test
      console.error = jest.fn();

      // Call the updateLoyaltyPrograms function
      await loyaltyProgramsController.updateLoyaltyPrograms();

      // Assert that Axios.get is called with the correct URL
      expect(axios.get).toHaveBeenCalledWith('http://example.com/api/loyalty-programs');

      // Assert that LoyaltyPrograms.deleteMany is not called when there is an error
      expect(LoyaltyPrograms.deleteMany).not.toHaveBeenCalled();

      // Assert that LoyaltyPrograms.create is not called when there is an error
      expect(LoyaltyPrograms.create).not.toHaveBeenCalled();

      // Assert that console.error is called with the correct error message
      expect(console.error).toHaveBeenCalledWith('Error updating data:', expect.any(Error));
    });
  });
});
