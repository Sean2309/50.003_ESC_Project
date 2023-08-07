const transactionEnquiryController = require('../../controllers/transactionEnquiryController');
const webhookController = require('../../controllers/webhookController');


// =========== Setting up Mock Data ==========// 
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


const mockTransactionData =
{
  "membershipId": "123oij",
  "memberName": "LX",
  "transferDate": "11-11-11",
  "transferAmount": 12345,
  "referenceNumber": "0000",
  "partnerCode": "DBSSG",
  "notificationMethod": 1,
  "emailAddress": "leelxuan@gmail.com",
  "phoneNumber": "+6588669619",
  "systemId": "0000",
  "userId": "1",
  "outcomeCode": "9999"
};

const mockRequestData = {
  params: {
    loyaltyProgramId: 'GOPOINTS', // The value of the loyaltyProgramId extracted using destructuring
    // Other parameters, if any, passed in the request
  },
  body: [
    {
      "membershipId": "123oij",
      "memberName": "LX",
      "transferDate": "11-11-11",
      "transferAmount": 12345,
      "referenceNumber": "0000",
      "partnerCode": "DBSSG",
      "notificationMethod": 1,
      "emailAddress": "leelxuan@gmail.com",
      "phoneNumber": "+6588669619",
      "systemId": "0000",
      "userId": "1",
      "outcomeCode": "9999"
    }],
};

const mockRequestNullData = {
  params: {
    loyaltyProgramId: 'GOPOINTS', // The value of the loyaltyProgramId extracted using destructuring
    // Other parameters, if any, passed in the request
  },
  body: [],
}


// =========== Test Suite and Cases ======== //
beforeEach(() => {
  transactionEnquiryController.stopEnquiry();
})

// ====== Unit Test ====== // 
describe('Unit Tests for processResponse', () => {

  test('procesResponse returns correct outputs', async () => {

    const [transaction, loyaltyProgramId] = await webhookController.processResponse(mockRequestData, null);

    expect(transaction).toStrictEqual(mockTransactionData);
    expect(loyaltyProgramId).toBe("GOPOINTS");

  })

  test('processResponse returns empty list otherwise', async () => {

    const [transaction, loyaltyProgramId] = await webhookController.processResponse(mockRequestNullData, null);

    expect(transaction).toStrictEqual(undefined);
    expect(loyaltyProgramId).toBe("GOPOINTS");

  })
})

describe('Unit Tests for updateDBandNotifs', () => {

  test('updateOutcomeCodes and sendPushNotification called when response_data is not null', async () => {

    const mockupdateOutcomeCodes = jest.spyOn(webhookController, "updateOutcomeCodes").mockResolvedValueOnce();
    const mocksendPushNotification = jest.spyOn(webhookController, "sendPushNotification").mockResolvedValueOnce();
    await webhookController.updateDBandNotifs(mockTransactionData, "GOPOINTS");

    expect(webhookController.updateOutcomeCodes).toHaveBeenCalledTimes(1);
    expect(webhookController.sendPushNotification).toHaveBeenCalledTimes(1);

    mockupdateOutcomeCodes.mockRestore();
    mocksendPushNotification.mockRestore();

  })

  test('updateOutcomeCodes and sendPushNotification are called with correct parameters', async () => {

    const mockupdateOutcomeCodes = jest.spyOn(webhookController, "updateOutcomeCodes").mockResolvedValueOnce();
    const mocksendPushNotification = jest.spyOn(webhookController, "sendPushNotification").mockResolvedValueOnce();
    await webhookController.updateDBandNotifs(mockTransactionData, "GOPOINTS")

    expect(webhookController.updateOutcomeCodes).toHaveBeenCalledWith("0000", "9999", "GOPOINTS");
    expect(webhookController.sendPushNotification).toHaveBeenCalledWith(undefined, "9999");

    mockupdateOutcomeCodes.mockRestore();
    mocksendPushNotification.mockRestore();
  })

  test('updateOutcomeCodes and sendPushNotification not called when response_data is null', async () => {

    const mockupdateOutcomeCodes = jest.spyOn(webhookController, "updateOutcomeCodes").mockResolvedValueOnce();
    const mocksendPushNotification = jest.spyOn(webhookController, "sendPushNotification").mockResolvedValueOnce();
    await webhookController.updateDBandNotifs(null, "GOPOINTS")

    expect(webhookController.updateOutcomeCodes).toHaveBeenCalledTimes(0);
    expect(webhookController.sendPushNotification).toHaveBeenCalledTimes(0);

    mockupdateOutcomeCodes.mockRestore();
    mocksendPushNotification.mockRestore();

  })

  test('updateOutcomeCodes and sendPushNotification not called when response_data is []', async () => {

    const mockupdateOutcomeCodes = jest.spyOn(webhookController, "updateOutcomeCodes").mockResolvedValueOnce();
    const mocksendPushNotification = jest.spyOn(webhookController, "sendPushNotification").mockResolvedValueOnce();
    await webhookController.updateDBandNotifs([], "GOPOINTS")

    expect(webhookController.updateOutcomeCodes).toHaveBeenCalledTimes(0);
    expect(webhookController.sendPushNotification).toHaveBeenCalledTimes(0);

    mockupdateOutcomeCodes.mockRestore();
    mocksendPushNotification.mockRestore();

  })
})

describe('Unit Tests for processData', () => {

  test('procesData calls updateDBandNotifs with correct params', async () => {

    const response = new MockResponse();

    const mockupdateDBandNotifs = jest.spyOn(webhookController, "updateDBandNotifs").mockResolvedValueOnce();
    await webhookController.processData(mockRequestData, response);

    expect(webhookController.updateDBandNotifs).toHaveBeenCalledWith(mockTransactionData, "GOPOINTS");

    mockupdateDBandNotifs.mockRestore();
  })

})

