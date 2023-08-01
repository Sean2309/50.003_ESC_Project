require('dotenv').config({path: __dirname + '/../.env'});
const config = require('../utils/config');
const dateUtil = require('./date');
const mongoose = require('mongoose');
const sftpModel = require('../models/sftpModel');
const createCsvWriter = require('csv-writer').createObjectCsvWriter;
const Files = require('files.com/lib/Files').default;
const File = require('files.com/lib/models/File').default;
const { isBrowser } = require('files.com/lib/utils');
const path = require('path');
const fs = require('fs');
const csvParser = require('csv-parser');

if (!fs.existsSync('accrual_files')) {
  fs.mkdirSync('accrual_files');
}

function getFormattedDate(format = "standard") {
  const date = new Date();
  date.setDate(date.getDate() - 1); // Subtract a day if requested
  let month = date.getMonth() + 1; // getMonth() is zero-indexed
  let day = date.getDate();

  month = month < 10 ? '0' + month : month;
  day = day < 10 ? '0' + day : day;

  if (format === "compact") {
    return `${date.getFullYear()}${month}${day}`;
  } else { // "standard" format
    return `${date.getFullYear()}-${month}-${day}`;
  }
}

const writeCollectionsToCsv = async () => {
  mongoose.connect(config.mongoDBURL, { useNewUrlParser: true, useUnifiedTopology: true });

  const stringToday = dateUtil.getFormattedDate();

  for (const collection of config.mongoDBCollections) {
    const Model = mongoose.model(collection, sftpModel);

    try {
      const data = await Model.find(
        {
          outcomeCode: { $exists: false },
          transferDate: stringToday
        }
      );

      console.log('Data retrieved from ' + collection + ':', data);

      // Group by partnerCode
      const groups = data.reduce((acc, doc) => {
        (acc[doc.partnerCode] = acc[doc.partnerCode] || []).push(doc);
        return acc;
      }, {});

      for (const partnerCode in groups) {
        const csvWriter = createCsvWriter({
          path: path.join('accrual_files', `${collection}_${partnerCode}.csv`),
          header: [
            { id: 'membershipId', title: 'Membership ID' },
            { id: 'membershipName', title: 'Membership name' },
            { id: 'transferDate', title: 'Transfer date' },
            { id: 'transferAmount', title: 'Transfer Amount' },
            { id: 'referenceNumber', title: 'Reference number' },
            { id: 'partnerCode', title: 'Partner code' }
          ]
        });

        await csvWriter.writeRecords(groups[partnerCode]);

        console.log(`Data written to ${partnerCode}.csv`);
      }
    } catch (error) {
      console.error('An error occurred while handling collection ' + collection + ':', error);
    }
  }

  mongoose.connection.close();
}

const uploadFilesToServer = async () => {
  Files.setBaseUrl(config.kaligoURL);
  Files.setApiKey(config.kaligoAPIKey);

  const formattedDate = dateUtil.getFormattedDate("compact");

  // Loop through collections
  for (const collection of config.sftpCollections) {
    // Loop through partner codes within each collection
    const partnerCodes = fs.readdirSync('accrual_files')
      .filter(file => file.startsWith(`${collection}_`))
      .map(file => file.replace(`${collection}_`, '').replace('.csv', ''));

    for (const partnerCode of partnerCodes) {
      if (!isBrowser()) {
        try {
          const csvFilePath = path.join('accrual_files', `${collection}_${partnerCode}.csv`);

          await File.uploadFile(`/transfer_connect_sutd_case_study_2023/c4i1/Accrual/${collection}/${formattedDate}/${partnerCode}_ACCRUAL_${formattedDate}.csv`, csvFilePath, {mkdir_parents: true});
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

const clearAccrualFiles = () => {
  fs.readdirSync('accrual_files').forEach(file => fs.unlinkSync(path.join('accrual_files', file)));
}

const main = async () => {
  clearAccrualFiles();
  await writeCollectionsToCsv();
  await uploadFilesToServer();
};

main().catch(console.error);


const queryFromDBandUpload = async () =>{
  await writeCollectionsToCsv();
  await uploadFilesToServer();
}

module.exports.queryFromDBandUpload = queryFromDBandUpload;
module.exports.writeCollectionsToCsv = writeCollectionsToCsv;
