let passport = require('passport')
let User = require('../models/user')
let LocalStrategy = require('passport-local').Strategy

passport.serializeUser((user, done) => {
  done(null, user.id)
})
passport.deserializeUser((id, done) => {
  User.findById(id, (err, user) => {
    done(err, user)
  })
})

passport.use('local.signup', new LocalStrategy({
  usernameField: 'username',
  passportField: 'password',
  passReqToCallback: true
}, (req, username, password, done) => {
  req.checkBody('username', 'Invalid Username').notEmpty()
  req.checkBody('password', 'Invalid Password').notEmpty().isLength({min: 4})
  let errors = req.validationErrors()
  if (errors) {
    let messages = []
    errors.forEach((error) => {
      messages.push(error.msg)
    })
    return done(null, false, req.flash('error', messages))
  }
  User.findOne({'username': username}, (err, user) => {
    if (err) {
      return done(err)
    }
    if (user) {
      return done(null, false, {message: 'Username already in use'})
    }
    if (req.body.repassword !== password) {
      return done(null, false, {message: 'Passwords do not match'})
    }
    let newUser = new User()
    newUser.username = username
    newUser.password = newUser.encryptPassword(password)
    newUser.save((err, result) => {
      if (err) {
        return done(err)
      }
      return done(null, newUser)
    })
  })
}))

passport.use('local.signin', new LocalStrategy({
  usernameField: 'username',
  passportField: 'password',
  passReqToCallback: true
}, (req, username, password, done) => {
  req.checkBody('username', 'Invalid Username').notEmpty()
  req.checkBody('password', 'Invalid Password').notEmpty().isLength({min: 4})
  let errors = req.validationErrors()
  if (errors) {
    let messages = []
    errors.forEach((error) => {
      messages.push(error.msg)
    })
    return done(null, false, req.flash('error', messages))
  }
  User.findOne({'username': username}, (err, user) => {
    if (err) {
      return done(err)
    }
    if (!user) {
      return done(null, false, {message: 'No user found'})
    }
    if (!user.validatePassword(password)) {
      return done(null, false, {message: 'Wrong password'})
    }
    return done(null, user)
  })
}))

