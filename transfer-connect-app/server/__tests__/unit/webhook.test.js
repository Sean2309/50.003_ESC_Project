const transactionEnquiryController = require('../../controllers/transactionEnquiryController');
const webhookController = require('../../controllers/webhookController');
const axios = require('axios');

// =========== Mock data for getOutcomeCodes ==========// 

const transactionData = [{
    "membershipId": "123oij",
    "memberName": "LX",
    "transferDate": "11-11-11",
    "transferAmount": 12345,
    "referenceNumber": "0000",
    "partnerCode": "DBSSG",
    "outcomeCode": "9999",
    "notificationMethod": 1,
    "emailAddress": "example@email.com",
    "phoneNumber": "+6512345678",
    "systemId": "abcdef"
  }];

// =========== Setting up Mock models ==========// 

    jest.mock('axios', () => ({

        post: jest.fn(),

        }));

    jest.mock("../../controllers/transactionEnquiryController", () => ({

        sendNotification: jest.fn(),
  
      }));

    
// =========== Test Suite and Cases ======== //

describe ('Unit Tests for processRoute', () => {


  test('processRoute posts transaction', async () => {
    const mockFindTransaction = jest.spyOn(webhookController, "findTransaction").mockReturnValueOnce(transactionData);
    const mockPostTransaction = jest.spyOn(webhookController, "postTransaction").mockImplementation(() => jest.fn());

    //mock collection_connection
    await webhookController.processRoute("0000", "DBSSG", 12345, "GOPOINTS");
    
    expect(transactionEnquiryController.sendNotification).toHaveBeenCalledTimes(1);
    expect(webhookController.postTransaction).toHaveBeenCalledTimes(1);

    mockFindTransaction.mockRestore();
    mockPostTransaction.mockRestore();
    })

    test('processRoute calls postTransaction with correct values', async () => {
        const mockFindTransaction = jest.spyOn(webhookController, "findTransaction").mockReturnValueOnce(transactionData);
        const mockPostTransaction = jest.spyOn(webhookController, "postTransaction").mockImplementation(() => jest.fn());
    
        //mock collection_connection
        await webhookController.processRoute("0000", "DBSSG", 12345, "GOPOINTS");
        
        expect(webhookController.postTransaction).toHaveBeenCalledWith(transactionData, "GOPOINTS", "DBSSG");
    
        mockFindTransaction.mockRestore();
        mockPostTransaction.mockRestore();
    })

    test('processRoute calls sendNotification with correct values', async () => {
        const mockFindTransaction = jest.spyOn(webhookController, "findTransaction").mockReturnValueOnce(transactionData);
        const mockPostTransaction = jest.spyOn(webhookController, "postTransaction").mockImplementation(() => jest.fn());
    
        //mock collection_connection
        await webhookController.processRoute("0000", "DBSSG", 12345, "GOPOINTS");
        
        expect(transactionEnquiryController.sendNotification).toHaveBeenCalledWith("+6512345678", "example@email.com", 1, "9999", "DBSSG", "GOPOINTS", 12345);
    
        mockFindTransaction.mockRestore();
        mockPostTransaction.mockRestore();
    })

});


describe ('Unit tests for postTransaction', () => {

  test('postTransaction calls axios.post', async () => {
    
    await webhookController.postTransaction(transactionData, "GOPOINTS", "DBSSG");

    expect(axios.post).toHaveBeenCalledTimes(1);

  })

  test('postTransaction calls axios.post with correct url', async () => {
    
    await webhookController.postTransaction(transactionData, "GOPOINTS", "DBSSG");

    expect(axios.post).toHaveBeenCalledWith("http://localhost:3001/api/webhook/DBSSG/GOPOINTS", transactionData);
  })
  
});
