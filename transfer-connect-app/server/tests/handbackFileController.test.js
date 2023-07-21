require('dotenv').config({path: __dirname + '/../.env'});
const fs = require('fs');
const path = require('path');
const csv = require('csv-parser');
const mongoose = require('mongoose');

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

describe('Handback csv File Check', () => {
    const filePath = path.join(__dirname, `../controllers/sftp_handback_downloads`);
  
    test('check on handback file naming convention and file ext', async () => {
        process.chdir(filePath);
        const files = fs.readdirSync(`./`);
        for (let i = 0; i < files.length; i++) {
            expect(files[i]).toMatch(/^\w+_HANDBACK_\d{8}\.csv$/);
        }
    });
  
    test('check on handback csv headers', (done) => {
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


  