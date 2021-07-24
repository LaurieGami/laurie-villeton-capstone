const express = require('express');
const router = express.Router();

require('dotenv').config();

const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const phoneNumber = process.env.TWILIO_PHONE_NUMBER;

const client = require('twilio')(accountSid, authToken);

router.route('/notifications')
    .post((req, res) => {
        client.messages
            .create({
                from: phoneNumber,
                to: req.body.to,
                body: req.body.body
            })
            .then(() => res.status(200).json({ success: true }))
            .catch(err => res.status(400).json({ success: false, error: err}));
    })

module.exports = router;