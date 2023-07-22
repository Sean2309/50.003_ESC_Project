const transactionEnquiryController = require('../controllers/transactionEnquiryController');
const transactionEnquiryModel = require('../models/transactionEnquiryModel');




// =========== Setting up Mock models ==========// 

//mock two functions in transactionEnquiryController to test each function separately
jest.mock('../controllers/transactionEnquiryController', () => ({
    ...jest.requireActual('../controllers/transactionEnquiryController'), // Copy all properties and methods from the original module
    sendNotification: jest.fn(), // Mock sendNotification
    getOutcomeCode: jest.fn(),

  }));

  jest.mock('mongoose', () => ({

      models: jest.fn(),
      Schema: jest.fn(),
      model: jest.fn()
    }));

jest.mock('../models/transactionEnquiryModel', () => ({

}));

  
// ============= Mock Data ============== //
const mockData = [
{
    "_id": {
      "$oid": "64bbeba7bd474d999e38dd36"
    },
    "membershipId": "1230oij",
    "transferDate": "2020-01-01",
    "transferAmount": 10000,
    "referenceNumber": "0000",
    "partnerCode": "DBS",
    "outcomeCode": "0022",
    "notificationMethod": 0,
    "emailAddress": "example@gmail.com",
    "phoneNumber": "+6512345678",
    "memberName": "DBS_AirAsia"
  },

  {
    "_id": {
      "$oid": "64bbebdebd474d999e38dd3e"
    },
    "membershipId": "1230oij",
    "transferDate": "2020-01-01",
    "transferAmount": 10000,
    "referenceNumber": "0000",
    "partnerCode": "UOB",
    "outcomeCode": "00011",
    "notificationMethod": 1,
    "emailAddress": "example@gmail.com",
    "phoneNumber": "+6512345678",
    "memberName": "UOB_AirAsia"
  }]

  const mockgetOutcomeCodeSuccessData = [
    {
        "transferAmount": 10000,
        "referenceNumber": "0000",
        "outcomeCode": "0022",
        "notificationMethod": 0,
        "emailAddress": "example@gmail.com",
        "phoneNumber": "+6512345678"
      }]

// ========== processRoute Mock Params ============= //

    const req1 = { params: { loyalty_program: 'AirAsia', bank_app: 'DBS', referencenumber: '0000' } };
    const res = { send: jest.fn() };

// ============ getOutcomeCode Mock function =========== //

const mockOutcomeCodes = {
  "['0000'] , DBS, AirAsia ": [
    { outcomeCode: '0022', phoneNumber: '+6512345678', emailAddress: 'example@gmail.com', notificationMethod: 0, transferAmount: 10000 },
  ],
  // Add more entries as needed for other test cases
};

const getOutcomeCodeMock = jest.fn((id_list, bank_name, loyalty_program_name) => {
    const key = `${id_list},${bank_name},${loyalty_program_name}`;
    return Promise.resolve(mockOutcomeCodes[key] || []);
  });

  transactionEnquiryController.getOutcomeCode.mockImplementation(getOutcomeCodeMock);

// =========== Test Suite and Cases ======== //

describe('TransactionEnquiryController', () => {


  // Create a new instance of the LoyaltyProgramQueryController before each test
  beforeEach(() => {
  });

  // Clear all mock data after each test
  afterEach(() => {
  });


  // ====== Unit Test ====== // 
  describe ('Unit Tests for processRoute', () => {

    test('getOutcomeCode retrieves data with valid parameters', async () => {

        //mock collection_connection
        const response = await transactionEnquiryController.processRoute(req1, res);
        
        expect(transactionEnquiryController.getOutcomeCode).toHaveBeenCalledTimes(1);
        expect(res.send).toHaveBeenCalled();
    
      })

  })});