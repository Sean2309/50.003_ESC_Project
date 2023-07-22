const LoyaltyProgramQueryModel = require('../models/loyaltyProgramQueryModel');
const CurrencyRateModel = require('../models/currencyRateModel');

class LoyaltyProgramQueryController {

 

  // constructor() {
  //   // Populate db with mock loyalty programs and currencyRates
  //   this.populateDb();
  // }
  
  getLoyaltyPrograms = async (request, response) => {

  

    // Grab partnerCode from path params
    const partnerCode = request.params.partnerCode;


    try {

      const loyaltyPrograms = await LoyaltyProgramQueryModel.find({}); // Fetch all loyaltyProgramProviders

      // Fetch the document correspond to the partnerCode, which contains a nested document of programIds and currencyRates specific to the bank
      const currencyRates = await CurrencyRateModel.findOne({ partnerCode: partnerCode });

      const currencyRatesArray = currencyRates.currencyRates;

      const loyaltyProgramsWithRates = [];

      for (const currencyRateObject of currencyRatesArray) {
        const { programId, currencyRate } = currencyRateObject;

        const loyaltyProgram = loyaltyPrograms.find(obj => obj.programId === programId);

        // add currencyRate key to document≠
        loyaltyProgram.set('currencyRate', currencyRate);

        loyaltyProgramsWithRates.push(loyaltyProgram);
      }

      response.status(200).json(loyaltyProgramsWithRates);

    }
    catch (error) {
      response.status(500).json({ message: error.message });
    }
  };



  

  // populateDb = async () => {
  //   const mockLoyaltyPrograms = [
  //     {
  //       programId: "GOPOINTS",
  //       programName: "GoJet Points",
  //       currencyName: "GoPoints",
  //       processingTime: "Instant",
  //       description: "Feel free to adjust this",
  //       enrollmentLink: "https://www.gojet.com/member/",
  //       tncLink: "https://www.gojet.com/aa/about-us/en/gb/terms-and-conditions.html",
  //       membershipFormat: "^\\d{9}[a-zA-Z]$",
  //     },
  //     {
  //       programId: "ASIAMILES",
  //       programName: "Asia Miles",
  //       currencyName: "Asia Miles",
  //       processingTime: "Instant",
  //       description: "Feel free to adjust this",
  //       enrollmentLink: "https://www.cathaypacific.com/cx/en_HK/membership/sign-up.html",
  //       tncLink: "https://www.cathaypacific.com/cx/en_HK/legal-and-privacy/data-privacy-and-security-policy.html",
  //       membershipFormat: "^\\d{11}$",
  //     }
  //   ];

  //   const mockCurrencyRates = {
  //     partnerCode: "DBSSG",
  //     currencyRates: [
  //       {
  //         programId: "GOPOINTS",
  //         currencyRate: 1.1
  //       },
  //       {
  //         programId: "ASIAMILES",
  //         currencyRate: 1
  //       }
  //     ]
  //   }

  // //   await LoyaltyProgramQueryModel.deleteMany({});

  //   await LoyaltyProgramQueryModel.create(mockLoyaltyPrograms);

  // //   await CurrencyRateModel.deleteMany({});

  //   await CurrencyRateModel.create(mockCurrencyRates);

  // }

}

const loyaltyProgramQueryController = new LoyaltyProgramQueryController();

module.exports = loyaltyProgramQueryController;