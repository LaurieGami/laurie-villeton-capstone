const bookshelf = require('../bookshelf');

const Trip = bookshelf.model('Trip', {
    tableName: 'trips',
    warehouse: function () {
        return this.belongsTo('User');
    },
});

module.exports = Trip;