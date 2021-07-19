const bookshelf = require('../bookshelf');

const Comment = bookshelf.model('Comment', {
    tableName: 'comments',
    trip: function () {
        return this.belongsTo('Trip');
    },
});

module.exports = Comment;