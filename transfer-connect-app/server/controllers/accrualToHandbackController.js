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

const accrual_files_dir = path.join(__dirname, 'accrual_to_handback_files');
if (!fs.existsSync(accrual_files_dir)) {
  fs.mkdirSync(accrual_files_dir);
}

class AccrualToHandbackController {
  constructor() {
    // this.startService();

  }
  startService = async () => {
    let job = new CronJob(
      '30 * * * * *',
      this.queryFromDBandUpload,
    )

    job.start();
  }

  // Helper function to generate random outcome code
  genRandOutcomeCode = async (data) => {
    const outcomeCodeList = ['"0000"', '"0001"', '"0002"', '"0003"', '"0004"', '"0005"', '"0099"'];
    for (let row of data) {
      const randOutcomeCode = outcomeCodeList[Math.floor(Math.random() * outcomeCodeList.length)];
      row['outcomeCode'] = randOutcomeCode;
    };
    return data;
  };

  // Helper function to get a Mongoose model by collection name
  getModel = (collection) => mongoose.model(collection, transactionSchema, collection);

  // Helper function to get data from a MongoDB collection
  getDataFromCollection = async (Model, stringToday) => {
    return Model.find({
      outcomeCode: { $exists: false },
      transferDate: stringToday
    });
  }

  // Helper function to group data by partnerCode
  groupData = (data) => {
    return data.reduce((acc, doc) => {
      let partnerCode = doc.partnerCode;
      (acc[partnerCode] = acc[partnerCode] || []).push(doc);
      return acc;
    }, {});
  }


  // Helper function to write grouped data to CSV
  writeGroupedDataToCsv = async (groups, collection) => {
    for (const partnerCode in groups) {
      const csvWriter = createCsvWriter({
        path: path.join(accrual_files_dir, `${collection}_${partnerCode}.csv`),
        header: [
          { id: 'transferDate', title: 'Transfer date' },
          { id: 'transferAmount', title: 'Transfer Amount' },
          { id: 'systemId', title: 'System Id' },
          { id: 'outcomeCode', title: 'Outcome Code' }
        ]
      });
      await csvWriter.writeRecords(groups[partnerCode]);
    }
  }

  // Main function to write collections to CSV
  writeCollectionsToCsv = async () => {
    mongoose.connect('mongodb+srv://user1:1234@cluster0.5iybncp.mongodb.net/TransferConnectDB?retryWrites=true&w=majority', { useNewUrlParser: true, useUnifiedTopology: true}).catch((err) => console.error('error'));
    const stringToday = dateUtil.getFormattedDate();

    for (const collection of config.collections) {
      const Model = this.getModel(collection);
      const data = await this.getDataFromCollection(Model, stringToday);
      console.log('Data retrieved from ' + collection + ':', data);
      const newData = await this.genRandOutcomeCode(data);
      console.log('new data: ', newData)
      const groups = this.groupData(newData);
      await this.writeGroupedDataToCsv(groups, collection);
    }
  }

  uploadFilesToServer = async () => {
    Files.setBaseUrl(config.kaligoURL);
    Files.setApiKey(config.kaligoAPIKey);

    const formattedDate = dateUtil.getFormattedDate("compact");

    const collectionMap = {};
    config.collections.forEach((collection, index) => {
      collectionMap[collection] = config.collections[index];
    });

    // Loop through collections
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

            await File.uploadFile(`/transfer_connect_sutd_case_study_2023/c4i1/Handback/${directoryName}/${partnerCode}_HANDBACK_${formattedDate}.csv`, csvFilePath, { mkdir_parents: true });
            console.log('File uploaded successfully.');
          } catch (error) {
            console.error('An error occurred while uploading file for collection ' + collection + ':', error);
          }
        } else {
          console.log('File upload skipped because it is running in a browser environment.');
        }
      }
    }
  }

  clearAccrualFiles = () => {
    try {
      fs.readdirSync(accrual_files_dir).forEach(file => fs.unlinkSync(path.join(accrual_files_dir, file)));
    }
    catch (error) {
      // No files, just ignore error
    }
  }

  queryFromDBandUpload = async () => {
    
    await this.clearAccrualFiles();
    await this.writeCollectionsToCsv();
    await this.uploadFilesToServer();
  }

}

const accrualToHandbackController = new AccrualToHandbackController();
module.exports = accrualToHandbackController;

