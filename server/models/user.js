const bookshelf = require('../bookshelf');

const User = bookshelf.model('User', {
    tableName: 'users',
    trips: function () {
        return this.hasMany('Trip');
    },
});

module.exports = User;