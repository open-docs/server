require('dotenv').config()
const express = require('express')
const App = require('./app')
const initDB = require('./db')

const app = express()

initDB().then(knex => {
  App(app, {knex})

  if (process.env.API_PORT) {
    const port = process.env.API_PORT
    app.listen(port, (err) => {
      if (err) {
        throw err
      }
      console.log(`radagast listens on ${port}`)
    })
  }
})
