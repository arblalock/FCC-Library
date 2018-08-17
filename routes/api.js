/*
*
*
*       Complete the API routing below
*
*
*/

'use strict'

const book = require('../models/book')
const mongoose = require('mongoose')

module.exports = function (app, db) {
  app.route('/api/books')
    .get(function (req, res) {
      book.find({}, (err, result) => {
        if (err) return console.log(err)
        let bks = []
        for (let i = 0; i < result.length; i++) {
          bks.push({_id: result[i]._id, book_title: result[i].title, num_of_comments: result[i].comments.length})
        }
        return res.send(bks)
      })
    })

    .post(function (req, res) {
      // console.
      if (!req.body.title || typeof req.body.title !== 'string') return res.send('no title')
      let newBook = book({title: req.body.title, comments: []})
      newBook.save((err, doc) => {
        if (err) return console.error(err)
        return res.json(doc)
      })
    })

    .delete(function (req, res) {
      // if successful response will be 'complete delete successful'
    })
    //* ***********start here***************
  app.route('/api/books/:id')
    .get(function (req, res) {
      // var bookid = req.params.id
      // json res format: {"_id": bookid, "title": book_title, "comments": [comment,comment,...]}
    })
    // for positing comments
    .post(function (req, res) {
      var bookid = req.params.id
      var comment = req.body.comment
      if (!bookid || !mongoose.Types.ObjectId.isValid(bookid)) return res.send('invalid id')
      if (!comment) return res.send('no comment')
      book.findByIdAndUpdate(bookid, {$push: {comments: comment}}, {new: true}, (err, doc) => {
        if (err) return console.error(err)
        if (!doc) return res.send('no book exists')
        return res.send(doc)
      })
    })

    .delete(function (req, res) {
      // var bookid = req.params.id
      // if successful response will be 'delete successful'
    })
}
