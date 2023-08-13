// Import required modules and dependencies
const validateTransaction = require('../../utils/validateTransaction');
const { default: mongoose } = require('mongoose');
const { MONGODB_OPTIONS } = require('../../utils/config');
const LoyaltyProgramQueryModel = require('../../models/loyaltyProgramQueryModel');
const CurrencyRateModel = require('../../models/currencyRateModel');
const loyaltyProgramId = "mock";
const MONGODB_URL = "mongodb+srv://user1:1234@cluster0.5iybncp.mongodb.net/TESTDB?retryWrites=true&w=majority";
const StringFuzzer = require('../../../fuzzer/StringFuzzer');
const fc = require('fast-check'); // Import fast-check

// Set the test timeout to 24 hours
jest.setTimeout(86400000);

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

const startTime = Date.now();

// Before all test cases, connect to the MongoDB database
beforeAll(async () => {
    await mongoose.connect(MONGODB_URL, MONGODB_OPTIONS);
});

// After all test cases, disconnect from the MongoDB database
afterAll(async () => {
    await mongoose.disconnect();
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
    // Test case: validateTransaction function returns status code 400 if the membershipId is in the wrong format
    test("validateTransaction function returns status code 400 if the membershipId is in the wrong format", async() => {
        // Number of test iterations
        testIterations = 500;
        const response = new MockResponse();

        // Use fast-check to generate and test multiple cases
        await fc.assert(
            fc.asyncProperty(fc.string(), async (mockString) => {
                // Create a StringFuzzer instance with the membership format
                const fuzzer = new StringFuzzer(mockLoyaltyProgramData.membershipFormat);

                // Generate a random membership ID
                const membershipIdThatIsNotCorrect = fuzzer.generateRandomMembershipId(Math.random()*70);

                // Mock transaction data with the generated membership ID
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

                // Call validateTransaction and expect a 400 status and specific error message
                try {
                    await validateTransaction(request, response, jest.fn());
                    expect(response.status).toEqual(400);
                    expect(response.data.error).toEqual("Invalid membershipId format for this loyalty program.");
                } catch (error) {
                    // Error handling
                }
            }),
            { seed: Date.now(), numRuns: testIterations}
        );
    });  
});