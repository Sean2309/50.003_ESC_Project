const transactionEnquiryController = require('../../controllers/transactionEnquiryController');
const axios = require('axios');
const wss = require('../../controllers/notificationServerController').wss;



// =========== Setting up Mock models ==========// 

jest.mock('axios', () => ({
  get: jest.fn()
}))


//used for testing makeApiRequest
jest.mock('../../utils/config', () => ({
  TRANSFER_CONNECT_API_URL: 'localhost',
  PARTNER_CODE: 'DBS'
}));



// =========== Setting up Mock Data ==========// 

const mockResponse_data = [
  {
    "transferAmount": 10000,
    "systemId": "0000",
    "outcomeCode": "0022",
    "notificationMethod": 0,
    "emailAddress": "example@gmail.com",
    "phoneNumber": "+6512345678",
    "membershipId": "12345678",
    "userId": "12345678"
  }];


// =========== Test Suite and Cases ======== //
beforeEach(() => {
  transactionEnquiryController.stopEnquiry();
})

// ====== Unit Test ====== // 
describe('Unit Tests for makeApiRequest', () => {

  test('makeApiRequest does API call successfully', async () => {

    await transactionEnquiryController.makeApiRequest(['0000'], 'AirAsia');

    expect(axios.get).toHaveBeenCalledTimes(1);

  })

  test('makeApiRequest calls correct URL', async () => {


    await transactionEnquiryController.makeApiRequest(['0000', '0001'], 'AirAsia');

    expect(axios.get).toHaveBeenCalledWith('localhost/api/transactionenquiry/check/undefined/AirAsia/0000,0001');
    expect(axios.get).toHaveBeenCalledTimes(2);

  })

})

describe('Unit Tests for updateDBandNotifs', () => {

  test('updateOutcomeCodes and sendPushNotification called when response_data is not null', async () => {

    const mockupdateOutcomeCodes = jest.spyOn(transactionEnquiryController, "updateOutcomeCodes").mockResolvedValueOnce();
    const mocksendPushNotification = jest.spyOn(transactionEnquiryController, "sendPushNotification").mockResolvedValueOnce();
    await transactionEnquiryController.updateDBandNotifs(mockResponse_data, "AirAsia");

    expect(transactionEnquiryController.updateOutcomeCodes).toHaveBeenCalledTimes(1);
    expect(transactionEnquiryController.sendPushNotification).toHaveBeenCalledTimes(1);

    mockupdateOutcomeCodes.mockRestore();
    mocksendPushNotification.mockRestore();

  })

  test('updateOutcomeCodes and sendPushNotification are called with correct parameters', async () => {

    const mockupdateOutcomeCodes = jest.spyOn(transactionEnquiryController, "updateOutcomeCodes").mockResolvedValueOnce();
    const mocksendPushNotification = jest.spyOn(transactionEnquiryController, "sendPushNotification").mockResolvedValueOnce();
    await transactionEnquiryController.updateDBandNotifs(mockResponse_data, "AirAsia")

    expect(transactionEnquiryController.updateOutcomeCodes).toHaveBeenCalledWith("0000", "0022", "AirAsia");
    expect(transactionEnquiryController.sendPushNotification).toHaveBeenCalledWith(undefined, "0022");

    mockupdateOutcomeCodes.mockRestore();
    mocksendPushNotification.mockRestore();
  })

  test('updateOutcomeCodes and sendPushNotification not called when response_data is null', async () => {

    const mockupdateOutcomeCodes = jest.spyOn(transactionEnquiryController, "updateOutcomeCodes").mockResolvedValueOnce();
    const mocksendPushNotification = jest.spyOn(transactionEnquiryController, "sendPushNotification").mockResolvedValueOnce();
    await transactionEnquiryController.updateDBandNotifs(null, "AirAsia")

    expect(transactionEnquiryController.updateOutcomeCodes).toHaveBeenCalledTimes(0);
    expect(transactionEnquiryController.sendPushNotification).toHaveBeenCalledTimes(0);

    mockupdateOutcomeCodes.mockRestore();
    mocksendPushNotification.mockRestore();

  })

  test('updateOutcomeCodes and sendPushNotification not called when response_data is []', async () => {

    const mockupdateOutcomeCodes = jest.spyOn(transactionEnquiryController, "updateOutcomeCodes").mockResolvedValueOnce();
    const mocksendPushNotification = jest.spyOn(transactionEnquiryController, "sendPushNotification").mockResolvedValueOnce();
    await transactionEnquiryController.updateDBandNotifs([], "AirAsia")

    expect(transactionEnquiryController.updateOutcomeCodes).toHaveBeenCalledTimes(0);
    expect(transactionEnquiryController.sendPushNotification).toHaveBeenCalledTimes(0);

    mockupdateOutcomeCodes.mockRestore();
    mocksendPushNotification.mockRestore();

  })
})



describe('Unit Tests for startEnquiry', () => {

  test('startEnquiry calls getReferenceNumbers, makeApiRequest and updateDbandNotifs', async () => {

    jest.useFakeTimers();

    await transactionEnquiryController.startEnquiry()

    const mockgetReferenceNumbers = jest.spyOn(transactionEnquiryController, "getReferenceNumbers").mockResolvedValue();
    const mockmakeApiRequest = jest.spyOn(transactionEnquiryController, "makeApiRequest").mockResolvedValue();
    const mockupdateDBandNotifs = jest.spyOn(transactionEnquiryController, "updateDBandNotifs").mockResolvedValue();

    //move forward by 1 only
    jest.advanceTimersToNextTimer(1);

    //wait for makeApiRequest and updateDBandNotifs to be resolved
    await Promise.resolve();
    await Promise.resolve();

    expect(transactionEnquiryController.getReferenceNumbers).toHaveBeenCalledTimes(1);
    expect(transactionEnquiryController.makeApiRequest).toHaveBeenCalledTimes(1);
    expect(transactionEnquiryController.updateDBandNotifs).toHaveBeenCalledTimes(1);


    mockgetReferenceNumbers.mockRestore();
    mockmakeApiRequest.mockRestore();
    mockupdateDBandNotifs.mockRestore();
    transactionEnquiryController.stopEnquiry();

  })

  test('startEnquiry calls has delay of 5 seconds - change accordingly', async () => {

    jest.useFakeTimers();

    await transactionEnquiryController.startEnquiry()

    const mockgetReferenceNumbers = jest.spyOn(transactionEnquiryController, "getReferenceNumbers").mockResolvedValue();
    const mockmakeApiRequest = jest.spyOn(transactionEnquiryController, "makeApiRequest").mockResolvedValue();
    const mockupdateDBandNotifs = jest.spyOn(transactionEnquiryController, "updateDBandNotifs").mockResolvedValue();

    //only call once every 5s
    jest.advanceTimersByTime(5000);

    //wait for makeApiRequest and updateDBandNotifs to be resolved
    await Promise.resolve();
    await Promise.resolve();

    expect(transactionEnquiryController.getReferenceNumbers).toHaveBeenCalledTimes(1);
    expect(transactionEnquiryController.makeApiRequest).toHaveBeenCalledTimes(1);
    expect(transactionEnquiryController.updateDBandNotifs).toHaveBeenCalledTimes(1);


    mockgetReferenceNumbers.mockRestore();
    mockmakeApiRequest.mockRestore();
    mockupdateDBandNotifs.mockRestore();
    transactionEnquiryController.stopEnquiry();

  })

})

wss.close();