const express = require('express');
const app = express();
const request = require('supertest');


const mongoose = require('mongoose');
const { MONGODB_URL } = require('../../utils/config');

const LoyaltyProgramQueryModel = require('../../models/loyaltyProgramQueryModel');
const CurrencyRateModel = require('../../models/currencyRateModel');

const controller = require('../../controllers/loyaltyProgramQueryController');


beforeAll(async () => {
  await mongoose.connect(MONGODB_URL);
  await LoyaltyProgramQueryModel.deleteMany({});
  await CurrencyRateModel.deleteMany({});
});

beforeEach(async () => {
  await LoyaltyProgramQueryModel.deleteMany({});
  await CurrencyRateModel.deleteMany({});
 
});

afterEach(async() => {
  
  await LoyaltyProgramQueryModel.deleteMany({});
  await CurrencyRateModel.deleteMany({});
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
      controller.fetchLoyaltyProgramsWithRates = jest.fn().mockResolvedValue(mockLoyaltyProgramsWithRates);

     // Mock the app.get() method for 'DBSSG' partner code route 
     app.get('/api/loyaltyprograms/DBSSG', async (req, res) => {
      const loyaltyProgramsWithRates = await controller.fetchLoyaltyProgramsWithRates('DBSSG');
      res.json(loyaltyProgramsWithRates);
      });

      const partnerCode = 'DBSSG';
      const response = await request(app).get(`/api/loyaltyPrograms/${partnerCode}`);
      expect(response.status).toBe(200);
      expect(response.body).toEqual(mockLoyaltyProgramsWithRates);
    });

    test('should return 404 when invalid partnerCode is provided ', async () => {
      const partnerCode = 'DBSG';
      const response = await request(app).get(`/api/loyaltyPrograms/${partnerCode}`);
      expect(response.status).toBe(404);
      expect(response.body).toEqual({});
    });
  });

  describe('populateDb function', () => {
    test('should correctly insert mock data into database ', async () => {


      // Call the "populateDb" function
      await controller.populateDb();
        
      const loyaltyPrograms = await LoyaltyProgramQueryModel.find({}, '-__v -_id');

      //.lean() method converts Mongoose document class to plain Javascript Object
      const currencyRates = await CurrencyRateModel.findOne({}, '-__v -_id ').lean();
      currencyRates.currencyRates.forEach((cr) => delete cr._id);
  
      // Expected mock data for loyalty programs
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
  
      // Expected mock data for currency rates
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