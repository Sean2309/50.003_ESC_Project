require('dotenv').config()
const mongoDBURL = 'mongodb+srv://tengtjinyang:zagNwPsta2HHTyfE@transferconnect.0papjri.mongodb.net/TransferConnectDB';
const port = '3001';
const kaligoURL = 'https://kaligo.files.com';
const kaligoAPIKey = 'd823bcf8852f7259262f425a839a05f88f51fa57e9cddb8c3d1493d10c04192e';
const mongoDBCollections = [`dbssgs`, `qflyers`, `gojets`];
const sftpCollections = ['DBSSG', `QFlyers`, `GoJets`];

module.exports = {
    mongoDBURL, 
    port,
    kaligoURL,
    kaligoAPIKey,
    mongoDBCollections,
    sftpCollections
}