require('dotenv').config()
const MONGODB_URL = process.env.MONGODB_URL
const PORT = process.env.PORT
const MONGODB_OPTIONS = { useUnifiedTopology: true, useNewUrlParser: true };

module.exports = {
    MONGODB_URL, PORT, MONGODB_OPTIONS
}