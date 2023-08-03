// Importing Modules
const mongoose = require('mongoose');
const fs = require(`fs`);
const csvParser = require(`csv-parser`);
const Files = require('files.com/lib/Files').default;
const File = require('files.com/lib/models/File').default;
const { isBrowser } = require('files.com/lib/utils');
const path = require('path');
const { CronJob } = require('cron');

// Importing Config Files + Schemas
require('dotenv').config({ path: __dirname + '/../.env' });
var config = require('../utils/config');
const transactionEnquiryModel = require('../models/transactionEnquiryModel');

// Importing Helper Functions
var getFormattedDate = require('./date').getFormattedDate;
var clearFolder = require('./clearFolder').clearFolder;
var convertDateFormat = require('./convertDateFormat').convertDateFormat;

// Creates the sftp_handback_downloads folder if it doesn't exist
if (!fs.existsSync(path.join(__dirname, 'sftp_handback_downloads'))) {
  fs.mkdirSync(path.join(__dirname, 'sftp_handback_downloads'));
}

// Class for the Handback File Controller
class HandbackFileController {

  constructor() {
    this.formattedDate = getFormattedDate("compact"); // Example 20200823
    this.sftpHandbackDownloads = 'sftp_handback_downloads'; // SFTP Directory for the downloaded files to be stored in
    this.modelCache = {}; // Cache for storing the created models

    this.startService(); // Starts the Cron Job
  }

  startService = async () => {
    let job = new CronJob(
      '30 30 * * * *', // Runs at the 30th Second of the 30th Minute of every hour
      this.downloadfromSFTPandUpload,
    )
    job.start();
  }


  downloadfromSFTPandUpload = async () => {
    clearFolder(this.sftpHandbackDownloads);
    await this.retrieveFromServer(this.formattedDate);
    await this.uploadFilesToMongoDB(this.formattedDate);
  }

  testHandbackFileFns = async () => {
    // This is a test function, with a fixed date for demonstration purposes
    // Dates
    const testDate = `20200812`;

    // Running the functions
    clearFolder(this.sftpHandbackDownloads);
    await this.retrieveFromServer(testDate);

    await this.uploadFilesToMongoDB(testDate);
    console.log("Done!");
  };

  // Function that compares the existing model with the new one. If needed, it will replace the existing model with the new one
  getModelForLP = (loyaltyProgram) => {
    if (!this.modelCache[loyaltyProgram]) {
      const model = mongoose.models[loyaltyProgram] || mongoose.model(loyaltyProgram, transactionEnquiryModel);
      this.modelCache[loyaltyProgram] = model;
    }
    return this.modelCache[loyaltyProgram];
  };

  // =========== START OF MAIN FUNCTIONS ======================
  retrieveFromServer = async (targetDate) => {
    /*
    Functionalities:
    - retrieves the handback files from the SFTP server
    - stores the files in the sftp_handback_downloads folder
    */
    let fileName;
    for (const collection of config.sftpCollections) {
      // Config Details
      Files.setBaseUrl(config.kaligoURL);
      Files.setApiKey(config.kaligoAPIKey);
      // Downloading the handback file from the server
      console.log("Retrieving the files from the SFTP server");

      fileName = `${collection}_HANDBACK_${targetDate}.csv`;
      const foundFile = await File.find(`/transfer_connect_sutd_case_study_2023/c4i1/Handback/${collection}/${fileName}`, { mkdir_parents: true });
      const downloadableFile = await foundFile.download();

      if (!isBrowser()) {
        // Download to a file on disk
        await downloadableFile.downloadToFile(path.join(__dirname, `${this.sftpHandbackDownloads}/${fileName}`));
        console.log(`File ${fileName} downloaded!\n`);
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
          console.log(`Extracted Data:`, results);
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

    for (let i = 0; i < config.sftpCollections.length; i++) {
      const filePath = path.join(__dirname, `${this.sftpHandbackDownloads}/${config.sftpCollections[i]}_HANDBACK_${targetDate}.csv`);
      try {
        const [partnerCode, results] = await this.extractDataFromCsv(filePath);
        const Model = this.getModelForLP(config.mongoDBCollections[i]);
        for (const result of results) {
          let mappedResult = {
            transferDate: convertDateFormat(result['Transfer date']),
            partnerCode: partnerCode,
            referenceNumber: result['Reference number'],
            outcomeCode: result['Outcome Code'],
            transferAmount: parseInt(result['Transfer Amount']),
          };

          let doc = await Model.findOne({
            $and: [{ referenceNumber: mappedResult.referenceNumber },
            { transferDate: mappedResult.transferDate }]
          }); // Must match the referenceNumber and transferDate to update
          if (doc) {
            doc.set(mappedResult);
            console.log(`Data uploaded: `, doc)
            await doc.save();
          } else {
            const newModel = await Model.create(mappedResult);
            console.log(`new model: `, newModel)
          }
        }

        // console.log(`Data updated for ${partnerCode} successfully\n`);
      } catch (error) {
        console.log(error);
      }
    }

  };
  // END OF MAIN FUNCTIONS ======================

}

const handbackFileController = new HandbackFileController();

module.exports = handbackFileController;