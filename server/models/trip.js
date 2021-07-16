const bookshelf = require('../bookshelf');

const Trip = bookshelf.model('Trip', {
    tableName: 'trips',
    user: function () {
        return this.belongsTo('User');
    },
    comments: function () {
        return this.hasMany('Comment');
    },
});

module.exports = Trip;