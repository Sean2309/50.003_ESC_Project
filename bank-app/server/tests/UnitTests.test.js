const transactionEnquiryControllerClass = require('../controllers/transactionEnquiryController').TransactionEnquiryController;
const transactionEnquiryController = new transactionEnquiryControllerClass(false);
const axios = require('axios');




// =========== Setting up Mock models ==========// 

jest.mock('axios', () => ({
    get: jest.fn()
}))


//used for testing makeApiRequest
jest.mock('../utils/config', () => ({
    TRANSFER_CONNECT_API_URL: 'localhost',
    BANK_NAME: 'DBS'
}));



// =========== Setting up Mock Data ==========// 

const mockResponse_data = [
    {
        "transferAmount": 10000,
        "referenceNumber": "0000",
        "outcomeCode": "0022",
        "notificationMethod": 0,
        "emailAddress": "example@gmail.com",
        "phoneNumber": "+6512345678",
        "membershipId": "12345678"
      }];


// =========== Test Suite and Cases ======== //

  // ====== Unit Test ====== // 
describe ('Unit Tests for makeApiRequest', () => {

    test('makeApiRequest does API call successfully', async () => {

        await transactionEnquiryController.makeApiRequest(['0000'], 'AirAsia');
        
        expect(axios.get).toHaveBeenCalledTimes(1);

      })

      test('makeApiRequest calls correct URL', async () => {

        const logSpy = await jest.spyOn(global.console, 'log');

        await transactionEnquiryController.makeApiRequest(['0000','0001'], 'AirAsia');
        
        expect(logSpy.mock.calls).toContainEqual(['localhost/transferconnect/check/DBS/AirAsia/0000,0001']);
        expect(axios.get).toHaveBeenCalledTimes(2);

      })

})

describe ('Unit Tests for updateDBandNotifs', () => {

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
      expect(transactionEnquiryController.sendPushNotification).toHaveBeenCalledWith("12345678", "0022");

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



describe ('Unit Tests for startEnquiry', () => {

    test('startEnquiry calls getReferenceNumbers, makeApiRequest and updateDbandNotifs', async () => {

      jest.useFakeTimers();

      const transactionEnquiryControllerTrue = new TransactionEnquiryController(true);

      const mockgetReferenceNumbers = jest.spyOn(transactionEnquiryControllerTrue, "getReferenceNumbers").mockResolvedValue();
      const mockmakeApiRequest = jest.spyOn(transactionEnquiryControllerTrue, "makeApiRequest").mockResolvedValue();
      const mockupdateDBandNotifs = jest.spyOn(transactionEnquiryControllerTrue, "updateDBandNotifs").mockResolvedValue();
      
      //move forward by 1 only
      jest.advanceTimersToNextTimer(1);

      //wait for makeApiRequest and updateDBandNotifs to be resolved
      await Promise.resolve();
      await Promise.resolve();

      expect(transactionEnquiryControllerTrue.getReferenceNumbers).toHaveBeenCalledTimes(1);
      expect(transactionEnquiryControllerTrue.makeApiRequest).toHaveBeenCalledTimes(1);
      expect(transactionEnquiryControllerTrue.updateDBandNotifs).toHaveBeenCalledTimes(1);


      mockgetReferenceNumbers.mockRestore();
      mockmakeApiRequest.mockRestore();
      mockupdateDBandNotifs.mockRestore();

      transactionEnquiryControllerTrue.stopEnquiry();

    })

    test('startEnquiry calls has delay of 5 seconds - change accordingly', async () => {

      jest.useFakeTimers();

      const transactionEnquiryControllerTrue = new TransactionEnquiryController(true);

      const mockgetReferenceNumbers = jest.spyOn(transactionEnquiryControllerTrue, "getReferenceNumbers").mockResolvedValue();
      const mockmakeApiRequest = jest.spyOn(transactionEnquiryControllerTrue, "makeApiRequest").mockResolvedValue();
      const mockupdateDBandNotifs = jest.spyOn(transactionEnquiryControllerTrue, "updateDBandNotifs").mockResolvedValue();
      
      //only call once every 5s
      jest.advanceTimersByTime(5000);

      //wait for makeApiRequest and updateDBandNotifs to be resolved
      await Promise.resolve();
      await Promise.resolve();

      expect(transactionEnquiryControllerTrue.getReferenceNumbers).toHaveBeenCalledTimes(1);
      expect(transactionEnquiryControllerTrue.makeApiRequest).toHaveBeenCalledTimes(1);
      expect(transactionEnquiryControllerTrue.updateDBandNotifs).toHaveBeenCalledTimes(1);


      mockgetReferenceNumbers.mockRestore();
      mockmakeApiRequest.mockRestore();
      mockupdateDBandNotifs.mockRestore();

      transactionEnquiryControllerTrue.stopEnquiry();

    })

})


    /*
//edit test after integration to use membershipID
 // ============ test WebSocket connecton ============= // 
describe ('Unit tests for WebSocket', () => {

    test('WebSocket is connected', async () => {

        //jest.replaceProperty(WebSocket, 'OPEN', true)
        const logSpy = await jest.spyOn(global.console, 'log');
        //use placeholder membershipId first
        await sendMessagetoClient(clients, membershipId, '0000');

        expect(logSpy.mock.calls).toHaveBeenCalledWith('1230oij websocket connection found')

    })})

    */