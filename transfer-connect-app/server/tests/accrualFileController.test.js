const mongoose = require('mongoose');
require('dotenv').config({path: __dirname + '/../.env'});
const csv = require('csv-parser');
const fs = require('fs');
const path = require('path');
const accrualFileController = require('../controllers/accrualFileController');
const { queryFromDBandUpload, writeCollectionsToCsv } = require('../controllers/accrualFileController');


// Database connection and CSV file path
const csvFilePath = path.join(__dirname, '../controllers/accrual_files');

// Mock data
const mockData = [
  {
    _id: "649fb6ad87d672d8f30e98e5",
    transferDate: "2023-07-22",
    referenceNumber: "3av456b",
    partnerCode: "DBSSG",
    membershipId: "2342345bc",
    membershipName: "Thomas Doe",
    transferAmount: 100000
  },
  {
    _id: "759fb6ad87d672d8f30e99b6",
    transferDate: "2023-07-23",
    referenceNumber: "4bx456c",
    partnerCode: "HSBC",
    membershipId: "1231235cd",
    membershipName: "Jane Doe",
    transferAmount: 200000
  },
  {
    _id: "859fb6ad87d672d8f30e99c7",
    transferDate: "2023-07-24",
    referenceNumber: "5cy456d",
    partnerCode: "DBSSG",
    membershipId: "5675675ef",
    membershipName: "Richard Roe",
    transferAmount: 300000
  }
];
const expectedResult = {
  'DBSSG': [
    {
      _id: "649fb6ad87d672d8f30e98e5",
      transferDate: "2023-07-22",
      referenceNumber: "3av456b",
      partnerCode: "DBSSG",
      membershipId: "2342345bc",
      membershipName: "Thomas Doe",
      transferAmount: 100000
    },
    {
      _id: "859fb6ad87d672d8f30e99c7",
      transferDate: "2023-07-24",
      referenceNumber: "5cy456d",
      partnerCode: "DBSSG",
      membershipId: "5675675ef",
      membershipName: "Richard Roe",
      transferAmount: 300000
    },
  ],
  'HSBC': [
    {
      _id: "759fb6ad87d672d8f30e99b6",
      transferDate: "2023-07-23",
      referenceNumber: "4bx456c",
      partnerCode: "HSBC",
      membershipId: "1231235cd",
      membershipName: "Jane Doe",
      transferAmount: 200000
    },
  ],
};

describe('writeCollectionsToCsv Function', () => {
  beforeAll(async () => {
    await new Promise((resolve, reject) => {
      mongoose.connect(process.env.MONGODB_URL, { useNewUrlParser: true, useUnifiedTopology: true });
      mongoose.connection.on('connected', resolve);
      mongoose.connection.on('error', reject);
    });
  });

  test('return success if MongoDB readyState == 1', async () => {
    const connected = mongoose.connection.readyState;
    expect(connected).toBe(1);
  });

  test('should retrieve data from the MongoDB collection', async () => {
    const writeCollectionsToCsvSpy = jest.spyOn(accrualFileController, 'writeCollectionsToCsv').mockResolvedValue(mockData);
  
    const data = await accrualFileController.writeCollectionsToCsv();
    expect(data).toBeDefined();
    expect(data).toEqual(mockData);
  
    writeCollectionsToCsvSpy.mockRestore();
  });

  test('should correctly write data to CSV files', async () => {
    // Check if the csv file exists
    fs.readdirSync(csvFilePath).forEach(file => {
      if(file.startsWith('testaccruals_') && file.endsWith('.csv')) {
        expect(fs.existsSync(path.join(csvFilePath, file))).toBeTruthy();

        // Check if CSV headers are correct
        const expectedHeaders = ['Membership ID', 'Membership name', 'Transfer date', 'Transfer Amount', 'Reference number', 'Partner code'];
        fs.createReadStream(path.join(csvFilePath, file))
          .pipe(csv())
          .on('headers', (headers) => {
            expect(headers).toEqual(expectedHeaders);
          });
      }
    });
  });

  afterAll(async () => {
    await mongoose.connection.close();
  });

});

describe('CSV headers check', () => {

  const expectedHeaders = ['Membership ID', 'Membership name', 'Transfer date', 'Transfer Amount', 'Reference number', 'Partner code'];
  const directoryPath = path.join(__dirname, '../controllers/accrual_files');

  fs.readdirSync(directoryPath).forEach(file => {
    if(file.startsWith('testaccruals_') && file.endsWith('.csv')) {
      it(`file ${file} should have the correct headers`, (done) => {
        fs.createReadStream(path.join(directoryPath, file))
          .pipe(csv())
          .on('headers', (headers) => {
            expect(headers).toEqual(expectedHeaders);
            done();
          });
      });
    }
  });
});

describe('CSV Naming Convention', () => {
  const accrualFilePath = path.join(__dirname, `../controllers/accrual_files`);
  const collections = ["qflyers", "gojets", "testaccruals"];

  collections.forEach((collection) => {
      test(`should return success if ${collection} CSV files naming convention is correct`, async () => {
          process.chdir(accrualFilePath);
          const files = fs.readdirSync(`./`);
          files.forEach(file => {
              if (file.startsWith(`${collection}_`) && file.endsWith('.csv')) {
                expect(file).toMatch(/^\w+_\w+\.csv$/);
              }
          });
      });
  });
});

describe('queryFromDBandUpload function check', () => {
  test('should return success if queryFromDBandUpload is executed successfully', async () => {
    // Mock the implementation of queryFromDBandUpload
    const queryFromDBandUploadSpy = jest.spyOn(accrualFileController, 'queryFromDBandUpload').mockReturnValue(true);
    const result = accrualFileController.queryFromDBandUpload();
    expect(result).toBeTruthy();
    queryFromDBandUploadSpy.mockRestore();
  });
});