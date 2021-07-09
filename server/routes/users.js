const express = require('express');
const router = express.Router();
const User = require('../models/user');

const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
// const authorize = require('../middlewares/auth');
require('dotenv').config();

const SALT_ROUNDS = 8;
const JWT_SECRET = process.env.JWT_SECRET;

const signJWTToken = user => {
    const token = jwt.sign(
        {
            id: user.id,
            sub: user.attributes.email
        },
        JWT_SECRET,
        { expiresIn: '8h' }
    );

    return token;
};

router.route('/register') // POST - /users
    .post((req, res) => {
        const { password } = req.body;

        bcrypt.hash(password, SALT_ROUNDS, (err, hashedPassword) => {
            if (err) return res.status(500).json({ message: "Couldn't encrypt the password" });

            new User({
                ...req.body,
                password: hashedPassword
            })
                .save()
                .then((newUser) => {
                    const token = signJWTToken(newUser);

                    return res.status(201).json({ authToken: token });
                })
                .catch((err) => {
                    return res.status(400).json({ message: "Couldn't create a new user. Please check your inputs.", error: err });
                });
        });
    });

router.route('/login')
    .post((req, res) => {
        const { email, password } = req.body;

        User.where({ email })
            .fetch()
            .then(user => {
                bcrypt.compare(password, user.attributes.password, (_, success) => {
                    if (success) {
                        const token = signJWTToken(user);
                        return res.status(200).json({ authToken: token });
                    } else {
                        return res.status(403).json({ message: 'Username/password combination is wrong' });
                    }
                })
            })
            .catch(() => {
                return res.status(400).json({ message: "User is not found" });
            })
    })

router.route('/users/:userId') // GET - /profile
    .get((req, res) => {
        User.where({ id: req.params.userId })
            .fetch()
            .then((user) => {
                res.status(200).json(user);
            })
            .catch((err) =>
                res.status(400).json({ message: `Error, can't get user with userId of ${req.params.userId}`, error: err })
            );
    })
    .put((req, res) => {
        User.where({ id: req.params.userId })
            .fetch()
            .then((user) => {
                user
                    .save({
                        firstName: req.body.firstName,
                        lastName: req.body.lastName,
                        phone: req.body.phone,
                        email: req.body.email,
                        address: req.body.address,
                        city: req.body.city,
                        province: req.body.province,
                        country: req.body.country
                    })
                    .then((updatedUser) => {
                        res.status(200).json(updatedUser);
                    })
                    .catch((err) => {
                        res.status(400).json({ message: `Error, can't update user with userId of ${req.params.userId}`, error: err })
                    });
            });
    });

module.exports = router;