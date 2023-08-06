// Importing Modules
const fs = require('fs');
const path = require('path');
const mongoose = require('mongoose');
const csvParser = require('csv-parser');
const createCsvWriter = require('csv-writer').createObjectCsvWriter;

// Importing Config Files + Schemas
const transactionEnquiryModel = require('../../models/transactionEnquiryModel');
const config = require('../../utils/config');

// Importing Helper Functions
const handbackFileController = require('../../controllers/handbackFileController');
const convertDateFormat = require('../../controllers/convertDateFormat').convertDateFormat;

// Instantiating Variables
const filePath = path.join(__dirname, `../../controllers/testCsvs`);
const testPartnerCode = 'TESTPARTNERCODE';
const testDate = '20210923';
const testCsvName = `${testPartnerCode}_HANDBACK_${testDate}.csv`;
const testCsvDir = path.join(__dirname, '../../controllers/testCsvs')
const testCsvPath = `${testCsvDir}/${testCsvName}`;
const mongoDBURL = 'mongodb+srv://user1:1234@cluster0.5iybncp.mongodb.net/TransferConnectDB?retryWrites=true&w=majority';
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
  };

  // Creates the test csv within the testCsvs folder
  const csvWriter = createCsvWriter({
    path: testCsvPath,
    header: [
      { id: 'transferDate', title: 'Transfer date' },
      { id: 'transferAmount', title: 'Transfer Amount' },
      { id: 'referenceNumber', title: 'Reference number' },
      { id: 'outcomeCode', title: 'Outcome Code' },
    ]
  });
  csvWriter.writeRecords(records)}, 50000)




// ======== START OF TESTING ===========================
describe('retrieveFromServer function check', () => {

  /*
  3 Tests: 
  - Mock Implementation of the retrieveFromServer function
  - Compares the downloaded file name to the appropriate naming convention => this also tests the file type (.csv)
  - Compares the column headers within the csv to the expected headers
  */

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

  /*
  1 Test:
  - Iterates through the testCsvs directory -> compares the extracted partnerCode to the expected testPartnerCode
  */

  test('should return success if extractDataFromCSV is executed successfully', async () => {
    for (let i = 0; i < config.collections.length; i++) {
      const filePathIter = path.join(filePath, `/${testPartnerCode}_HANDBACK_${testDate}.csv`);
      const [partnerCode, results] = await handbackFileController.extractDataFromCsv(filePathIter);
      expect(partnerCode).toBe(testPartnerCode);
    }
  });

  
});

describe('uploadFilesToMongoDB function check', () => {

  /*
  2 Tests:
  - Mock implmentation of the uploadFilesToMongoDB function
  - Test on the mongodb connection:
    - Connects to the mongodb
    - Extracts the data from the testCsv and stores in the variable rawDataFromCsv
    - Queries the uploaded collection data into the variable dataFromDB
    - Converts the rawDataFromCSV into the db format, storing in the variable dataFromCsv
    - Compares the values from dataFromDB and dataFromCsv
  */

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
      mongoose.connect(mongoDBURL, { useNewUrlParser: true, useUnifiedTopology: true });
      const Model = mongoose.model('testhandbacks', transactionEnquiryModel, 'testhandbacks');
  
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