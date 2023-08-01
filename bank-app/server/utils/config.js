require('dotenv').config()
const MONGODB_URL = process.env.MONGODB_URL
const PORT = process.env.PORT
const TRANSFER_CONNECT_API_URL = process.env.TRANSFER_CONNECT_API_URL
const PARTNERCODE = process.env.PARTNERCODE
const SECRET_CODE = process.env.SECRET_CODE

module.exports = {
    MONGODB_URL, PORT, TRANSFER_CONNECT_API_URL, PARTNERCODE, SECRET_CODE
}