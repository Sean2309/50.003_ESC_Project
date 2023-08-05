const axios = require('axios');
const cron = require('node-cron');
const LoyaltyPrograms = require('../models/loyaltyPrograms');
const { PARTNERCODE } = require('../utils/config');

class LoyaltyProgramsController {
  constructor() {
    // cron scheduler to do a GET request from TransferConnect daily at 12am
    cron.schedule('0 0 * * *', () => {
      this.updateLoyaltyPrograms();
    });

    this.populateDb();
  }

  getLoyaltyPrograms = async (request, response) => {
    try {
      const loyaltyPrograms = await LoyaltyPrograms.find();
      response.json({ loyaltyPrograms });
    } catch (error) {
      response.status(500).json({ error });
    }
  };

  // to populate db
  populateDb = async () => {
    const mockLoyaltyPrograms = [
      {
        programId: 'GOPOINTS',
        programName: 'GoJet Points',
        currencyName: 'GoPoints',
        processingTime: 'Instant',
        description: 'Feel free to adjust this',
        enrollmentLink: 'https://www.gojet.com/member/',
        tncLink: 'https://www.gojet.com/aa/about-us/en/gb/terms-and-conditions.html',
        membershipFormat: '^\\d{9}[a-zA-Z]$',
        currencyRate: 1,
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
        currencyRate: 1.1,
      },
    ];

    await LoyaltyPrograms.deleteMany({});

    await LoyaltyPrograms.create(mockLoyaltyPrograms);
  };

  // send GET request to transferConnect query API endpoint and store into db
  updateLoyaltyPrograms = async () => {

    try {
      const response = await axios.get(`http://localhost:3003/api/loyaltyprograms/${PARTNERCODE}`);
      const { data } = response;

      await LoyaltyPrograms.deleteMany({});
      await LoyaltyPrograms.create(data);

    } catch (error) {
      // TODO: try again by rescheduling?

    }
  };
}

const loyaltyProgramsController = new LoyaltyProgramsController();

module.exports = loyaltyProgramsController;
