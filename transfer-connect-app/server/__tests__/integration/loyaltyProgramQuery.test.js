const express = require('express');
const app = express();
const request = require('supertest');
const mongoose = require('mongoose');
const { MONGODB_OPTIONS } = require('../../utils/config');
const LoyaltyProgramQueryModel = require('../../models/loyaltyProgramQueryModel');
const CurrencyRateModel = require('../../models/currencyRateModel');
const controller = require('../../controllers/loyaltyProgramQueryController');
const MONGODB_URL="mongodb+srv://user1:1234@cluster0.5iybncp.mongodb.net/TESTDB?retryWrites=true&w=majority";


beforeAll(async () => {
  await mongoose.connect(MONGODB_URL, MONGODB_OPTIONS);
});

beforeEach(async () => {
  await LoyaltyProgramQueryModel.deleteMany({});
  await CurrencyRateModel.deleteMany({});
})

afterEach(async() => {
  jest.clearAllMocks(); // Reset mocked functions before each test
});

describe('LoyaltyProgramQueryController', () => {
  describe('GET /api/loyaltyprograms/:partnerCode', () => {
    test('should return 200 when valid partner code is provided', async () => {
      // Mock data
      const mockLoyaltyProgramsWithRates = [
        {
          programId: 'GOPOINTS',
          programName: 'GoJet Points',
          currencyName: 'GoPoints',
          processingTime: 'Instant',
          description: 'Feel free to adjust this',
          enrollmentLink: 'https://www.gojet.com/member/',
          tncLink: 'https://www.gojet.com/aa/about-us/en/gb/terms-and-conditions.html',
          membershipFormat: '^\\d{9}[a-zA-Z]$',
          currencyRate: 1.1,
        },
        {
          programId: 'ASIAMILES',
          programName: 'Asia Miles',
          currencyName: 'Asia Miles',
          processingTime: 'Instant',
          description: 'Feel free to adjust this',
          enrollmentLink: 'https://www.cathaypacific.com/cx/en_HK/membership/sign-up.html',
          tncLink: 'https://www.cathaypacific.com/cx/en_HK/legal-and-privacy/data-privacy-and-security-policy.html',
          membershipFormat: '^\\d{11}$',
          currencyRate: 1,
        },
      ];

      // Promise resolved with mock data when fetchLoyaltyProgramsWithRates() called
      controller.fetchLoyaltyProgramsWithRates = jest.fn().mockResolvedValue(mockLoyaltyProgramsWithRates);

     // mocked response for GET request 
     app.get('/api/loyaltyprograms/DBSSG', async (req, res) => {
      const loyaltyProgramsWithRates = await controller.fetchLoyaltyProgramsWithRates('DBSSG');
      res.json(loyaltyProgramsWithRates);
      });

      // make GET request 
      const partnerCode = 'DBSSG';
      const response = await request(app).get(`/api/loyaltyPrograms/${partnerCode}`);

      //Assertions 
      expect(response.status).toBe(200);
      expect(response.body).toEqual(mockLoyaltyProgramsWithRates);
    });

    test('should return 404 when invalid partnerCode is provided ', async () => {
      // GET request with invalid partner code 
      const partnerCode = 'Invalid';
      const response = await request(app).get(`/api/loyaltyPrograms/${partnerCode}`);

      //Assertions 
      expect(response.status).toBe(404);
      expect(response.body).toEqual({});
    });
  });

  describe('populateDb function', () => {
    test('should correctly insert mock data into database ', async () => {


      // Call populateDb()
      await controller.populateDb();
      
      // ====== Data Retrieval and Data Cleaning ===== // 

      // retrieve all documents and remove '__v' & '_id' fields 
      const loyaltyPrograms = await LoyaltyProgramQueryModel.find({}, '-__v -_id');

      // retrieve single document and remove '__v' & '_id' fields 
      // .lean() method converts Mongoose document class to plain Javascript Object
      const currencyRates = await CurrencyRateModel.findOne({}, '-__v -_id ').lean();
      // iterate through JS object and remove _.id field
      currencyRates.currencyRates.forEach((cr) => delete cr._id);
  

      // Mock data for assertions 
      const expectedLoyaltyPrograms = [
        {
          programId: 'GOPOINTS',
          programName: 'GoJet Points',
          currencyName: 'GoPoints',
          processingTime: 'Instant',
          description: 'Feel free to adjust this',
          enrollmentLink: 'https://www.gojet.com/member/',
          tncLink: 'https://www.gojet.com/aa/about-us/en/gb/terms-and-conditions.html',
          membershipFormat: '^\\d{9}[a-zA-Z]$',
        },
        {
          programId: 'ASIAMILES',
          programName: 'Asia Miles',
          currencyName: 'Asia Miles',
          processingTime: 'Instant',
          description: 'Feel free to adjust this',
          enrollmentLink: 'https://www.cathaypacific.com/cx/en_HK/membership/sign-up.html',
          tncLink: 'https://www.cathaypacific.com/cx/en_HK/legal-and-privacy/data-privacy-and-security-policy.html',
          membershipFormat: '^\\d{11}$',
        },
      ];
      const expectedCurrencyRates = {
        partnerCode: 'DBSSG',
        currencyRates: [
          {
            programId: 'GOPOINTS',
            currencyRate: 1.1,
          },
          {
            programId: 'ASIAMILES',
            currencyRate: 1,
          },
        ],
      }

      // Assertions
      expect(loyaltyPrograms).toEqual(expect.arrayContaining(expectedLoyaltyPrograms.map(obj => expect.objectContaining(obj))));
      expect(currencyRates).toEqual(expect.objectContaining(expectedCurrencyRates))
    });
});
});