import {TABLE_NAMES} from '../consts'
import GITRepo from './repository'

const repo = new GITRepo()

module.exports = (app, g) => {
  //
  app.post(`/`, g.authMW, g.bodyParser, (req, res, next) => {
    Object.assign(req.body, {owner: req.user.id})
    g.knex(TABLE_NAMES.DOCUMENTS).returning('id').insert(req.body)
    .then(savedid => {
      res.status(201).json(savedid)
      next()
    })
    .catch(next)
  })

  app.put(`/:id`, g.authMW, g.bodyParser, (req, res, next) => {
    const change = Object.assign(req.body, {changed: new Date()})
    g.knex(TABLE_NAMES.DOCUMENTS).where('id', req.params.id).update(change)
    .then(saved => {
      res.json(saved)
      next()
    })
    .catch(next)
  })

  app.put(`/:id/content`, g.authMW, g.bodyParser, (req, res, next) => {
    const change = {
      changed: new Date(),
      size: req.body.content.length
    }
    repo.writeContent(req.params.id, req.body.content, req.body.message)
    .then(saved => {
      return g.knex(TABLE_NAMES.DOCUMENTS).where('id', req.params.id).update(change)
    })
    .then(saved => {
      res.json(saved)
      next()
    })
    .catch(next)
  })

  app.get(`/list/:parent?`, g.optionalAuthMW, (req, res, next) => {
    let q = g.knex(TABLE_NAMES.DOCUMENTS).where('parent', req.params.parent || null)
    if (req.query._select) {
      q = q.select(req.query._select.split(','))
      delete req.query._select
    }
    for (let k in req.query || {}) {
      q = q.where(k, '=', req.query[k])
    }
    q.then(found => {
      res.json(found)
      next()
    })
    .catch(next)
  })

  app.get(`/:id/detail`, g.optionalAuthMW, (req, res, next) => {
    const q = g.knex(TABLE_NAMES.DOCUMENTS).where('id', req.params.id)
    const getContent = repo.getContent(req.params.id)
    Promise.all([q, getContent]).then(ress => {
      const data = ress[0][0]
      data.content = ress[1].toString()
      res.json(data)
      next()
    }).catch(next)
  })

  return app
}
