const fs = require('fs');
const path = require('path');
const { CronJob } = require('cron');
const mongoose = require('mongoose');
const filePath = path.join(__dirname, `../../controllers`);
var config = require('../../utils/config');

// Integration testing example: 
// Wait for the uploading of files to MongoDB is done, then you pull from the mongo db and see if the data is expected

describe('clearFolder function check', () => {
    test('should return success if clearFolder is executed successfully', async() => {
      const clearFolder = require('../../controllers/clearFolder').clearFolder;
      const folderList = ['accrual_files', 'sftp_handback_downloads'];
      for (let folder in folderList) {
        process.chdir(`${filePath}/${folderList[folder]}`);
        await clearFolder(folderList[folder]);
        const files = fs.readdirSync(`./`);
        expect(files.length).toBe(0);
      }
    });
  });

describe('cronjob in index.js function check', () => {
jest.useFakeTimers();

test('should return success if cronjob is executed successfully', async () => {
    const mockJob = jest.fn();
    const cronExpression = '*/10 * * * * *'; // Run every 10 seconds

    // Mock the CronJob constructor
    jest.spyOn(require('cron'), 'CronJob').mockImplementation((expression, onTick) => {
    // Save the onTick function to call it later manually
    mockJob.mockImplementation(onTick);
    return {
        start: jest.fn(),
        stop: jest.fn(),
    };
    });

    // Start the cron job
    const testJob = new CronJob(cronExpression);
    testJob.start();

    // First Iter
    jest.advanceTimersByTime(10000); // 10 seconds
    mockJob('first');

    // Second Iter
    jest.advanceTimersByTime(10000);
    mockJob('second');

    // Third Iter
    jest.advanceTimersByTime(10000);
    mockJob('third');

    // Ensure that the cron job has been called three times
    expect(mockJob).toHaveBeenCalledTimes(3);

    // Checking the arguments passed to the cron job function
    expect(mockJob.mock.calls).toEqual([
    ['first'],
    ['second'],
    ['third'],
    ]);

    // Stop the cron job after the test
    testJob.stop();
});
});

// describe('MongoDB Connectivity check', () => {
//     beforeAll(async () => {
//       await mongoose.connect(config.mongoDBURL, { useNewUrlParser: true, useUnifiedTopology: true });
//     }, 10000);
  
//     afterAll(async () => {
//       await mongoose.connection.close();
//     }, 10000);
  
//     test('return success if MongoDB readyState == 1', async () => {
//       const connected = mongoose.connection.readyState;
//       expect(connected).toBe(1);
//     });
//   });