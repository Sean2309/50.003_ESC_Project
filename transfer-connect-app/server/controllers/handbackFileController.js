// Importing files/modules
require('dotenv').config({ path: __dirname + '/../.env' });
const transactionEnquiryModel = require('../models/transactionEnquiryModel');
const mongoose = require('mongoose');
const fs = require(`fs`);
const csvParser = require(`csv-parser`);
const Files = require('files.com/lib/Files').default;
const File = require('files.com/lib/models/File').default;
const { isBrowser } = require('files.com/lib/utils');
const path = require('path');
var getFormattedDate = require('./date').getFormattedDate;
var clearFolder = require('./clearFolder').clearFolder;
var convertDateFormat = require('./convertDateFormat').convertDateFormat;
var config = require('../utils/config');
const { CronJob } = require('cron');

// Creates the sftp_handback_downloads folder if it doesn't exist
if (!fs.existsSync(path.join(__dirname, 'sftp_handback_downloads'))) {
  fs.mkdirSync(path.join(__dirname, 'sftp_handback_downloads'));
}

class HandbackFileController {

  constructor() {
    this.formattedDate = getFormattedDate("compact");
    // SFTP Downloads Folder Name
    this.sftpHandbackDownloads = 'sftp_handback_downloads';
    // Cache for storing the created models
    this.modelCache = {};
    this.testMongoDBURL = 'mongodb+srv://tengtjinyang:zagNwPsta2HHTyfE@transferconnect.0papjri.mongodb.net/TransferConnectDB';

    this.startService();
  }

  startService = async () => {
    let job = new CronJob(
      '30 30 * * * *',
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
    // Defining Variables
    // Dates
    const testDate = `20200812`;

    // Running the functions
    clearFolder(this.sftpHandbackDownloads);
    await this.retrieveFromServer(testDate);

    await this.uploadFilesToMongoDB(testDate);
    console.log("Done!");
  };

  // Function to get the model for a given Loyalty Program
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
    This function retrieves the handback files from the SFTP server
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
    Function tasks:
    1) extracts data from the downloaded handback csv files
    2) generates a random outcome code for each 
   
    */

    return new Promise((resolve, reject) => {

      const str1 = filePath.split('\\');
      const splitStr = str1[str1.length - 1].split(/_/);
      const partnerCode = splitStr[0];

      const results = []; // List to store the dictionaries

      fs.createReadStream(filePath)
        .pipe(csvParser())
        .on('data', (data) => {
          // Extracting outcome code
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

    for (let i = 0; i < config.sftpCollections.length; i++) {
      const filePath = path.join(__dirname, `${this.sftpHandbackDownloads}/${config.sftpCollections[i]}_HANDBACK_${targetDate}.csv`);
      try {
        const [partnerCode, results] = await this.extractDataFromCsv(filePath);
        // console.log(`Extracting data from ${partnerCode} Handback File`);
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