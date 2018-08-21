/*
*
*
*       FILL IN EACH FUNCTIONAL TEST BELOW COMPLETELY
*       -----[Keep the tests in the same order!]-----
*
*/

var chaiHttp = require('chai-http')
var chai = require('chai')
var assert = chai.assert
var server = require('../server')
const mongoose = require('mongoose')
let book = require('../models/book')
chai.use(chaiHttp)

let fakeBook = {title: 'Fake1', comments: ['liked a lot!']}

suite('Functional Tests', function () {

  suite('Routing tests', function () {
    let testID
    before(function () {
      let testBooks = [{title: 'Test1', comments: ['liked a lot!']}, {title: 'Test2', comments: []}]
      let oneBook = book(testBooks[0])
      oneBook.save((err, doc) => {
        if (err) return console.error(err)
        testID = doc._id
      })
    })
    suite('POST /api/books with title => create book object/expect book object', function () {
      test('Test POST /api/books with title', function (done) {
        chai.request(server)
          .post('/api/books')
          .send(fakeBook)
          .end(function (err, res) {
            if (err) return console.log(err)
            assert.equal(res.status, 200)
            assert.property(res.body, 'title', 'Books in array should contain title')
            assert.property(res.body, '_id', 'Books in array should contain _id')
            assert.property(res.body, 'comments', 'Books should have comments')
            done()
          })
      })

      test('Test POST /api/books with no title given', function (done) {
        chai.request(server)
          .post('/api/books')
          .send({comments: []})
          .end(function (err, res) {
            if (err) return console.log(err)
            assert.equal(res.status, 200)
            assert.equal(res.text, 'no title')
            done()
          })
      })
    })

    suite('GET /api/books => array of books', function () {
      test('Test GET /api/books', function (done) {
        chai.request(server)
          .get('/api/books')
          .end(function (err, res) {
            if (err) return console.log(err)
            assert.equal(res.status, 200)
            assert.isArray(res.body, 'response should be an array')
            assert.property(res.body[0], 'commentcount', 'Books in array should contain commentcount')
            assert.property(res.body[0], 'title', 'Books in array should contain title')
            assert.property(res.body[0], '_id', 'Books in array should contain _id')
            done()
          })
      })
    })

    suite('GET /api/books/[id] => book object with [id]', function () {
      test('Test GET /api/books/[id] with id not in db', function (done) {
        chai.request(server)
          .get('/api/books/9a9dawd9dka9')
          .end(function (err, res) {
            if (err) return console.log(err)
            assert.equal(res.status, 200)
            assert.equal(res.text, 'no book exists')
            done()
          })
      })

      test('Test GET /api/books/[id] with valid id in db', function (done) {
        chai.request(server)
          .get('/api/books/' + testID)
          .end(function (err, res) {
            if (err) return console.log(err)
            assert.equal(res.status, 200)
            assert.property(res.body, 'title', 'Books in array should contain title')
            assert.property(res.body, '_id', 'Books in array should contain _id')
            assert.property(res.body, 'comments', 'Books should have comments')
            done()
          })
      })
    })

    suite('POST /api/books/[id] => add comment/expect book object with id', function () {
      test('Test POST /api/books/[id] with comment', function (done) {
        chai.request(server)
          .post('/api/books/' + testID)
          .send({comment: 'test comment'})
          .end(function (err, res) {
            if (err) return console.log(err)
            assert.equal(res.status, 200)
            assert.property(res.body, 'title', 'Books in array should contain title')
            assert.property(res.body, '_id', 'Books in array should contain _id')
            assert.property(res.body, 'comments', 'Books should have comments')
            assert.equal(res.body.comments[res.body.comments.length - 1], 'test comment', 'added comment should be there')
            done()
          })
      })
    })

    after(function () {
      mongoose.connection.db.dropCollection('test_books', function (err, result) {
        if (err) return console.error(err)
        console.log('cleaned up database')
      })
    })
  })
})
