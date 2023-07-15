const LoyaltyPrograms = require('../models/loyaltyPrograms');
const axios = require('axios');

class LoyaltyProgramsController {
  // easy debug GET
  getLoyaltyPrograms = async (request, response) => {
    try {
      const loyaltyPrograms = await LoyaltyPrograms.find();
      response.json({ loyaltyPrograms });
    } catch (error) {
      console.error(error);
      response.status(500).json({ error });
    }
  }

  // to populate db 
  populateDb = async () => {
    const mockLoyaltyPrograms = [
      {
        programID: "GOPOINTS",
        programName: "GoJet Points",
        currencyName: "GoPoints",
        processingTime: "Instant",
        description: "Feel free to adjust this",
        enrollmentLink: "https://www.gojet.com/member/",
        tncLink: "https://www.gojet.com/aa/about-us/en/gb/terms-and-conditions.html",
        membershipFormat: "9d1l",
        currencyRate: 1

      },
      {
        programID: "ASIAMILES",
        programName: "Asia Miles",
        currencyName: "Asia Miles",
        processingTime: "Instant",
        description: "Feel free to adjust this",
        enrollmentLink: "https://www.cathaypacific.com/cx/en_HK/membership/sign-up.html",
        tncLink: "https://www.cathaypacific.com/cx/en_HK/legal-and-privacy/data-privacy-and-security-policy.html",
        membershipFormat: "11d",
        currencyRate: 1.1
      }
    ]

    await LoyaltyPrograms.deleteMany({});

    await LoyaltyPrograms.create(mockLoyaltyPrograms);

  }

  // send GET request to transferConnect query API endpoint and store into db
  updateLoyaltyPrograms = async () => {
    try {
      const response = await axios.get('http://example.com/api/loyalty-programs');
      const data = response.data;

      await LoyaltyPrograms.deleteMany({});
      await LoyaltyPrograms.create(data);

      console.log('Data updated successfully');
      
      this.getLoyaltyPrograms();

    } catch (error) {
      console.error('Error updating data:', error);
    }
  }
}

const loyaltyProgramsController = new LoyaltyProgramsController();

module.exports = loyaltyProgramsController;


