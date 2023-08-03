const twilio = require('twilio');

// from twilio account, can register for it online
const accountSid = 'AC3dbfa982e8235525cb238a8c21650a51';
const authToken = '020b0dec527b2c037b9cdf82c8c8a521';
const client = twilio(accountSid, authToken);

async function sendMessages(phoneNumber, bankName, loyaltyProgramName, outcomeCode, transferAmount) {
  client.messages
    .create({
      body: `Status of transaction of ${transferAmount} from ${bankName} to ${loyaltyProgramName}: ${outcomeCode} `,
      from: '+19895141824', // twilio generated number
      to: phoneNumber, // taken from user info in transferconnectDB
    })
    .then((message) => console.log('Message sent:', message.sid))
    .catch((error) => console.error('Error:', error));
}

module.exports = { sendMessages };
