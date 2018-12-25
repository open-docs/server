const bodyParser = require('body-parser')
const express = require('express')
const Documents = require('./api/documents')
import {generalErrorHlr, authErrorHlr, notFoundErrorHlr} from './error_handlers'
import {JWTMiddleware} from './auth'
import {TABLE_NAMES} from './consts'

function _createError (message, status) {
  return {status: status || 400, message}
}

module.exports = (app, g) => {
  //
  g.authMW = g.authMW || JWTMiddleware
  g.createError = _createError
  g.bodyParser = bodyParser.json()

  const documentApp = express()
  Documents(documentApp, g)
  app.use(`/${TABLE_NAMES.DOCUMENTS}`, documentApp)

  // ERROR HANDLING ------------------------------------------------------------
  app.use(notFoundErrorHlr, authErrorHlr, generalErrorHlr)
}
