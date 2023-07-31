// Importing files/modules
require('dotenv').config({path: __dirname + '/../.env'});
const sftpModel = require('../models/sftpModel');
const mongoose = require('mongoose');
const fs = require(`fs`);
const csvParser = require(`csv-parser`);
const Files = require('files.com/lib/Files').default;
const File = require('files.com/lib/models/File').default;
const { isBrowser } = require('files.com/lib/utils');
const path  = require('path');
var getFormattedDate = require('./date').getFormattedDate;

// Defining Collection Names
const mongoLPList = [`dbssgs`, `qflyers`, `gojets`]; // TODO: Use only one list and transform the other to match 
const sftpLPList = ['DBSSG', `QFlyers`, `GoJets`];
const testDate = `20200812`; 
const formattedDate = getFormattedDate("compact");

// Cache for storing the created models
const modelCache = {};

// Function to get the model for a given LP
const getModelForLP = (loyaltyProgram) => {
  if (!modelCache[loyaltyProgram]) {
    const model = mongoose.models[loyaltyProgram] || mongoose.model(loyaltyProgram, sftpModel);
    modelCache[loyaltyProgram] = model;
  }
  return modelCache[loyaltyProgram];
};


// START OF MAIN FUNCTIONS ======================
const retrieveFromServer = async(targetDate) => {
  let fileName;
  for (const lp of sftpLPList ) {
    // Config Details
    Files.setBaseUrl('https://kaligo.files.com');
    Files.setApiKey('d823bcf8852f7259262f425a839a05f88f51fa57e9cddb8c3d1493d10c04192e');
    // Downloading the handback file from the server
    console.log("Retrieving the files from the SFTP server");

    fileName = `${lp}_HANDBACK_${targetDate}.csv`;
    console.log(fileName);
    const foundFile = await File.find(`/transfer_connect_sutd_case_study_2023/c4i1/Handback/${lp}/${fileName}`, {mkdir_parents: true});
    const downloadableFile = await foundFile.download();

    if (!isBrowser()) {
      // Download to a file on disk
      await downloadableFile.downloadToFile(path.join(__dirname, `sftp_handback_downloads/${fileName}`));
      console.log(`File ${fileName} downloaded!\n`);
    }
  };
}

const extractDataFromCsv = async(filePath) => {

  return new Promise((resolve, reject) => {
    // List of outcomeCodes
    const outcomeCodeList = ['0000', '0001', '0002', '0003', '0004', '0005', '0099'];
    // Randomly pick an outcomeCode
    const random_outcomeCode = outcomeCodeList[Math.floor(Math.random() * outcomeCodeList.length)];

    const str1 = filePath.split('\\');
    const splitStr = str1[str1.length-1].split(/_/);
    const partnerCode = splitStr[0];

    const results = []; // List to store the dictionaries

    fs.createReadStream(filePath)
      .pipe(csvParser())
      .on('data', (data) => {
        // Adding outcomeCode field
        data[`Outcome Code`] = random_outcomeCode;

        // Pushing the whole result
        results.push(data);
      })
      .on('end', () => {
        resolve([partnerCode, results]);
      })
      .on(`error`, (error) =>  {
        reject(error);
      })
  });
  
}

const uploadFilesToMongoDB = async (targetDate) => {
  await mongoose.connect(process.env.MONGODB_URL, { useNewUrlParser: true, useUnifiedTopology: true });

  for (let i = 0; i < sftpLPList.length; i++) {
    const filePath = path.join(__dirname, `sftp_handback_downloads/${sftpLPList[i]}_HANDBACK_${targetDate}.csv`);
    try {
      const [partnerCode, results] = await extractDataFromCsv(filePath);
      console.log(`Extracting data from ${partnerCode} Handback File`);

      const Model = getModelForLP(mongoLPList[i]);

      for (const result of results) {
        let mappedResult = {
          partnerCode: partnerCode,
          referenceNumber: result['Reference number'],
          outcomeCode: result['Outcome Code'],
        };

        console.log(`Updating ${partnerCode} Database in Mongo\n`);
        let doc = await Model.findOne({ referenceNumber: mappedResult.referenceNumber }); // Must match the referenceNumber to update

        if (doc) {
          doc.set(mappedResult);
          await doc.save();
        } else {
          await Model.create(mappedResult);
        }
      }

      console.log(`Data updated for ${partnerCode} successfully\n`);
    } catch (error) {
      console.log(error);
    }
  }

  mongoose.connection.close();
};

// END OF MAIN FUNCTIONS ======================

// Running the functions
const main = async () => {
  await retrieveFromServer(testDate);
  await uploadFilesToMongoDB(testDate);
  console.log("Done!");
}
main().catch(console.error);


const downloadfromSFTPandUpload = async () => {
  await retrieveFromServer(formattedDate);
  await uploadFilesToMongoDB(formattedDate); 
};

module.exports = {
  retrieveFromServer,
  extractDataFromCsv,
  uploadFilesToMongoDB,
}
module.exports.downloadfromSFTPandUpload = downloadfromSFTPandUpload;