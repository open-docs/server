import {TABLE_NAMES} from '../consts'

exports.up = (knex, Promise) => {
  return knex.schema.createTable(TABLE_NAMES.DOCUMENTS, (table) => {
    table.increments('id').primary()
    table.string('title', 64).notNullable()
    table.integer('owner').notNullable()
    table.string('perms', 64).notNullable()
    // table.enu('typ', ['enabled', 'disabled']).defaultTo('enabled')
    table.timestamp('created').notNullable().defaultTo(knex.fn.now())
    table.unique(['username'])
  })
}

exports.down = (knex, Promise) => {
  return knex.schema.dropTable(TABLE_NAMES.DOCUMENTS)
}
