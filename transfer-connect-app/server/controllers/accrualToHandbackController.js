const fs = require('fs');
const path = require('path');
const parse = require('csv-parse/lib/sync');
const createCsvWriter = require('csv-writer').createObjectCsvWriter;
const Files = require('files.com/lib/Files').default;
const File = require('files.com/lib/models/File').default;
const dateUtil = require('./date');
const config = require('../utils/config');

class HandbackFileController {
  downloadAccrualFile = async (directoryName, partnerCode) => {
    const formattedDate = dateUtil.getFormattedDate("compact");

    try {
      const localFilePath = path.join(__dirname, `${partnerCode}_ACCRUAL_${formattedDate}.csv`);
      await File.download(`/transfer_connect_sutd_case_study_2023/c4i1/Accrual/${directoryName}/${partnerCode}_ACCRUAL_${formattedDate}.csv`, localFilePath);
      return localFilePath;
    } catch (error) {
      console.error('An error occurred while downloading file:', error);
    }
  }

  generateOutcomeCode = () => {
    return Math.floor(Math.random() * 10000).toString().padStart(4, '0');  // Generate a 4-digit number and convert it to a string
  }

  createHandbackFile = async (accrualFilePath, directoryName, partnerCode) => {
    const csvData = fs.readFileSync(accrualFilePath, { encoding: 'utf8' });
    const records = parse(csvData, { columns: true });

    const newRecords = records.map(record => ({
      transferDate: record['Transfer date'],
      transferAmount: record['Transfer Amount'],
      referenceNumber: record['Reference number'],
      outcomeCode: this.generateOutcomeCode()
    }));

    const csvWriter = createCsvWriter({
      path: path.join(__dirname, `${partnerCode}_HANDBACK.csv`),
      header: [
        { id: 'transferDate', title: 'Transfer date' },
        { id: 'transferAmount', title: 'Transfer Amount' },
        { id: 'referenceNumber', title: 'Reference number' },
        { id: 'outcomeCode', title: 'Outcome Code' }
      ]
    });

    await csvWriter.writeRecords(newRecords);

    return path.join(__dirname, `${partnerCode}_HANDBACK.csv`);
  }

  uploadHandbackFile = async (handbackFilePath, directoryName, partnerCode) => {
    const formattedDate = dateUtil.getFormattedDate("compact");

    Files.setBaseUrl(config.kaligoURL);
    Files.setApiKey(config.kaligoAPIKey);

    try {
      await File.uploadFile(`/transfer_connect_sutd_case_study_2023/c4i1/Handback/${directoryName}/${partnerCode}_HANDBACK_${formattedDate}.csv`, handbackFilePath, { mkdir_parents: true });
      console.log('Handback file uploaded successfully.');
    } catch (error) {
      console.error('An error occurred while uploading handback file:', error);
    }
  }

  processAccrualFile = async (directoryName, partnerCode) => {
    const accrualFilePath = await this.downloadAccrualFile(directoryName, partnerCode);
    const handbackFilePath = await this.createHandbackFile(accrualFilePath, directoryName, partnerCode);
    await this.uploadHandbackFile(handbackFilePath, directoryName, partnerCode);
  }
}


const handbackFileController = new HandbackFileController();
handbackFileController.processAccrualFile(config.collections, config.banks);

module.exports = handbackFileController;
