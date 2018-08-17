const mongoose = require('mongoose')
const Schema = mongoose.Schema

let bookSchema = new Schema({
  title: String,
  comments: [String]
})

module.exports = mongoose.model('book', bookSchema)
