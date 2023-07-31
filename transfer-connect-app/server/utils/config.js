require('dotenv').config()
const MONGODB_URL = process.env.MONGODB_URL;
const PORT = process.env.PORT;
const kaligo_URL = 'https://kaligo.files.com';
const kaligo_APIKey = 'd823bcf8852f7259262f425a839a05f88f51fa57e9cddb8c3d1493d10c04192e';
const mongoDB_Collections = [`dbssgs`, `qflyers`, `gojets`];
const sftp_Collections = ['DBSSG', `QFlyers`, `GoJets`];

module.exports = {
    MONGODB_URL, 
    PORT,
    kaligo_URL,
    kaligo_APIKey,
    mongoDB_Collections,
    sftp_Collections
}