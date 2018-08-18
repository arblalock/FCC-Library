'use strict'
try {
  require('dotenv').config()
} catch (e) {
  console.log('no dotenv module')
}
var express = require('express')
var bodyParser = require('body-parser')
var cors = require('cors')
const helmet = require('helmet')
var apiRoutes = require('./routes/api.js')
var fccTestingRoutes = require('./routes/fcctesting.js')
var runner = require('./test-runner')
var app = express()
const mongoose = require('mongoose')
app.use('/public', express.static(process.cwd() + '/public'))
app.use(helmet({
  hidePoweredBy: {
    setTo: 'PHP 4.2.0'
  }
}))
app.use(helmet.noCache())
app.use(cors({origin: '*'})) // USED FOR FCC TESTING PURPOSES ONLY!

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))

mongoose.connect(process.env.DB, (err, db) => {
  if (err) return console.error(err)

  // Index page (static HTML)
  app.route('/')
    .get(function (req, res) {
      res.sendFile(process.cwd() + '/views/index.html')
    })
  fccTestingRoutes(app)
  apiRoutes(app, db)

  app.listen(process.env.PORT || 3000, function () {
    console.log('Listening on port ' + (process.env.PORT || 3000))

    if (process.env.NODE_ENV === 'test') {
      console.log('Running Tests...')
      setTimeout(function () {
        try {
          runner.run()
        } catch (e) {
          var error = e
          console.log('Tests are not valid:')
          console.log(error)
        }
      }, 3500)
    }
  })
  // 404 Not Found Middleware
  app.use(function (req, res, next) {
    res.status(404)
      .type('text')
      .send('Not Found')
  })
})

module.exports = app // for unit/functional testing
