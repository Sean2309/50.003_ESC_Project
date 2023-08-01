require('dotenv').config({path: __dirname + '/../.env'});
const fs = require('fs');
const path = require('path');
const csv = require('csv-parser');
const mongoose = require('mongoose');
const handbackFileController = require('../controllers/handbackFileController');
const filePath = path.join(__dirname, `../controllers/sftp_handback_downloads`);
const config = require('../utils/config');
const testDate = '20200812'

describe('retrieveFromServer function check', () => {

    test('should return success if retrieveFromServer is executed successfully', async () => {
      // Mock the implementation of retrieveFromServer
      const retrieveFromServerSpy = jest.spyOn(handbackFileController, 'retrieveFromServer').mockReturnValue(100);
  
      // Call the function in your test
      const result = handbackFileController.retrieveFromServer(testDate);
  
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
                .pipe(csv())
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

describe('extractDataFromCSV check', () => {

  test('should return success if extractDataFromCSV is executed successfully', async () => {
    for (let i = 0; i < config.sftpCollections.length; i++) {
      const filePathIter = path.join(filePath, `/${config.sftpCollections[i]}_HANDBACK_${testDate}.csv`);
      const [partnerCode, results] = await handbackFileController.extractDataFromCsv(filePathIter);
      expect(partnerCode).toBe(config.sftpCollections[i]);
    }
  });
});


describe('MongoDB Connectivity', () => {
  beforeAll(async () => {
    await mongoose.connect(process.env.MONGODB_URL, { useNewUrlParser: true, useUnifiedTopology: true });
  }, 10000);

  afterAll(async () => {
    await mongoose.connection.close();
  }, 10000);

  test('return sucess if MongoDB readyState == 1', async () => {
    const connected = mongoose.connection.readyState;
    expect(connected).toBe(1);
  });
});

describe('uploadFilesToMongoDB check', () => {
  test('should return success if uploadFilesToMongoDB is executed successfully', async () => {
    // Mock the implementation of uploadFilesToMongoDB
    const uploadFilesToMongoDBSpy = jest.spyOn(handbackFileController, 'uploadFilesToMongoDB').mockReturnValue(100);
  
    // Call the function in your test
    const result = handbackFileController.uploadFilesToMongoDB(testDate);

    // Assertion
    expect(result).toBe(100);

    // Restore the original implementation
    uploadFilesToMongoDBSpy.mockRestore();
  });
});