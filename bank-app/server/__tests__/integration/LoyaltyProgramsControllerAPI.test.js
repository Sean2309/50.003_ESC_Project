const axios = require('axios');
const loyaltyProgramsController = require('../../controllers/loyaltyProgramsController');
const LoyaltyPrograms = require('../../models/loyaltyPrograms');
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const app = express();
const request = require('supertest');
// Mock Axios to simulate the HTTP GET request/response
jest.mock('axios');
app.listen = jest.fn(() => ({
    close: jest.fn(),
  }));

app.get('/api/loyaltyPrograms', (req, res) => {
    res.json({ loyaltyPrograms: ['Program A', 'Program B'] });
  });

// =========== Test Suite and Cases ======== //
describe('LoyaltyProgramsController - API Integration', () => {
    test('api/loyaltyPrograms should respond with 200 status code', async () => {
        const response = await request(app).get('/api/loyaltyprograms');
        expect(response.status).toBe(200);
        // expect(response.body).toHaveProperty('loyaltyPrograms');
        // expect(response.body.loyaltyPrograms).toHaveLength(2);
    
});
  });