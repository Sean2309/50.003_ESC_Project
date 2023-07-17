const mongoose = require('mongoose');
require('dotenv').config({path: __dirname + '/../.env'});


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