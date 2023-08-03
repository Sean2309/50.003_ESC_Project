const twilio = require('twilio');
const TWILIO_AUTHTOKEN = require('../utils/config').TWILIO_AUTHTOKEN;
//from twilio account, can register for it online
const accountSid = 'AC0d39f5f958600b8738d0159997ccaaea';
const authToken = TWILIO_AUTHTOKEN;
const client = twilio(accountSid, authToken);


async function sendMessages(phoneNumber, bank_name, loyalty_program_name, outcomeCode, transferAmount){
    client.messages
    .create({
        body: `Status of transaction of ${transferAmount} from ${bank_name} to ${loyalty_program_name}: ${outcomeCode} `,
        from: '+12512973255', //twilio generated number
        to: phoneNumber //taken from user info in transferconnectDB
    })
    .then(message => console.log('Message sent:', message.sid))
    .catch(error => console.error('Error:', error));
}

    module.exports = {sendMessages};