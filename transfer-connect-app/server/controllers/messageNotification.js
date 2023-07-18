const twilio = require('twilio');

const accountSid = 'AC3dbfa982e8235525cb238a8c21650a51';
const authToken = 'b1ced07d76098bad606cd6e043c7e8a1';
const client = twilio(accountSid, authToken);


async function sendMessages(phoneNumber, bank_name, loyalty_program_name, outcomeCode, transferAmount){
    client.messages
    .create({
        body: `Status of transaction of ${transferAmount} from ${bank_name} to ${loyalty_program_name}: ${outcomeCode} `,
        from: '+19895141824',
        to: phoneNumber
    })
    .then(message => console.log('Message sent:', message.sid))
    .catch(error => console.error('Error:', error));
}

    module.exports = {sendMessages};