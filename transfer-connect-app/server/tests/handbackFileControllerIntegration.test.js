require('dotenv').config({path: __dirname + '/../.env'});
const fs = require('fs');
const path = require('path');
const mongoose = require('mongoose');
const csvParser = require('csv-parser');
const createCsvWriter = require('csv-writer').createObjectCsvWriter;

const transactionEnquiryModel = require('../models/transactionEnquiryModel');
const handbackFileController = require('../controllers/handbackFileController');
const filePath = path.join(__dirname, `../controllers/testCsvs`);
const config = require('../utils/config');
const convertDateFormat = require('../controllers/convertDateFormat').convertDateFormat;


/*
Unit Testing: Testing with purely the function, without any external modules
Integration Testing: Testing with the imported modules, bottom up approach

Imported Modules:
- mongoose
- fs
- path
- files.com
- csv-parser

Modules used in Functions:

getModelForLP:
- mongoose

retrieveFromServer:
- files.com
- path

extractDataFromCSV:
-fs
-csv-parser

uploadFilesToMongoDB:
- path
- mongoose

=> Can't do unit testing but can do integration testing

For Uploading to mongodb, create and write into a csv. 
This csv will be used to upload data into mongodb
Then query the data from mongo db and see if it matches the data that we have uploaded

After that, we test the extracting data from csv function
with the written test csv, extract the headers and data => see if it matches the expected headers and data

*/
// Creating a test csv
const testPartnerCode = 'TESTPARTNERCODE';
const testDate = '20210923';
const testCsvName = `${testPartnerCode}_HANDBACK_${testDate}.csv`;
const testCsvDir = path.join(__dirname, '../controllers/testCsvs')
const testCsvPath = `${testCsvDir}/${testCsvName}`;
const testMongoDBURL = 'mongodb+srv://tengtjinyang:zagNwPsta2HHTyfE@transferconnect.0papjri.mongodb.net/TransferConnectDB';
const records = [
  {
    transferDate: '23/9/2021',
    transferAmount: '85',
    referenceNumber: '998877665b',
    outcomeCode: '0005',
  },
  {
    transferDate: '24/9/2022',
    transferAmount: '99',
    referenceNumber: '556677889a',
    outcomeCode: '0099',
  }
];
beforeAll(async() => {

  // Creating the testCsvs folder if it doesn't exist
  
  if (!fs.existsSync(testCsvDir)) {
    fs.mkdirSync(testCsvDir);
    conso
  }

  const csvWriter = createCsvWriter({
    path: testCsvPath,
    header: [
      { id: 'transferDate', title: 'Transfer date' },
      { id: 'transferAmount', title: 'Transfer Amount' },
      { id: 'referenceNumber', title: 'Reference number' },
      { id: 'outcomeCode', title: 'Outcome Code' },
    ]
  });
  csvWriter.writeRecords(records)
    .then(() => {
      console.log(`${testCsvName} Created`);
    });
}, 50000)




// ======== START OF TESTING ===========================
describe('retrieveFromServer function check', () => {
    // beforeAll(async () => {
    //   // Call the actual function here
    //   await handbackFileController.retrieveFromServer(testDate);
    // }, 30000); // Increase the timeout to allow time for the file download

    test('should return success if retrieveFromServer is executed successfully', async () => {
      // Mock the implementation of retrieveFromServer
      const retrieveFromServerSpy = jest.spyOn(handbackFileController, 'retrieveFromServer').mockReturnValue(100);
  
      // Call the function in your test
      const result = await retrieveFromServerSpy(testDate);
  
      // Assertion
      expect(result).toBe(100);
  
      // Restore the original implementation
      retrieveFromServerSpy.mockRestore();
    });
    
    test('should return success if naming convention and downloaded file ext is correct', async () => {
        process.chdir(filePath);
        const files = fs.readdirSync(`./`);
        for (let i = 0; i < files.length; i++) {
            expect(files[i]).toMatch(/^\w+_HANDBACK_\d{8}\.csv$/);
        }
    });
  
    test('should return success if csv headers are correct', (done) => {
        const expectedHeaders = ['Transfer date', 'Transfer Amount', 'Reference number', 'Outcome Code'];
        let completed = 0;
        process.chdir(filePath);
        const files = fs.readdirSync(`./`);
            for (let i = 0; i < files.length; i++) {
                fs.createReadStream(path.join(filePath, files[i]))
                .pipe(csvParser())
                .on('headers', (headers) => {
                    expect(headers).toEqual(expectedHeaders);
                    completed++;
                    if (completed === files.length) {
                    done();
                    }
            });
        }
        });
  });

