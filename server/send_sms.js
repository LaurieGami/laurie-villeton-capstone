require('dotenv').config();
const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const phoneNumber = process.env.TWILIO_PHONE_NUMBER;
const client = require('twilio')(accountSid, authToken);

client.messages
    .create({
        body: 'Hellooo',
        from: phoneNumber,
        to: '+12505210067'
    })
    .then(message => console.log(message.sid));