const userData = require('../seed_data/users');
const tripData = require('../seed_data/trips');

exports.seed = function (knex) {
    return knex('users').del()
        .then(function () {
            return knex('users').insert(userData);
        })
        .then(() => {
            return knex('trips').del();
        })
        .then(() => {
            return knex('trips').insert(tripData);
        });
};
