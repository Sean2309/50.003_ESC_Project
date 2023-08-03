require('dotenv').config()
//edit links in .env file to connect to appropriate database
const MONGODB_URL = process.env.MONGODB_URL
const MONGODB_URLB = process.env.MONGODB_URLB
const PORT = process.env.PORT
const kaligoURL = 'https://kaligo.files.com';
const kaligoAPIKey = 'd823bcf8852f7259262f425a839a05f88f51fa57e9cddb8c3d1493d10c04192e';
const mongoDBCollections = [`dbssgs`, `qflyers`, `gojets`];
const sftpCollections = ['DBSSG', `QFlyers`, `GoJets`];

const TRANSFER_CONNECT_API_URL = process.env.TRANSFER_CONNECT_API_URL
const DB_NAME = process.env.DB_NAME

module.exports = {
    MONGODB_URL, MONGODB_URLB, PORT, TRANSFER_CONNECT_API_URL, DB_NAME,
    kaligoURL,
    kaligoAPIKey,
    mongoDBCollections,
    sftpCollections,
    TRANSFER_CONNECT_API_URL,
}