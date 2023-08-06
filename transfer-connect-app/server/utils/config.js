require('dotenv').config();
const MONGODB_URL = process.env.MONGODB_URL;
const PORT = process.env.PORT;
const MONGODB_OPTIONS = { useUnifiedTopology: true, useNewUrlParser: true };

//edit links in .env file to connect to appropriate database
const kaligoURL = 'https://kaligo.files.com';
const kaligoAPIKey = 'd823bcf8852f7259262f425a839a05f88f51fa57e9cddb8c3d1493d10c04192e';
const collections = [`ASIAMILES`, `GOPOINTS`];

const TRANSFER_CONNECT_API_URL = process.env.TRANSFER_CONNECT_API_URL;
const TWILIO_AUTHTOKEN = process.env.TWILIO_AUTHTOKEN;
const BANK_APP_URL = process.env.BANK_APP_URL;
module.exports = {
    MONGODB_URL, PORT,
    kaligoURL,
    kaligoAPIKey,
    collections,
    TRANSFER_CONNECT_API_URL,
    MONGODB_OPTIONS,
    TWILIO_AUTHTOKEN,
    BANK_APP_URL
}