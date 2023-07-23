const transactionEnquiryController = require('../controllers/transactionEnquiryController').transactionEnquiryController;
const transactionEnquiryModel = require('../models/transactionEnquiryModel');
const sendMessagetoClient = require('../controllers/notificationSendingController').sendMessagetoClient;
const mongoose = require('mongoose');
const model = require('mongoose').model;
const axios = require('axios');
const WebSocket = require('ws');

const membershipId = '1230oij'

// =========== Setting up Mock models ==========// 

jest.mock('axios', () => ({
    get: jest.fn()
}))

jest.mock('mongoose', () => ({

    models: jest.fn(),
    Schema: jest.fn(),
    model: jest.fn()
}));

jest.mock('../utils/config', () => ({
    TRANSFER_CONNECT_API_URL: 'localhost',
    BANK_NAME: 'DBS'
}));

jest.mock('../models/transactionEnquiryModel', () => ({
    loyaltyprograms:['AirAsia']
}));


const clients = new Map().set('1234', {readyState: true});

// =========== Test Suite and Cases ======== //

  // ====== Unit Test ====== // 
  describe ('Unit Tests for makeApiRequest', () => {

    test('makeApiRequest does API call successfully', async () => {

        jest.spyOn(transactionEnquiryController, "startEnquiry").mockResolvedValueOnce();
        const logSpy = await jest.spyOn(global.console, 'log');

        await transactionEnquiryController.makeApiRequest(['0000'], 'AirAsia');
        
        expect(axios.get).toHaveBeenCalledTimes(1);
      }),

      test('makeApiRequest calls correct URL', async () => {

        jest.spyOn(transactionEnquiryController, "startEnquiry").mockResolvedValueOnce();
        const logSpy = await jest.spyOn(global.console, 'log');

        await transactionEnquiryController.makeApiRequest(['0000','0001'], 'AirAsia');
        
        expect(logSpy.mock.calls).toContainEqual(['localhost/transferconnect/check/DBS/AirAsia/0000,0001']);
        expect(axios.get).toHaveBeenCalledTimes(2);
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