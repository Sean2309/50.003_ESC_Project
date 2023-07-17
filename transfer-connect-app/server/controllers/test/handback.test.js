/*
Promise testing: https://jestjs.io/docs/asynchronous
Testing Plan for Handback

1) 
*/

// Instantiating function variables
const fs = require('fs');
const handbackController = require('../handbackFileController.js');
const { retrieveFromServer, extractDataFromCsv, uploadFilesToMongoDB } = handbackController;

// Testing retrieveFromServer function
describe('testing retrieveFromServer', () => {
    process.chdir(`./controllers/sftp_handback_downloads`);
    const files = fs.readdirSync(`./`);

    // Testing the file format of the retrieval
    test('testing the file format of the retrieval', async() => {
        expect(files[0]).toMatch(/^\w+_HANDBACK_\d{8}\.csv$/);
    });   
    // Testing the file content of the retrieval
    test('testing the file content of the retrieval', async() => {
        const fileContent = fs.readFileSync(files[0], 'utf-8');
        // Separate the lines
        const lines = fileContent.split(`\n`);
        // Split each line into an array of values
        const data = lines.map(line => line.split(','));
        console.log(data);
    });
});