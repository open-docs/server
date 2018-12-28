const bodyParser = require('body-parser')
const express = require('express')
const Documents = require('./api/documents')
import cors from 'cors'
import {generalErrorHlr, authErrorHlr, notFoundErrorHlr} from './error_handlers'
import {authMW, optionalAuthMW} from './auth'
import {TABLE_NAMES} from './consts'

function _createError (message, status) {
  return {status: status || 400, message}
}

module.exports = (app, g) => {
  //
  Object.assign(g, {
    authMW,
    optionalAuthMW,
    createError: _createError,
    bodyParser: bodyParser.json()
  })

  process.env.USE_CORS === 'true' && app.use(cors())

  const documentApp = express()
  Documents(documentApp, g)
  app.use(`/${TABLE_NAMES.DOCUMENTS}`, documentApp)

  // ERROR HANDLING ------------------------------------------------------------
  app.use(notFoundErrorHlr, authErrorHlr, generalErrorHlr)
}
