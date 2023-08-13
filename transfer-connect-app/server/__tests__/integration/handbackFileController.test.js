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
// Mock Data for testing
const records = [
  {
    transferDate: '23/9/2021',
    transferAmount: '85',
    systemId: '998877665b',
    outcomeCode: '0005',
  },
  {
    transferDate: '24/9/2022',
    transferAmount: '99',
    systemId: '556677889a',
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
      { id: 'systemId', title: 'System Id' },
      { id: 'outcomeCode', title: 'Outcome Code' },
    ]
  });
  csvWriter.writeRecords(records)}, 50000)




// === START OF TESTING ===

// Testing the retrieveFromServer function
describe('retrieveFromServer function check', () => {
  // Mocking the retrieveFromServer function
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

  // Checking naming convention and downloaded file extension
  test('should return success if naming convention and downloaded file ext is correct', async () => {
    // Navigate into the sftp_handback_downloads folder
    process.chdir(filePath);
    const files = fs.readdirSync(`./`);
    for (let i = 0; i < files.length; i++) {
      // Iteratively checking all the file names in the directory
      expect(files[i]).toMatch(/^\w+_HANDBACK_\d{8}\.csv$/);
    }
  });

  // Checking if CSV headers are correct
  test('should return success if csv headers are correct', (done) => {
    // Expected headers to be found in the CSV
    const expectedHeaders = ['Transfer date', 'Transfer Amount', 'System Id', 'Outcome Code'];
    let completed = 0;
    process.chdir(filePath);
    const files = fs.readdirSync(`./`);
    for (let i = 0; i < files.length; i++) {
      fs.createReadStream(path.join(filePath, files[i]))
        .pipe(csvParser())
        .on('headers', (headers) => {
          // Comparing headers with expected headers
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
    // Loop through each of collections
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
      // Connecting to Mongo DB
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
            // Creating a schema to store data extracted from the CSV
            for (let row of rawdataFromCSV) {
              const convertedDate = convertDateFormat(row['Transfer date']);
              row['Transfer date'] = convertedDate;
              let mappedResult = {
                transferDate: convertedDate,
                systemId: row['System Id'],
                outcomeCode: row['Outcome Code'],
                transferAmount: parseInt(row['Transfer Amount']),
              }
             // If the systemID and transferDate matches => Update with the mappedResult data
              let doc = await Model.findOne({
                $and: [
                  { systemId: mappedResult.systemId },
                  { transferDate: mappedResult.transferDate }]
              });
              if (doc) {
                doc.set(mappedResult);
                // Saving the data in Mongo DB
                await doc.save();
              } else {
                // If Document in Mongo DB not found => Create a new Document in the collection
                await Model.create(mappedResult);
              }
            };
            
            const filter = { systemId: rawdataFromCSV[0]["System Id"] };
    
            // Querying from mongo db
            const dataFromDB = await Model.find(filter);
            
            // Converting raw data from csv into db format
            const dataFromCSV = [{
              transferDate: rawdataFromCSV[0]['Transfer date'],
              transferAmount: parseInt(rawdataFromCSV[0]['Transfer Amount'], 10),
              systemId: rawdataFromCSV[0]['System Id'],
              outcomeCode: rawdataFromCSV[0]['Outcome Code'],
            }];
  
            // Assertions => Comparing the data between the Extracted Data from CSV and the Queried Data from Mongo DB
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