const express = require('express');
const User = require('../models/user');
const router = express.Router();

router.route('/users')
    .post((req, res) => {
        new User({
            firstName: req.body.firstName,
            lastName: req.body.lastName,
            phone: req.body.phone,
            email: req.body.email,
            address: req.body.address,
            city: req.body.city,
            province: req.body.province,
            country: req.body.country
        })
            .save()
            .then((newUser) => {
                res.status(201).json(newUser);
            })
            .catch((err) =>
                res.status(400).json({ message: "Error, can't create a new user", error: err })
            );
    });

router.route('/users/:userId')
    .get((req, res) => {
        User.where({ id: req.params.userId }) // add { withRelated: ['trips'] } if you want trips too
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