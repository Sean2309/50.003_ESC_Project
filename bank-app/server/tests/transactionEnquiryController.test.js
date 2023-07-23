const transactionEnquiryController = require('../controllers/transactionEnquiryController').transactionEnquiryController;
const transactionEnquiryModel = require('../models/transactionEnquiryModel');
const sendMessagetoClient = require('../controllers/notificationSendingController').sendMessagetoClient;
const mongoose = require('mongoose');
const model = require('mongoose').model;
const axios = require('axios');
const WebSocket = require('ws');


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

jest.mock('ws', () => ({
    OPEN:true
}))

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



describe ('Unit tests for sendMessagetoClient', () => {

    test('sendMessagetoClient is sent succesfully', async () => {

        //jest.replaceProperty(WebSocket, 'OPEN', true)
        const logSpy = await jest.spyOn(global.console, 'log');
        await sendMessagetoClient(clients, '1234', '0000');

        expect(logSpy.mock.calls).toHaveBeenCalledWith('1234 websocket connection closed')

    
    })})
