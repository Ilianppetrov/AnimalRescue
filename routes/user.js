var express = require('express')
var router = express.Router()
let csrf = require('csurf')
let passport = require('passport')

let csrfProtection = csrf()
router.use(csrfProtection)

/* GET users listing. */
router.get('/signup', (req, res, next) => {
  let messages = req.flash('error')
  res.render('../views/users/signup', {csrfToken: req.csrfToken(), messages: messages, hasErrors: messages.length > 0})
})
router.post('/signup', passport.authenticate('local.signup', {
  successRedirect: '/user/profile',
  failureRedirect: '/user/signup',
  failureFlash: true
}))
router.get('/profile', (req, res, next) => {
  res.render('../views/users/profile')
})
router.get('/signin', (req, res, next) => {
  let messages = req.flash('error')
  res.render('../views/users/signin', {csrfToken: req.csrfToken(), messages: messages, hasErrors: messages.length > 0})
})
router.post('/signin', passport.authenticate('local.signin', {
  successRedirect: '/user/profile',
  failureRedirect: '/user/signin',
  failureFlash: true
}))

module.exports = router

