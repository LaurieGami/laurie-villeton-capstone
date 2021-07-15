exports.up = function (knex) {
    return knex.schema
        .createTable('users', (table) => {
            table.increments('id').primary();
            table.string('firstName').notNullable();
            table.string('lastName').notNullable();
            table.string('phone').notNullable();
            table.string('email').notNullable().unique();
            table.string('password').notNullable();
            table.timestamp('updated_at').defaultTo(knex.fn.now());
        })
        .createTable('trips', (table) => {
            table.increments('id').primary();
            table.string('name').notNullable();
            table
                .integer('user_id')
                .unsigned()
                .notNullable()
                .references('id')
                .inTable('users')
                .onUpdate('CASCADE')
                .onDelete('CASCADE');
            table.json('participants');
            table.json('emergency_contacts');
            table.datetime('departure_date');
            table.datetime('return_date');
            table.string('location');
            table.string('purpose');
            table.json('activities');
            table.json('supplies');
            table.string('add_info');
            table.json('comments');
            // table.boolean('min_info');
            table.string('trip_status').defaultTo('inactive');
            table.timestamp('updated_at').defaultTo(knex.fn.now());
        });
};

exports.down = function (knex) {
    return knex.schema.dropTable('trips').dropTable('users');
};