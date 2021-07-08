
exports.up = function (knex) {
    return knex.schema
        .createTable('users', (table) => {
            table.increments('id').primary();
            table.string('firstName').notNullable();
            table.string('lastName').notNullable();
            table.string('phone').notNullable();
            table.string('email').notNullable();
            table.string('address').notNullable();
            table.string('city').notNullable();
            table.string('province').notNullable();
            table.string('country').notNullable();
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
            table.json('participants').notNullable();
            table.json('emergency_contacts').notNullable();
            table.datetime('departure_date').notNullable();
            table.datetime('return_date').notNullable();
            table.string('location').notNullable();
            table.string('purpose').notNullable();
            table.json('activities').notNullable();
            table.json('supplies').notNullable();
            table.string('add_info').notNullable();
            table.json('comments').notNullable();
            table.timestamp('updated_at').defaultTo(knex.fn.now());
        });
};

exports.down = function (knex) {
    return knex.schema.dropTable('users').dropTable('trips');
};
