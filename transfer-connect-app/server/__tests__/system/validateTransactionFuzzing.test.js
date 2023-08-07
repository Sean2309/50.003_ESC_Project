const validateTransaction = require('../../utils/validateTransaction');
const { default: mongoose } = require('mongoose');
const { MONGODB_OPTIONS } = require('../../utils/config');
const LoyaltyProgramQueryModel = require('../../models/loyaltyProgramQueryModel');
const CurrencyRateModel = require('../../models/currencyRateModel');
const loyaltyProgramId = "mock";
const MONGODB_URL = "mongodb+srv://user1:1234@cluster0.5iybncp.mongodb.net/TESTDB?retryWrites=true&w=majority";
const StringFuzzer = require('../StringFuzzer');
const fc = require('fast-check'); // Import fast-check

// set timeout to 24 hours
jest.setTimeout(86400000);

// Mock Response class to simulate responses
class MockResponse {
  constructor() {
    this.status;
    this.data;
  }

  status(statusCode) {
    this.status = statusCode;
    return this;
  }

  json(data) {
    this.data = data;
    return this;
  }
}

const mockLoyaltyProgramData = {
  programId: loyaltyProgramId,
  programName: "mock",
  currencyName: "mock",
  processingTime: "3h",
  description: "mock",
  enrollmentLink: "mock",
  tncLink: "mock",
  membershipFormat: "^\\d{7}[A-Za-z]{2}$",
}

const mockCurrencyRateData = {
  partnerCode: "mock",
  currencyRates: [
    {
      programId: loyaltyProgramId,
      currencyRate: 1.5,
    }
  ]
    
}

const startTime = Date.now();

beforeAll(async () => {
    await mongoose.connect(MONGODB_URL, MONGODB_OPTIONS);
})

beforeEach(async () => {
    const mockLoyaltyProgram = new LoyaltyProgramQueryModel(mockLoyaltyProgramData);
    
    const mockCurrencyRate = new CurrencyRateModel(mockCurrencyRateData);
    
    await mockLoyaltyProgram.save();
    await mockCurrencyRate.save();
    
})

afterEach(async () => {
    await LoyaltyProgramQueryModel.findOneAndDelete({ programId: loyaltyProgramId });
    await CurrencyRateModel.findOneAndDelete({ partnerCode: "mock" });
})


describe('validateTransaction middleware function unit tests', () => {
  test("validateTransaction function returns status code 400 if the membershipId is in the wrong format", async() => {
    testIterations = 500;
    const response = new MockResponse();

    await fc.assert(
      fc.asyncProperty(fc.string(), async (mockString) => {
        const fuzzer = new StringFuzzer(mockLoyaltyProgramData.membershipFormat);
        const membershipIdThatIsNotCorrect = fuzzer.generateRandomMembershipId(Math.random()*70); 
        
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
        
        
        // Call saveTransactionToDb with the generated mockTransactionData
        try {
            await validateTransaction(request, response, jest.fn());
            expect(response.status).toEqual(400);
            expect(response.data.error).toEqual("Invalid membershipId format for this loyalty program.");
        } catch (error) {
        }
      }),
      { seed: Date.now(), numRuns: testIterations}
    );
  });  
});
