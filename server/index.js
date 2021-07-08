const express = require('express');
const cors = require("cors");
const knex = require('knex')(require('./knexfile'));

require('dotenv').config();
const PORT = process.env.PORT || 5000;

// Routes
const app = express();

// Middlewares
app.use(express.json());
// app.use(express.static("public"));
app.use(cors());

app.get('/', (req, res) => {
    res.send('Welcome to my API');
});

// get all users data
app.get('/users', (req, res) => {
    knex
        .select('*')
        .from('users')
        .then((data) => {
            res.json(data);
        })
        .catch((err) => res.send('Error getting users data'));
});

// get all trips data
app.get('/trips', (req, res) => {
    knex
        .select('*')
        .from('trips')
        .then((data) => {
            res.json(data);
        })
        .catch((err) => res.send('Error getting trips data'));
});

app.listen(PORT, console.log(`running at http://localhost:${PORT}`));