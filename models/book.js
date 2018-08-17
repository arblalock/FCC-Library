const mongoose = require('mongoose')
const Schema = mongoose.Schema

let bookSchema = new Schema({
  title: String,
  comments: [String]
})

if (process.env.NODE_ENV === 'test') {
  module.exports = mongoose.model('test_book', bookSchema)
} else {
  module.exports = mongoose.model('book', bookSchema)
}
