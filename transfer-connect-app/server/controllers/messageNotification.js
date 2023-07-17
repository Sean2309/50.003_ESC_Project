const twilio = require('twilio');

const accountSid = 'AC3dbfa982e8235525cb238a8c21650a51';
const authToken = 'b1ced07d76098bad606cd6e043c7e8a1';
const client = twilio(accountSid, authToken);


async function sendMessages(){
    client.messages
    .create({
        body: 'Hello from Twilio!',
        from: '+19895141824',
        to: '+6588669619'
    })
    .then(message => console.log('Message sent:', message.sid))
    .catch(error => console.error('Error:', error));
}

    module.exports = {sendMessages};