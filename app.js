var express = require('express')
var path = require('path')
var favicon = require('serve-favicon')
var cookieParser = require('cookie-parser')
var bodyParser = require('body-parser')
let expressHbs = require('express-handlebars')
let mongoose = require('mongoose')
let session = require('express-session')
let MongoStore = require('connect-mongo')(session)
let passport = require('passport')
let flash = require('connect-flash')
let validator = require('express-validator')
var app = express()

let connection = 'localhost:27017/animal'
mongoose.connect(connection)
require('./config/passport')

var routes = require('./routes/index')
var user = require('./routes/user')
var animal = require('./routes/animal')
var message = require('./routes/message')
let headerData = require('./config/header-data')


// view engine setup
app.engine('.hbs', expressHbs({defaultLayout: 'layout', extname: '.hbs'}))
app.set('view engine', '.hbs')

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: false }))
app.use(validator())
app.use(cookieParser())
app.use(session({
  secret: 'secretAnimal',
  resave: false,
  saveUninitialized: false,
  store: new MongoStore({mongooseConnection: mongoose.connection}),
  cookie: {maxAge: 180 * 60 * 1000}
}))
app.use(flash())
app.use(passport.initialize())
app.use(passport.session())
app.use(headerData)
app.use(express.static(path.join(__dirname, 'public')))

app.use((req, res, next) => {
  res.locals.login = req.isAuthenticated()
  res.locals.session = req.session
  next()
})


app.use('/user', user)
app.use('/animal', animal)
app.use('/message', message)
app.use('/', routes)

// catch 404 and forward to error handler
app.use((req, res, next) => {
  var err = new Error('Not Found')
  err.status = 404
  next(err)
})

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use((err, req, res, next) => {
    res.status(err.status || 500)
    res.render('error', {
      message: err.message,
      error: err
    })
  })
}

// production error handler
// no stacktraces leaked to user
app.use((err, req, res, next) => {
  res.status(err.status || 500)
  res.render('error', {
    message: err.message,
    error: {}
  })
})


module.exports = app
