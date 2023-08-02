const axios = require('axios');
const transferFormController = require('../../controllers/transferFormController');
const createTransferForm = require('../../models/transferForm');
const { PARTNERCODE } = require('../../utils/config');

const loyaltyProgramId = 'mockId';


// Mock axios module
jest.mock('axios');

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

// =========== Test Suite and Cases ======== //

describe('createTransferForm function', () => {
  const TransferForm = createTransferForm(loyaltyProgramId);

  test('should create a transferForm model with collection name of loyaltyProgramId', () => {
    // ensure the model has collection name of loyaltyProgramId
    expect(TransferForm.collection.name).toEqual(loyaltyProgramId);
  })

  test('TransferForm instance should have all present fields given by form data', () => {

    // mock form data to simulate sending of data from bank app client
    const mockFormData = {
      memberName: "mockUser",
      membershipId: "01",
      transferDate: "11-11-11",
      transferAmount: 2000,
      notificationMethod: "1",
      emailAddress: "mock@email.com",
      phoneNumber: "88100110",
      partnerCode: "20010",
      systemId: "120203"
    };

    // create a document and immediately convert it back to a plain object, 
    const transferForm = (new TransferForm(mockFormData)).toObject();

    // delete _id key that is created for each mongodb document
    delete transferForm._id;

    console.log(transferForm)
    expect(transferForm).toMatchObject(mockFormData);
  })
})

describe('transferFormController', () => {
  // mock form data to simulate sending of data from bank app client
  const mockFormData = {
    memberName: "mockUser",
    membershipId: "01",
    transferDate: "11-11-11",
    transferAmount: 2000,
    notificationMethod: "1",
    emailAddress: "mock@email.com",
    phoneNumber: "88100110",
  };

  // simulate successful response from sending POST request to TransferConnect API endpoint
  const mockServerSuccessfulResponse = {
    status: 201,
    data: {
      memberName: "mockUser",
      membershipId: "01",
      transferDate: "11-11-11",
      transferAmount: 2000,
      referenceNumber: "101",
      partnerCode: "mockApp",
      notificationMethod: "1",
      emailAddress: "mock@email.com",
      phoneNumber: "88100110",

    }
  };

  // test postTransaction to see if controller attempts to send POST request to TransferConnect endpoint
  test('postTransaction sends axios POST request to TransferConnect endpoint', async () => {

    axios.post.mockResolvedValueOnce(mockServerSuccessfulResponse);

    const response = await transferFormController.postTransaction(mockFormData, loyaltyProgramId);

    expect(response).toEqual(mockServerSuccessfulResponse.data);
    expect(axios.post).toHaveBeenCalledTimes(1);

  })

  test('submitTransaction POST handler correctly retrieves and tags referenceNumber and partnerCode to transferFormData', async () => {
    axios.post.mockResolvedValueOnce(mockServerSuccessfulResponse);

    const referenceNumber = 9999;

    const mockRequest = {
      body: mockFormData,
      params: {
        loyaltyProgramId: loyaltyProgramId
      }
    };

    // simulate controller function to save transaction to db
    jest.spyOn(transferFormController, 'saveTransactionToDb').mockResolvedValueOnce();

    // simulate controller functions to add additional fields to transferFormData
    jest.spyOn(transferFormController, 'generateReferenceNumber').mockResolvedValueOnce(referenceNumber);

    const mockResponse = new MockResponse();

    const newMockFormData = { ...mockFormData };

    // attached mock fields to new form
    newMockFormData.partnerCode = PARTNERCODE;
    newMockFormData.referenceNumber = referenceNumber;

    await transferFormController.submitTransferForm(mockRequest, mockResponse);

    expect(mockResponse.status).toEqual(201);
    expect(mockResponse.data).toEqual(mockFormData);

  })
  
  test("generateReferenceNumber generates a random number", () => {
    const referenceNumber = transferFormController.generateReferenceNumber();
    
    expect(typeof referenceNumber).toBe('number');
    
  })
  
  test("submitTransferForm returns status code 500 if the submission fails", () => {
    
  })

})