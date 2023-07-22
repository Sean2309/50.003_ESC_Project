const axios = require('axios');
const transferFormController = require('../controllers/transferFormController');
const createTransferForm = require('../models/transferForm');

const loyaltyProgramId = 'mockId';


// Mock axios module
jest.mock('axios');

/* Connecting to the database before each test. */
beforeEach(async () => {
});

/* Closing database connection after each test. */
afterEach(async () => {
});

// =========== Test Suite and Cases ======== //

describe('createTransferForm function', () => {
  const TransferForm = createTransferForm(loyaltyProgramId);

  test('should create a transferForm model with collection name of loyaltyProgramId', () => {
    // ensure the model has collection name of loyaltyProgramId
    expect(TransferForm.collection.name).toEqual(loyaltyProgramId);
  })

  test('TransferForm instance should have all present fields given by mockFormData', () => {

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

    // create a document and immediately convert it back to a plain object, 
    const transferForm = (new TransferForm(mockFormData)).toObject();

    // delete _id key that is created for each mongodb document
    delete transferForm._id;

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
})

/*
  test('submitTransaction POST handler correct retrieves and tags referenceNumber and partnerCode to transferFormData', async () => {
    axios.post.mockResolvedValueOnce(mockServerSuccessfulResponse);

    const mockRequest = {
      body: mockFormData,
      params: {
        loyaltyProgramId: loyaltyProgramId
      }
    };

    const mockResponse = {
      status: jest.fn((statusCode) => statusCode).mockReturnThis(), // Return the response object itself for chaining
      json: jest.fn((data) => {
        this.body = data
        return this;
      }),
    };

    const mockSaveTransactionToDb = jest.spyOn(transferFormController, 'saveTransactionToDb').mockResolvedValueOnce();

    await transferFormController.submitTransferForm(mockRequest, mockResponse);
    
    console.log(mockResponse.body)

  })

})
*/