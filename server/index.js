const express = require('express');
const cors = require("cors");

require('dotenv').config();
const PORT = process.env.PORT || 5000;

// Routes
const app = express();
const usersRoute = require('./routes/users');
const tripsRoute = require('./routes/trips');

// Middlewares
app.use(express.json());
// app.use(express.static("public"));
app.use(cors());
app.use(express.urlencoded({ extended: false })); // not sure what this is for

app.get('/', (req, res) => {
    res.send('Welcome to my API');
});

app.use('/api', usersRoute);
app.use('/api', tripsRoute);

app.listen(PORT, console.log(`running at http://localhost:${PORT}`));