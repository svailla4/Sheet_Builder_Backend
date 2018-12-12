exports.up = function (knex, Promise) {
    return knex.schema
        .createTable('sheets', table => {
            table.increments('id').primary();
            table.string('title');
            table.string('content');
            table.integer('user_id').unique().unsigned().notNullable();
            table.foreign('user_id').references('id').inTable('users');
        })

        .createTable('users', table => {
            table.increments('id').primary();
            table.string('name').notNullable();
            table.string('password').notNullable();
            table.string('email').unique().notNullable();
            table.boolean('active');
            table.string('registration_token').nullable();
            table.enu('subscription',['freemium','premium']).notNullable();
        })
};

exports.down = function (knex, Promise) {
    return knex.schema
        .dropTableIfExists('users')
        .dropTableIfExists('sheets')
};