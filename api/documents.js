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
    g.knex(TABLE_NAMES.DOCUMENTS).where('id', req.params.id).update(req.body)
    .then(saved => {
      res.json(saved)
      next()
    })
    .catch(next)
  })

  app.put(`/:id/content`, g.authMW, g.bodyParser, (req, res, next) => {
    repo.writeContent(req.params.id, req.body.content, req.body.message)
    .then(saved => {
      res.json(req.body.content.length)
      next()
    })
    .catch(next)
  })

  app.get(`/list/:parent?`, (req, res, next) => {
    g.knex(TABLE_NAMES.DOCUMENTS).where('parent', req.params.parent || null)
    .then(found => {
      res.json(found)
      next()
    })
    .catch(next)
  })

  app.get(`/:id`, (req, res, next) => {
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
