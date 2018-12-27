import {TABLE_NAMES} from '../consts'

exports.up = (knex, Promise) => {
  return knex.schema.createTable(TABLE_NAMES.DOCUMENTS, (table) => {
    table.increments('id').primary()
    table.integer('parent').defaultTo(null)
    table.string('template', 64).defaultTo(null)
    table.string('name', 64).notNullable()
    table.integer('owner').notNullable()
    table.integer('size').notNullable().defaultTo(0)
    table.string('perms', 64).notNullable()
    table.enu('typ', ['folder', 'text']).defaultTo('folder')
    table.timestamp('created').notNullable().defaultTo(knex.fn.now())
    table.timestamp('changed')
    table.unique(['name', 'parent']) // ensure unique files within particular folder
  })
}

exports.down = (knex, Promise) => {
  return knex.schema.dropTable(TABLE_NAMES.DOCUMENTS)
}
