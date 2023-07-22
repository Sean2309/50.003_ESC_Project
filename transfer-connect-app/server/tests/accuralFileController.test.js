const mongoose = require('mongoose');
require('dotenv').config({path: __dirname + '/../.env'});
const csv = require('csv-parser');
const fs = require('fs');
const path = require('path');
const accrualFileFormSchema = require('../models/accrualFileForm');
const AccrualFileFormTest = mongoose.model('AccrualFileFormTest', accrualFileFormSchema);


describe('MongoDB Connectivity', () => {
  beforeAll(async () => {
    await mongoose.connect(process.env.MONGODB_URL, { useNewUrlParser: true, useUnifiedTopology: true });
  }, 10000);

  afterAll(async () => {
    await mongoose.connection.close();
  }, 10000);

  it('successfully connects to the MongoDB database', async () => {
    const connected = mongoose.connection.readyState;
    expect(connected).toBe(1);
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

describe('Database Operations Test', () => {
  let connection;
  let db;

  beforeAll(async () => {
    connection = await mongoose.connect(process.env.MONGODB_URL, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    db = mongoose.connection;
  });

  afterAll(async () => {
    await mongoose.connection.close();
    await db.close();
  });

  afterEach(async () => {
    await AccrualFileFormTest.deleteOne({ memberID: "testMemberID" });
  });

  // Pre-conditions: A known record exists in the database
  it('should retrieve a document from the database', async () => {
    const testDoc = new AccrualFileFormTest({
      index: 1,
      memberID: "testMemberID",
      memberFirstName: "Test",
      memberLastName: "User",
      amount: 100,
      referenceNumber: "testReferenceNumber",
      partnerCode: "testPartnerCode"
    });
    await testDoc.save();

    const foundDoc = await AccrualFileFormTest.findOne({ _id: testDoc._id });
    
    expect(foundDoc.toObject()).toEqual(testDoc.toObject());
  });
});