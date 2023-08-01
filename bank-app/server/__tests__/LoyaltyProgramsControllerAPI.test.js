const axios = require('axios');
const loyaltyProgramsController = require('../controllers/loyaltyProgramsController');
const LoyaltyPrograms = require('../models/loyaltyPrograms');
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const app = express();


// Mock Axios to simulate the HTTP GET request/response
jest.mock('axios');

// =========== Test Suite and Cases ======== //
describe('LoyaltyProgramsController - API Integration', () => {
    test('http://localhost:3001/api/loyaltyPrograms should respond with 200 status code', async () => {
        const mockedResponseData = [
            {
                programId: "GOPOINTS",
                programName: "GoJet Points",
                currencyName: "GoPoints",
                processingTime: "Instant",
                description: "Feel free to adjust this",
                enrollmentLink: "https://www.gojet.com/member/",
                tncLink: "https://www.gojet.com/aa/about-us/en/gb/terms-and-conditions.html",
                membershipFormat: "^\\d{9}[a-zA-Z]$",
                currencyRate: 1
            },
            
          ];
          axios.get.mockResolvedValue({ data: mockedResponseData, status: 200 });
      
          // Make the actual HTTP GET request using axios
          const response = await axios.get('http://localhost:3001/api/loyaltyPrograms');
      
          // Check if the response status code is 200
          expect(response.status).toBe(200);
    
});
  });