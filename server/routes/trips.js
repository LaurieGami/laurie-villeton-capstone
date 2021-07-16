const express = require('express');
const router = express.Router();
const Trip = require('../models/trip');

const authorize = require('../middlewares/auth');

router.route('/trips')
    // GET - /trips - get a list of all trips for a specific user
    .get(authorize, (req, res) => {
        Trip.where({ user_id: req.decoded.id })
            .fetchAll()
            .then((trips) => {
                res.status(200).json(trips);
            })
            .catch((err) => {
                res.status(400).json({ message: `Error getting trips for user ${req.decoded.id}`, error: err });
            });
    })
    // POST - /trips - create a trip for a specific user
    .post(authorize, (req, res) => {
        new Trip({
            name: req.body.name,
            user_id: req.decoded.id,
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
                res.status(400).json({ message: `Error, can't create a new trip for user ${req.decoded.id}`, error: err })
            );
    })

router.route('/trips/:tripId')
    .put(authorize, (req, res) => {
        Trip.where({ user_id: req.decoded.id, id: req.params.tripId })
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
                    add_info: req.body.add_info,
                    trip_status: req.body.trip_status
                })
                .then((updatedTrip) => {
                    res.status(200).json(updatedTrip);
                })
                .catch((err) => {
                    res.status(400).json({ message: `Error, can't update trip ${req.params.tripId} of user ${req.decoded.id}`, error: err })
                })
            });
    });

// Access does not require "authorize" as it should be accessible for everyone at this point in time
router.route('/trips/:tripId')
.get((req, res) => {
    Trip.where({ id: req.params.tripId })
        .fetch()
        .then((trip) => {
            res.status(200).json(trip);
        })
        .catch((err) =>
            res.status(400).json({ message: `Error getting trip ${req.params.tripId}`, error: err })
        );
})

module.exports = router;