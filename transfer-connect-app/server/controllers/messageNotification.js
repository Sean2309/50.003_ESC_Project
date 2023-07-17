const twilio = require('twilio');

const accountSid = 'AC3dbfa982e8235525cb238a8c21650a51';
const authToken = '21b9fa87ca36f738904b0a6397cc3718';
const client = twilio(accountSid, authToken);


async function sendMessages(){
    client.messages
    .create({
        body: 'Hello from Twilio!',
        from: '+19895141824',
        to: '+6588669619'
    })
    .then(message => console.log('Message sent:', message.sid))
    .catch(error => console.error('Error:', error))
    .done();
}

    module.exports = {sendMessages};