require('dotenv').config()
const MONGODB_URL = process.env.MONGODB_URL
const PORT = process.env.PORT
const TRANSFER_CONNECT_API_URL = process.env.TRANSFER_CONNECT_API_URL
const SECRET_CODE = process.env.SECRET_CODE

module.exports = {
    MONGODB_URL, PORT, TRANSFER_CONNECT_API_URL, SECRET_CODE
}