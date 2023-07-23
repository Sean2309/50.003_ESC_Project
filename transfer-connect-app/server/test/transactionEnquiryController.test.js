const transactionEnquiryController = require('../controllers/transactionEnquiryController').transactionController;
const transactionEnquiryModel = require('../models/transactionEnquiryModel');
const {mongoose} = require('mongoose');
const emailNotification = require('../controllers/emailNotification');
const messageNotification = require('../controllers/messageNotification');


// ========== processRoute Mock Params ============= //

    const req1 = { params: { loyalty_program: 'AirAsia', bank_app: 'DBS', referencenumber: '0000' } };
    const req2 = { params: { loyalty_program: 'AirAsia', bank_app: 'DBS', referencenumber: '0000,0001' } };
    const res = { send: jest.fn() };

// =========== Setting up Mock models ==========// 


  jest.mock('mongoose', () => ({

      models: jest.fn(),
      Schema: jest.fn(),
      model: jest.fn(),
      find: jest.fn()
    }));

// =========== Test Suite and Cases ======== //

describe('TransactionEnquiryAPI', () => {

  // ====== Unit Test ====== // 
  describe ('Unit Tests for processRoute', () => {

    test('processRoute sends transaction', async () => {

        jest.spyOn(transactionEnquiryController, "getOutcomeCode").mockImplementation(() => jest.fn());
        //mock collection_connection
        await transactionEnquiryController.processRoute(req1, res);
        
        expect(transactionEnquiryController.getOutcomeCode).toHaveBeenCalledTimes(1);
        expect(res.send).toHaveBeenCalledTimes(1);
      })

      test('processRoute returns correct values (id_list 1 item)', async () => {

        jest.spyOn(transactionEnquiryController, "getOutcomeCode").mockImplementation(() => jest.fn());
        //mock collection_connection
        const response = await transactionEnquiryController.processRoute(req1, res);
        
        expect(response).toEqual(['DBS', 'AirAsia', ['0000']])
      })

      test('processRoute returns correct values (id_list 2 items)', async () => {

        jest.spyOn(transactionEnquiryController, "getOutcomeCode").mockImplementation(() => jest.fn());
        //mock collection_connection
        const response = await transactionEnquiryController.processRoute(req2, res);
        
        expect(response).toEqual(['DBS', 'AirAsia', ['0000', '0001']])
      })

  })});
  

  describe ('NotificationAPI calls the correct controller', () =>{


    test ('NotificationAPI calls only sendEmail when notificationMethod is 0', async () => {

      jest.spyOn(emailNotification, "sendEmail").mockImplementation(() => jest.fn())
      jest.spyOn(messageNotification, "sendMessages").mockImplementation(() => jest.fn())
      await transactionEnquiryController.sendNotification('+6512345678', 'leelxuan@gmail.com', 0, 1000, 'DBS', 'AirAsia', 10000);

      expect(emailNotification.sendEmail).toHaveBeenCalledTimes(1);
      expect(messageNotification.sendMessages).toHaveBeenCalledTimes(0);
    }),

    test ('NotificationAPI calls only sendMessage when notificationMethod is 1', async () => {

      jest.spyOn(emailNotification, "sendEmail").mockImplementation(() => jest.fn())
      jest.spyOn(messageNotification, "sendMessages").mockImplementation(() => jest.fn())
      await transactionEnquiryController.sendNotification('+6512345678', 'leelxuan@gmail.com', 1, 1000, 'DBS', 'AirAsia', 10000);

      expect(emailNotification.sendEmail).toHaveBeenCalledTimes(1);
      expect(messageNotification.sendMessages).toHaveBeenCalledTimes(1);
    }),

    test ('NotificationAPI calls both when notificationMethod is 2', async () => {

      jest.spyOn(emailNotification, "sendEmail").mockImplementation(() => jest.fn())
      jest.spyOn(messageNotification, "sendMessages").mockImplementation(() => jest.fn())
      await transactionEnquiryController.sendNotification('+6512345678', 'leelxuan@gmail.com', 2, 1000, 'DBS', 'AirAsia', 10000);

      expect(emailNotification.sendEmail).toHaveBeenCalledTimes(2);
      expect(messageNotification.sendMessages).toHaveBeenCalledTimes(2);
    })
  })

  
  /*
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
  

// ============ getOutcomeCode Mock function =========== //

const mockOutcomeCodes =  [
    { outcomeCode: '0022', phoneNumber: '+6512345678', emailAddress: 'example@gmail.com', notificationMethod: 0, transferAmount: 10000, referenceNumber: '0000' },
  ];

        */