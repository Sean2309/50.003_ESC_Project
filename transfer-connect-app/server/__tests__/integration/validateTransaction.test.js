const validateTransaction = require('../../utils/validateTransaction');
const { default: mongoose } = require('mongoose');
const { MONGODB_URL, MONGODB_OPTIONS } = require('../../utils/config');
const LoyaltyProgramQueryModel = require('../../models/loyaltyProgramQueryModel');
const CurrencyRateModel = require('../../models/currencyRateModel');
const loyaltyProgramId = "mock";

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
  /*
    validateTransaction should check if the loyaltyProgram exists
    and if the membershipId given in the data is of the correct format
    */

  test('validateTransaction returns status code 400 if loyaltyProgramId does not exist', async () => {
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
      
    await validateTransaction(request, response, jest.fn());
      
    expect(response.status).toEqual(400);
    expect(response.data.error).toEqual("Invalid loyaltyProgramId.")

  });
    
  test("validateTransaction function returns status code 400 if the membershipId is in the wrong format", async() => {
      
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
      
    await validateTransaction(request, response, jest.fn());
      

    expect(response.status).toEqual(400);
    expect(response.data.error).toEqual("Invalid membershipId format for this loyalty program.")
    
  })
    
  test("validateTransaction function calls next if validation is successful", async () => {
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

    await validateTransaction(request, response, next);
      
    expect(next).toHaveBeenCalledTimes(1);
    
  })
    
  test("if mongoose related errors occur, validateTransaction will catch and return status code 500", async () => {
    const mockTransactionData = null;

    const request = { body: mockTransactionData, params: { loyaltyProgramId: loyaltyProgramId }};
      
    const response = new MockResponse();
      
    next = jest.fn();
    
    await validateTransaction(request, response, next);
      
    expect(response.status).toEqual(500);

  })
    
});
