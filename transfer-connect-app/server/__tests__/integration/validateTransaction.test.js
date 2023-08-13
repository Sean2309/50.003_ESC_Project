// Import required modules and dependencies
const validateTransaction = require('../../utils/validateTransaction');
const { default: mongoose } = require('mongoose');
const { MONGODB_OPTIONS } = require('../../utils/config');
const LoyaltyProgramQueryModel = require('../../models/loyaltyProgramQueryModel');
const CurrencyRateModel = require('../../models/currencyRateModel');
const loyaltyProgramId = "mock";
const MONGODB_URL = "mongodb+srv://user1:1234@cluster0.5iybncp.mongodb.net/TESTDB?retryWrites=true&w=majority";

// Mock Response class to simulate responses
class MockResponse {
    constructor() {
        this.status;
        this.data;
    }

    // Simulate response status setting
    status(statusCode) {
        this.status = statusCode;
        return this;
    }

    // Simulate JSON response data setting
    json(data) {
        this.data = data;
        return this;
    }
}

// Mock data for LoyaltyProgramQueryModel and CurrencyRateModel
const mockLoyaltyProgramData = {
    programId: loyaltyProgramId,
    programName: "mock",
    currencyName: "mock",
    processingTime: "3h",
    description: "mock",
    enrollmentLink: "mock",
    tncLink: "mock",
    membershipFormat: "^\\d{7}[A-Za-z]{2}$",
};

const mockCurrencyRateData = {
    partnerCode: "mock",
    currencyRates: [
        {
            programId: loyaltyProgramId,
            currencyRate: 1.5,
        }
    ]
};

// Before all test cases, connect to the MongoDB database
beforeAll(async () => {
    await mongoose.connect(MONGODB_URL, MONGODB_OPTIONS);
});

// Before each test case, save mock data to respective collections
beforeEach(async () => {
    const mockLoyaltyProgram = new LoyaltyProgramQueryModel(mockLoyaltyProgramData);
    const mockCurrencyRate = new CurrencyRateModel(mockCurrencyRateData);
    
    await mockLoyaltyProgram.save();
    await mockCurrencyRate.save();
});

// After each test case, delete mock data from collections
afterEach(async () => {
    await LoyaltyProgramQueryModel.findOneAndDelete({ programId: loyaltyProgramId });
    await CurrencyRateModel.findOneAndDelete({ partnerCode: "mock" });
});

// Describe a test suite for the validateTransaction middleware function
describe('validateTransaction middleware function unit tests', () => {
    /*
      validateTransaction should check if the loyaltyProgram exists
      and if the membershipId given in the data is of the correct format
    */

    // Test case: validateTransaction returns status code 400 if loyaltyProgramId does not exist
    test('validateTransaction returns status code 400 if loyaltyProgramId does not exist', async () => {
        // Mock transaction data and request object
        const mockTransactionData = {
            memberName: 'mockUser',
            membershipId: '01',
            transferDate: '11-11-11',
            transferAmount: 2000,
            notificationMethod: '1',
            emailAddress: 'mock@email.com',
            phoneNumber: '88100110',
            referenceNumber: '100101101D',
            partnerCode: 'DBSSG',
            systemId: 'MOCK',
        };
        const request = { body: mockTransactionData, params: { loyaltyProgramId: "NONE" }};
        const response = new MockResponse();
      
        // Call validateTransaction and expect a 400 status and specific error message
        await validateTransaction(request, response, jest.fn());
        expect(response.status).toEqual(400);
        expect(response.data.error).toEqual("Invalid loyaltyProgramId.");
    });
    
    // Test case: validateTransaction function returns status code 400 if the membershipId is in the wrong format
    test("validateTransaction function returns status code 400 if the membershipId is in the wrong format", async() => {
        // Mock transaction data with incorrect membershipId format
        const membershipIdThatIsNotCorrect = "NONE";
        const mockTransactionData = {
            memberName: 'mockUser',
            membershipId: membershipIdThatIsNotCorrect,
            transferDate: '11-11-11',
            transferAmount: 2000,
            notificationMethod: '1',
            emailAddress: 'mock@email.com',
            phoneNumber: '88100110',
            referenceNumber: '100101101D',
            partnerCode: 'DBSSG',
            systemId: 'MOCK',
        };
        const request = { body: mockTransactionData, params: { loyaltyProgramId: loyaltyProgramId }};
        const response = new MockResponse();
      
        // Call validateTransaction and expect a 400 status and specific error message
        await validateTransaction(request, response, jest.fn());
        expect(response.status).toEqual(400);
        expect(response.data.error).toEqual("Invalid membershipId format for this loyalty program.");
    });
    
    // Test case: validateTransaction function calls next if validation is successful
    test("validateTransaction function calls next if validation is successful", async () => {
        // Mock transaction data with valid membershipId format
        const mockTransactionData = {
            memberName: 'mockUser',
            membershipId: '1234567AA',
            transferDate: '11-11-11',
            transferAmount: 2000,
            notificationMethod: '1',
            emailAddress: 'mock@email.com',
            phoneNumber: '88100110',
            referenceNumber: '100101101D',
            partnerCode: 'DBSSG',
            systemId: 'MOCK',
        };
        const request = { body: mockTransactionData, params: { loyaltyProgramId: loyaltyProgramId }};
        const response = new MockResponse();
        next = jest.fn();
      
        // Call validateTransaction and expect the 'next' function to be called
        await validateTransaction(request, response, next);
        expect(next).toHaveBeenCalledTimes(1);
    });
    
    // Test case: if mongoose related errors occur, validateTransaction will catch and return status code 500
    test("if mongoose related errors occur, validateTransaction will catch and return status code 500", async () => {
        const mockTransactionData = null;
        const request = { body: mockTransactionData, params: { loyaltyProgramId: loyaltyProgramId }};
        const response = new MockResponse();
        next = jest.fn();
      
        // Call validateTransaction and expect a 500 status
        await validateTransaction(request, response, next);
        expect(response.status).toEqual(500);
    });
    
});
