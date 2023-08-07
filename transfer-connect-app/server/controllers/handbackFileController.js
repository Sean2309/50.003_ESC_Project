// Importing Modules
const mongoose = require('mongoose');
const fs = require(`fs`);
const csvParser = require(`csv-parser`);
const Files = require('files.com/lib/Files').default;
const File = require('files.com/lib/models/File').default;
const { isBrowser } = require('files.com/lib/utils');
const path = require('path');
const { CronJob } = require('cron');
const webhookController = require('./webhookController');
const accrualFileController = require('./accrualFileController');

// Importing Config Files + Schemas
require('dotenv').config({ path: __dirname + '/../.env' });
var config = require('../utils/config');
const transactionEnquiryModel = require('../models/transactionEnquiryModel');

// Importing Helper Functions
var getFormattedDate = require('./date').getFormattedDate;
var clearFolder = require('./clearFolder').clearFolder;
var convertDateFormat = require('./convertDateFormat').convertDateFormat;

// Creates the sftp_handback_downloads folder if it doesn't exist
for (const lp of config.collections) {
  const lpFolderPath = path.join(__dirname, `sftp_handback_downloads/${lp}`);
  if (!fs.existsSync(lpFolderPath)) {
    fs.mkdirSync(lpFolderPath);
  }
};

// Class for the Handback File Controller
class HandbackFileController {
  
  constructor() {
    this.formattedDate = getFormattedDate("compact"); // Example 20200823
    this.sftpHandbackDownloads = 'sftp_handback_downloads'; // SFTP Directory for the downloaded files to be stored in
    this.modelCache = {}; // Cache for storing the created models
    this.initializeBanks();
    // this.startService(); // Starts the Cron Job
  }

  startService = async () => {
    let job = new CronJob(
      '30 * * * * *', // Runs at the 30th Second of the 30th Minute of every hour
      this.downloadfromSFTPandUpload,
    )
    job.start();
  };


  downloadfromSFTPandUpload = async () => {
    console.log('handback file controller running')
    this.clearFolders();
    await this.retrieveFromServer(this.formattedDate);
    await this.uploadFilesToMongoDB(this.formattedDate);
    console.log('handback file controller done');
  }

  testHandbackFileFns = async () => {
    // This is a test function, with a fixed date for demonstration purposes
    // Dates
    const testDate = `20200812`;

    // Running the functions
    this.clearFolders();
    await this.retrieveFromServer(testDate);

    await this.uploadFilesToMongoDB(testDate);
    console.log('handback file controller done');
  };

  async initializeBanks() {
    try {
      this.banks = await accrualFileController.getPartnerCodes();
    } catch (error) {
    }
  }


  // Function that compares the existing model with the new one. If needed, it will replace the existing model with the new one
  getModelForLP = (loyaltyProgram) => {
    if (!this.modelCache[loyaltyProgram]) {
      const model = mongoose.models[loyaltyProgram] || mongoose.model(loyaltyProgram, transactionEnquiryModel);
      this.modelCache[loyaltyProgram] = model;
    }
    return this.modelCache[loyaltyProgram];
  };

  // =========== START OF MAIN FUNCTIONS ======================
  clearFolders = async () => {
    /*
    Functionalities:
    - iteratively clears the sftp_handback_downloads folder
    */
    for (const lp of config.collections) {
      clearFolder(`${this.sftpHandbackDownloads}/${lp}`);
    };
  };

  retrieveFromServer = async (targetDate) => {
    /*
    Functionalities:
    - retrieves the handback files from the SFTP server
    - stores the files in the sftp_handback_downloads folder
    */
    let fileName;
    for (const lp of config.collections) {
      // Config Details
      Files.setBaseUrl(config.kaligoURL);
      Files.setApiKey(config.kaligoAPIKey);
      // Downloading the handback file from the server
      // console.log("Retrieving the files from the SFTP server");
      for (const bank of this.banks) {
        fileName = `${bank}_HANDBACK_${targetDate}.csv`;
        const foundFile = await File.find(`/transfer_connect_sutd_case_study_2023/c4i1/Handback/${lp}/${fileName}`, { mkdir_parents: true });
        const downloadableFile = await foundFile.download();

        if (!isBrowser()) {
          // Download to a file on disk
          await downloadableFile.downloadToFile(path.join(__dirname, `${this.sftpHandbackDownloads}/${lp}/${fileName}`));
        };
      };
    };
  };

  extractDataFromCsv = async (filePath) => {
    /*
    Functionalities:
    -extracts data from the downloaded handback csv files
    -returns the extracted data in json format
    */

    return new Promise((resolve, reject) => {
      // Parses the string to extract partnerCode data
      const str1 = filePath.split('\\');
      const splitStr = str1[str1.length - 1].split(/_/);
      const partnerCode = splitStr[0];

      const results = []; // List to store the dictionaries

      fs.createReadStream(filePath)
        .pipe(csvParser())
        .on('data', (data) => {
          /*
          Reformatting of outcome code
          -outcome codes are stored as strings with quotes around them e.g '"0001"'
          -removes the quotation marks from the outcome code
          '"0001"' -> '0001'
          -this standardises the format of String data being added to the MongoDB
          */
          if (data['Outcome Code'] && data['Outcome Code'].startsWith('"') && data['Outcome Code'].endsWith('"')) {
            data['Outcome Code'] = data['Outcome Code'].slice(1, -1);
          };

          // Pushing the whole result
          results.push(data);
        })
        .on('end', () => {
          resolve([partnerCode, results]);
        })
        .on(`error`, (error) => {
          reject(error);
        })
    });
  };

  uploadFilesToMongoDB = async (targetDate) => {
    /*
    Functionalities:
    -receives extracted data from the csv in the variable results
    -updates the MongoDB with the data iteratively, row by row
    -finds the document with matching referenceNumber + transferDate
    -updates the document with the new data
    */
    for (const lp of config.collections) {
      for (let i = 0; i < this.banks.length; i++) {
        const filePath = path.join(__dirname, `${this.sftpHandbackDownloads}/${lp}/${this.banks[i]}_HANDBACK_${targetDate}.csv`);
        try {
          const [partnerCodeOut, results] = await this.extractDataFromCsv(filePath);     
          const Model = mongoose.model(lp, transactionEnquiryModel, lp);
          console.log('received result: ', results)

          for (const result of results) {
            
            let mappedResult = {
              transferDate: result['Transfer date'],
              partnerCode: partnerCodeOut,
              systemId: result['System Id'],
              outcomeCode: result['Outcome Code'],
              transferAmount: parseInt(result['Transfer Amount']),
            };
            // console.log('mapped results: ', mappedResult)
            
            let doc = await Model.findOne({
              $and: [
                { systemId: mappedResult.systemId },
                { transferDate: mappedResult.transferDate }]
              }); // Must match the referenceNumber and transferDate to update
            if (doc) {
              // console.log('doc: ', doc)
              doc.set(mappedResult);
              await doc.save();
              // if (partnerCodeOut == "DBSSG"){
              //   webhookController.processRoute(mappedResult.systemId, partnerCodeOut, mappedResult.transferAmount, lp);
              // };
            } else {
              await Model.create(mappedResult);
            }
          }
        } catch (error) {
          // console.log(error);
        }
        };
      };
    };
  };
  // END OF MAIN FUNCTIONS ======================

const handbackFileController = new HandbackFileController();

module.exports = handbackFileController;