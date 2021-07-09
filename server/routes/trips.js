const express = require('express');
const Trip = require('../models/trip');
const router = express.Router();

router.route('/trips/:userId')
    .get((req, res) => {
        Trip.where({ user_id: req.params.userId })
            .fetchAll()
            .then((trips) => {
                res.status(200).json(trips);
            })
            .catch((err) => {
                res.status(400).json({ message: `Error getting trips for user ${req.params.userId}`, error: err });
            });
    })
    .post((req, res) => {
        new Trip({
            name: req.body.name,
            user_id: req.params.userId,
            participants: JSON.stringify(req.body.participants),
            emergency_contacts: JSON.stringify(req.body.emergency_contacts),
            departure_date: req.body.departure_date,
            return_date: req.body.return_date,
            location: req.body.location,
            purpose: req.body.purpose,
            activities: JSON.stringify(req.body.activities),
            supplies: JSON.stringify(req.body.supplies),
            add_info: req.body.add_info
        })
            .save()
            .then((newTrip) => {
                res.status(201).json(newTrip);
            })
            .catch((err) =>
                res.status(400).json({ message: `Error, can't create a new trip for user ${req.params.userId}`, error: err })
            );
    });


router.route('/trips/:userId/:tripId')
    .get((req, res) => {
        Trip.where({ user_id: req.params.userId, id: req.params.tripId })
            .fetch()
            .then((trip) => {
                res.status(200).json(trip);
            })
            .catch((err) =>
                res.status(400).json({ message: `Error getting trip ${req.params.tripId} for user ${req.params.userId}`, error: err })
            );
    })
    .put((req, res) => {
        Trip.where({ user_id: req.params.userId, id: req.params.tripId })
            .fetch()
            .then((trip) => {
                trip
                .save({
                    name: req.body.name,
                    participants: JSON.stringify(req.body.participants),
                    emergency_contacts: JSON.stringify(req.body.emergency_contacts),
                    departure_date: req.body.departure_date,
                    return_date: req.body.return_date,
                    location: req.body.location,
                    purpose: req.body.purpose,
                    activities: JSON.stringify(req.body.activities),
                    supplies: JSON.stringify(req.body.supplies),
                    add_info: req.body.add_info
                })
                .then((updatedTrip) => {
                    res.status(200).json(updatedTrip);
                })
                .catch((err) => {
                    res.status(400).json({ message: `Error, can't update trip ${req.params.tripId} of user ${req.params.userId}`, error: err })
                })
            });
    });


module.exports = router;