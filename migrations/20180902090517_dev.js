exports.up = function (knex, Promise) {
    return knex.schema
        .createTable('todos', table => {
            table.increments('id').primary();
            table.integer('userId')
                .unsigned()
                .references('id')
                .inTable('users')
                .onDelete('SET NULL');
            table.string('message')
        })

        .createTable('users', table => {
            table.increments('id').primary()
            table.string('name')
            table.string('password')
            table.string('username')
            table.enu('permission',['admin','user'])
        })
};

exports.down = function (knex, Promise) {
    return knex.schema
        .dropTableIfExists('users')
        .dropTableIfExists('todos')

};