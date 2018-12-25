import {TABLE_NAMES} from '../consts'

exports.up = (knex, Promise) => {
  return knex.schema.createTable(TABLE_NAMES.DOCUMENTS, (table) => {
    table.increments('id').primary()
    table.integer('folder').defaultTo(0)
    table.string('template', 64).defaultTo(null)
    table.string('title', 64).notNullable()
    table.integer('owner').notNullable()
    table.string('perms', 64).notNullable()
    // table.enu('typ', ['enabled', 'disabled']).defaultTo('enabled')
    table.timestamp('created').notNullable().defaultTo(knex.fn.now())
    table.unique(['title', 'folder']) // ensure unique files within particular folder
  })
}

exports.down = (knex, Promise) => {
  return knex.schema.dropTable(TABLE_NAMES.DOCUMENTS)
}
