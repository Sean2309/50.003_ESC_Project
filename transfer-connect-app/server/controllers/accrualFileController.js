require('dotenv').config({ path: __dirname + '/../.env' });
const config = require('../utils/config');
const dateUtil = require('./date');
const mongoose = require('mongoose');
const transactionSchema = require('../models/transactionEnquiryModel');
const createCsvWriter = require('csv-writer').createObjectCsvWriter;
const Files = require('files.com/lib/Files').default;
const File = require('files.com/lib/models/File').default;
const { isBrowser } = require('files.com/lib/utils');
const path = require('path');
const fs = require('fs');
const { CronJob } = require('cron');
const clearFolder = require('./clearFolder').clearFolder;

// Define the directory where accrual files will be stored
const accrual_files_dir = path.join(__dirname, 'accrual_files');

// Check and create the directory if it doesn't exist
if (!fs.existsSync(accrual_files_dir)) {
  fs.mkdirSync(accrual_files_dir);
}

class AccrualFileController {
  constructor() {
    // Initialization can be done here if needed
    this.startService();

  }
  // Schedules the main function to run at a specific interval using Cro
  startService = async () => {
    let job = new CronJob(
      '* * 0 * * *',
      this.queryFromDBandUpload,
    )

    job.start();
  }


  // Retrieves the Mongoose model based on the given collection name
  getModel = (collection) => mongoose.model(collection, transactionSchema, collection);

  // Fetches data from the MongoDB collection based on certain filters
  getDataFromCollection = async (Model, stringToday) => {
    return Model.find({
      outcomeCode: { $exists: false },
      transferDate: stringToday
    });
  }

  // Organizes the fetched data by the partnerCode attribute
  groupData = (data) => {
    return data.reduce((acc, doc) => {
      let partnerCode = doc.partnerCode;
      (acc[partnerCode] = acc[partnerCode] || []).push(doc);
      return acc;
    }, {});
  }

  // Retrieves all partner codes from the database collections
  getPartnerCodes = async () => {
    let partnerCodes = [];
    const stringToday = dateUtil.getFormattedDate();
    
    // Iterate over each collection, fetch and group data
    for (const collection of config.collections) {
      const Model = this.getModel(collection);
      const data = await this.getDataFromCollection(Model, stringToday);
      const groups = this.groupData(data);
      
      // Aggregate partner codes
      partnerCodes = [...partnerCodes, ...Object.keys(groups)];
    }
    
    // Return unique partner codes
    return [...new Set(partnerCodes)];
  }

  // Writes the grouped data into separate CSV files
  writeGroupedDataToCsv = async (groups, collection) => {
    // Iterate over each partner code and write data to CSV
    for (const partnerCode in groups) {
      const csvWriter = createCsvWriter({
        path: path.join(accrual_files_dir, `${collection}_${partnerCode}.csv`),
        header: [
          { id: 'membershipId', title: 'Membership ID' },
          { id: 'memberName', title: 'Member name' },
          { id: 'transferDate', title: 'Transfer date' },
          { id: 'transferAmount', title: 'Transfer Amount' },
          { id: 'systemId', title: 'System Id' },
          { id: 'partnerCode', title: 'Partner code' }
        ]
      });
      await csvWriter.writeRecords(groups[partnerCode]);
    }
  }

  // Iterates over collections and writes data to CSV
  writeCollectionsToCsv = async () => {
    const stringToday = dateUtil.getFormattedDate();

    for (const collection of config.collections) {
      const Model = this.getModel(collection);
      const data = await this.getDataFromCollection(Model, stringToday);
      const groups = this.groupData(data);
      await this.writeGroupedDataToCsv(groups, collection);
    }
  }

  // Uploads the generated CSV files to a server
  uploadFilesToServer = async () => {
    // Set the server's base URL and API key
    Files.setBaseUrl(config.kaligoURL);
    Files.setApiKey(config.kaligoAPIKey);

    const formattedDate = dateUtil.getFormattedDate("compact");

    const collectionMap = {};
    config.collections.forEach((collection, index) => {
      collectionMap[collection] = config.collections[index];
    });

    // Iterate over each collection and its partner codes to upload files
    for (const collection of config.collections) {
      // Loop through partner codes within each collection
      const partnerCodes = fs.readdirSync(accrual_files_dir)
        .filter(file => file.startsWith(`${collection}_`))
        .map(file => file.replace(`${collection}_`, '').replace('.csv', ''));

      for (const partnerCode of partnerCodes) {
        if (!isBrowser()) {
          try {
            const csvFilePath = path.join(accrual_files_dir, `${collection}_${partnerCode}.csv`);
            const directoryName = collectionMap[collection];

            await File.uploadFile(`/transfer_connect_sutd_case_study_2023/c4i1/Accrual/${directoryName}/${partnerCode}_ACCRUAL_${formattedDate}.csv`, csvFilePath, { mkdir_parents: true });
            // console.log('File uploaded successfully.');
          } catch (error) {
            // console.error('An error occurred while uploading file for collection ' + collection + ':', error);
          }
        } else {
          // console.log('File upload skipped because it is running in a browser environment.');
        }
      }
    }
  }

  // Main function that orchestrates the process of fetching, writing, and uploading data
  queryFromDBandUpload = async () => {
    console.log('accrual file controller running')
    await clearFolder('accrual_files');
    await this.writeCollectionsToCsv();
    await this.uploadFilesToServer();
    var partnerCodeList = await this.getPartnerCodes();
    while (partnerCodeList.length == 0) {
      // console.log('didnt get filled partner code')
      partnerCodeList = await this.getPartnerCodes();
    };
    console.log('accrual file controller done');
    return partnerCodeList;
  }

}

const accrualFileController = new AccrualFileController();

module.exports = accrualFileController;

