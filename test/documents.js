/* global describe it */
const chai = require('chai')
// const should = chai.should()
import {TABLE_NAMES} from '../consts'
import _ from 'underscore'

module.exports = function (g) {
  //
  const r = chai.request(g.baseurl)

  const p = {
    name: 'pok1',
    perms: 'aa'
  }

  return describe(TABLE_NAMES.DOCUMENTS, function () {
    //
    it('must not create a new document wihout auth', () => {
      return r.post(`/${TABLE_NAMES.DOCUMENTS}`).send(p)
      .then(res => {
        res.should.have.status(401)
      })
    })

    it('shall create a new document without mandatory item', () => {
      return r.post(`/${TABLE_NAMES.DOCUMENTS}`).send(_.omit(p, 'name'))
      .set('Authorization', g.gimpliToken)
      .then(res => {
        res.should.have.status(400)
      })
    })

    it('shall create a new document pok1', () => {
      return r.post(`/${TABLE_NAMES.DOCUMENTS}`).send(p)
      .set('Authorization', g.gimpliToken)
      .then(function (res) {
        res.should.have.status(201)
        res.should.have.header('content-type', /^application\/json/)
        p.id = res.body[0]
      })
    })

    it('shall update the document pok1', () => {
      const change = {
        name: 'pok1changed'
      }
      return r.put(`/${TABLE_NAMES.DOCUMENTS}/${p.id}`).send(change)
      .set('Authorization', g.gimpliToken)
      .then(res => {
        res.should.have.status(200)
      })
    })

    it('shall change document content', () => {
      const change = {
        content: 'test1 abcdefgh',
        message: 'change1'
      }
      return r.put(`/${TABLE_NAMES.DOCUMENTS}/${p.id}/content`).send(change)
      .set('Authorization', g.gimpliToken)
      .then(res => {
        res.should.have.status(200)
      })
    })

    it('shall get the pok1', () => {
      return r.get(`/${TABLE_NAMES.DOCUMENTS}/${p.id}/detail`)
      .then(res => {
        res.body.content.should.eql('test1 abcdefgh')
        res.should.have.status(200)
      })
    })
  })
}
