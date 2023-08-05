const loyaltyProgramsController = require('../../controllers/loyaltyProgramsController');
const LoyaltyPrograms = require('../../models/loyaltyPrograms');
const express = require('express');
const app = express();
const request = require('supertest');
const { default: mongoose } = require('mongoose');
const { MONGODB_URL, MONGODB_OPTIONS } = require('../../utils/config');

app.listen = jest.fn(() => ({
    close: jest.fn(),
  }));

app.get('/api/loyaltyPrograms', (req, res) => {
    res.json({ loyaltyPrograms: ['Program A', 'Program B'] });
  });


beforeAll(async () => {
  await mongoose.connect(MONGODB_URL, MONGODB_OPTIONS);

});


beforeEach(async () => {
  const MockLoyaltyProgramsModel = LoyaltyPrograms;
  await MockLoyaltyProgramsModel.deleteMany({});
});

afterEach(async () => {
  const MockLoyaltyProgramsModel = LoyaltyPrograms;
  await MockLoyaltyProgramsModel.deleteMany({});
  // try {
  //   await MockLoyaltyProgramsModel.collection.drop();
  // } catch (error) {}
});

describe('LoyaltyProgramsController - API Integration', () => {
    test('1. api/loyaltyPrograms should respond with 200 status code', async () => {
        const response = await request(app).get('/api/loyaltyPrograms');
        expect(response.status).toBe(200);
        expect(response.body).toHaveProperty('loyaltyPrograms');
        expect(response.body.loyaltyPrograms).toHaveLength(2);   
});





test('2. updateloyaltyprogram saves to db', async () => {
  const mockloyaltyProgramsPromise = Promise.resolve([
    {
    programId: "GOPOINTS",
    programName: "GoJet Points",
    currencyName: "GoPoints",
    processingTime: "Instant",
    description: "Feel free to adjust this",
    enrollmentLink: "https://www.gojet.com/member/",
    tncLink: "https://www.gojet.com/aa/about-us/en/gb/terms-and-conditions.html",
    membershipFormat: "^\\d{9}[a-zA-Z]$",
    },
  ]);
  jest.spyOn(require('axios'), 'get').mockResolvedValue({ data: mockloyaltyProgramsPromise });
  await loyaltyProgramsController.updateLoyaltyPrograms();
  const loyaltyPrograms = await LoyaltyPrograms.find({});
  expect(loyaltyPrograms).toHaveLength(1);
  jest.restoreAllMocks();

});

  });

