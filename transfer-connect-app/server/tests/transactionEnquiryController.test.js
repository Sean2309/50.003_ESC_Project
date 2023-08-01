const transactionEnquiryController = require('../controllers/transactionEnquiryController').transactionController;
const {mongoose} = require('mongoose');
const emailNotification = require('../controllers/emailNotification');
const messageNotification = require('../controllers/messageNotification');


// ========== processRoute Mock Params ============= //

    const req1 = { params: { loyalty_program: 'AirAsia', bank_app: 'DBS', referencenumber: '0000' } };
    const req2 = { params: { loyalty_program: 'AirAsia', bank_app: 'DBS', referencenumber: '0000,0001' } };
    const res = { send: jest.fn() };

// =========== Mock data for getOutcomeCodes ==========// 

const mockgetOutcomeCodeSuccessData = [
    {
        "transferAmount": 10000,
        "referenceNumber": "0000",
        "outcomeCode": "0022",
        "notificationMethod": 0,
        "emailAddress": "example@gmail.com",
        "phoneNumber": "+6512345678",
        "membershipId": "12345678"
      }];

// =========== Setting up Mock models ==========// 


  jest.mock('mongoose', () => ({

      models: jest.fn(),
      Schema: jest.fn(),
      model: jest.fn(),
      find: jest.fn()
    }));


// =========== Test Suite and Cases ======== //

describe ('Unit Tests for processRoute', () => {


  test('processRoute sends transaction', async () => {
    const mockOutcomeCode = jest.spyOn(transactionEnquiryController, "getOutcomeCode").mockImplementation(() => jest.fn());
    //mock collection_connection
    await transactionEnquiryController.processRoute(req1, res);
    
    expect(transactionEnquiryController.getOutcomeCode).toHaveBeenCalledTimes(1);
    expect(res.send).toHaveBeenCalledTimes(1);

    mockOutcomeCode.mockRestore();
    })

    test('processRoute returns correct values (id_list 1 item)', async () => {
      const mockOutcomeCode = jest.spyOn(transactionEnquiryController, "getOutcomeCode").mockImplementation(() => jest.fn());
      const response = await transactionEnquiryController.processRoute(req1, res);
      
      expect(response).toEqual(['DBS', 'AirAsia', ['0000']]);
      mockOutcomeCode.mockRestore();
    })

    test('processRoute returns correct values (id_list 2 items)', async () => {
      const mockOutcomeCode = jest.spyOn(transactionEnquiryController, "getOutcomeCode").mockImplementation(() => jest.fn());
      //mock collection_connection
      const response = await transactionEnquiryController.processRoute(req2, res);
      
      expect(response).toEqual(['DBS', 'AirAsia', ['0000', '0001']]);
      mockOutcomeCode.mockRestore();
    })

});
  

describe ('Unit tests for sendNotification', () => {


  test('NotificationAPI calls only sendEmail when notificationMethod is 0', async () => {

    const mockEmail = jest.spyOn(emailNotification, "sendEmail").mockImplementation(() => jest.fn());
    const mockMessage = jest.spyOn(messageNotification, "sendMessages").mockImplementation(() => jest.fn());
    await transactionEnquiryController.sendNotification('+6512345678', 'leelxuan@gmail.com', 0, 1000, 'DBS', 'AirAsia', 10000);

    expect(emailNotification.sendEmail).toHaveBeenCalledTimes(1);
    expect(messageNotification.sendMessages).toHaveBeenCalledTimes(0);

    mockEmail.mockRestore();
    mockMessage.mockRestore();
  })

  test('NotificationAPI calls only sendMessage when notificationMethod is 1', async () => {

    const mockEmail = jest.spyOn(emailNotification, "sendEmail").mockImplementation(() => jest.fn())
    const mockMessage = jest.spyOn(messageNotification, "sendMessages").mockImplementation(() => jest.fn())
    await transactionEnquiryController.sendNotification('+6512345678', 'leelxuan@gmail.com', 1, 1000, 'DBS', 'AirAsia', 10000);

    expect(emailNotification.sendEmail).toHaveBeenCalledTimes(0);
    expect(messageNotification.sendMessages).toHaveBeenCalledTimes(1);

    mockEmail.mockRestore();
    mockMessage.mockRestore();
  })

  test('NotificationAPI calls both when notificationMethod is 2', async () => {

    const mockEmail = jest.spyOn(emailNotification, "sendEmail").mockImplementation(() => jest.fn())
    const mockMessage = jest.spyOn(messageNotification, "sendMessages").mockImplementation(() => jest.fn())
    await transactionEnquiryController.sendNotification('+6512345678', 'leelxuan@gmail.com', 2, 1000, 'DBS', 'AirAsia', 10000);

    expect(emailNotification.sendEmail).toHaveBeenCalledTimes(1);
    expect(messageNotification.sendMessages).toHaveBeenCalledTimes(1);

    mockEmail.mockRestore();
    mockMessage.mockRestore();
  })  
});

describe ('Unit tests for getOutcomeCode', () => {


  test('getOutcomeCode calls find_transaction for number of ids in id_list', async () => {
    
    //test that find_transaction is called 
    const mockFindTransaction = jest.spyOn(transactionEnquiryController, "find_transaction").mockReturnValue([]);
    await transactionEnquiryController.getOutcomeCode([], ["0000", "0001", "0002"], 'DBS', 'AirAsia');

    expect(transactionEnquiryController.find_transaction).toHaveBeenCalledTimes(3);

    mockFindTransaction.mockRestore();
  })

  test('getOutcomeCode returns empty list when no transaction is found', async () => {
    
    //test that when find_transaction returns [], goes to console.log
    const mockFindTransaction = jest.spyOn(transactionEnquiryController, "find_transaction").mockReturnValue([]);
    const mockSendNotification = jest.spyOn(transactionEnquiryController, "sendNotification").mockImplementation(() => jest.fn());
    let outcomeCodes = await transactionEnquiryController.getOutcomeCode([], ["0000", "0001", "0002"], 'DBS', 'AirAsia');

    expect(outcomeCodes).toHaveLength(0);
    expect(transactionEnquiryController.find_transaction).toHaveBeenCalledTimes(3);
    expect(transactionEnquiryController.sendNotification).toHaveBeenCalledTimes(0);

    mockFindTransaction.mockRestore();
    mockSendNotification.mockRestore();
  })

  test('getOutcomeCode returns outcomeCodes and calls sendNotification when transaction is found', async () => {
    
    //test that find_transaction is called 
    const mockFindTransaction = jest.spyOn(transactionEnquiryController, "find_transaction").mockReturnValueOnce(mockgetOutcomeCodeSuccessData);
    const mockSendNotification = jest.spyOn(transactionEnquiryController, "sendNotification").mockImplementation(() => jest.fn());
    const outcomeCodes = await transactionEnquiryController.getOutcomeCode([], ["0000"], 'DBS', 'AirAsia');

    expect(transactionEnquiryController.find_transaction).toHaveBeenCalledTimes(1);
    expect(transactionEnquiryController.sendNotification).toHaveBeenCalledTimes(1);
    expect(outcomeCodes).toEqual(mockgetOutcomeCodeSuccessData);

    mockFindTransaction.mockRestore();
    mockSendNotification.mockRestore();
  })
  
});