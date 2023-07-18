// Instantiating function variables
const fs = require('fs');
const path = require('path');
const handbackController = require('../handbackFileController.js');

// const retrieveFromServer = handbackController.retrieveFromServer();
// const extractDataFromCSV_test = handbackController.extractDataFromCsv();

const filePath = `./controllers/sftp_handback_downloads`;

// Testing extractDataFromCsv function
describe('testing extractDataFromCSV', () => {
    // const file = fs.readFileSync(`./controllers/sftp_handback_downloads/DBSSG_HANDBACK_20200812.csv`); path.join(filePath, 'DBSSG_HANDBACK_20200812.csv')
    const [partnerCode, results] = extractDataFromCSV_test();
    console.log(partnerCode);
    console.log(results);
});