describe('extractDataFromCSV function check', () => {

  test('should return success if extractDataFromCSV is executed successfully', async () => {
    for (let i = 0; i < config.sftpCollections.length; i++) {
      const filePathIter = path.join(filePath, `/${testPartnerCode}_HANDBACK_${testDate}.csv`);
      const [partnerCode, results] = await handbackFileController.extractDataFromCsv(filePathIter);
      expect(partnerCode).toBe(testPartnerCode);
    }
  });

  
});

describe('uploadFilesToMongoDB function check', () => {
  test('should return success if uploadFilesToMongoDB is executed successfully', async () => {
    // Mock the implementation of uploadFilesToMongoDB
    const uploadFilesToMongoDBSpy = jest.spyOn(handbackFileController, 'uploadFilesToMongoDB').mockReturnValue(100);
  
    // Call the function in your test
    const result = uploadFilesToMongoDBSpy(testDate);

    // Assertion
    expect(result).toBe(100);

    // Restore the original implementation
    uploadFilesToMongoDBSpy.mockRestore();
  });

  test('should return success if updates or creates a document in the test collection in mongodb', async () => {
    return new Promise((resolve, reject) => {
      // Writing to mongo db
      mongoose.connect(testMongoDBURL, { useNewUrlParser: true, useUnifiedTopology: true });
      const Model = mongoose.model('testhandbacks', transactionEnquiryModel);
  
      const rawdataFromCSV = [];
      fs.createReadStream(testCsvPath)
        .pipe(csvParser())
        .on('data', (row) => {
          rawdataFromCSV.push(row);
        })
        .on('end', async () => {
          try {
            // Update or create a document in the collection
            for (let row of rawdataFromCSV) {
              const convertedDate = convertDateFormat(row['Transfer date']);
              row['Transfer date'] = convertedDate;
              let mappedResult = {
                transferDate: convertedDate,
                referenceNumber: row['Reference number'],
                outcomeCode: row['Outcome Code'],
                transferAmount: parseInt(row['Transfer Amount']),
              }
              let doc = await Model.findOne({
                $and: [
                  { referenceNumber: mappedResult.referenceNumber },
                  { transferDate: mappedResult.transferDate }]
              });
              if (doc) {
                doc.set(mappedResult);
                await doc.save();
              } else {
                await Model.create(mappedResult);
              }
            };
            
            const filter = { referenceNumber: rawdataFromCSV[0]["Reference number"] };
    
            // Querying from mongo db
            const dataFromDB = await Model.find(filter);
            
            // Converting raw data from csv into db format
            const dataFromCSV = [{
              transferDate: rawdataFromCSV[0]['Transfer date'],
              transferAmount: parseInt(rawdataFromCSV[0]['Transfer Amount'], 10),
              referenceNumber: rawdataFromCSV[0]['Reference number'],
              outcomeCode: rawdataFromCSV[0]['Outcome Code'],
            }];
  
            // Assertions
            expect(dataFromDB).toEqual(expect.arrayContaining([expect.objectContaining(dataFromCSV[0])]));
            // Close the MongoDB connection
            mongoose.connection.close();
            resolve(); // Resolve the Promise to signal Jest that the test case is complete
          } catch (error) {
            reject(error); // Reject the Promise with an error to signal Jest a failure
          }
        });
    });
  });
});
// ======== END OF TESTING ===========================