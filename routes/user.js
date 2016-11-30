var express = require('express')
var router = express.Router()
let csrf = require('csurf')
let passport = require('passport')
let animalArray = require('../config/render-animals')


let csrfProtection = csrf()
router.use('/', csrfProtection)

router.get('/profile', isLoggedIn, (req, res, next) => {
  res.render('../views/users/profile')
})
router.get('/animals/list', isLoggedIn, (req, res, next) => {
  animalArray.toArray(req.session.passport.user).then((animalsList) => {
    if (animalsList.length > 0) {
      res.render('../views/users/animals', {animals: animalsList, hasAnimals: true})
    } else {
      res.render('../views/users/animals', {noAnimals: true})
    }
  })
})

router.get('/logout', isLoggedIn, (req, res, next) => {
  req.logout()
  res.redirect('/')
})
router.use('/', isNotLoggedIn)

router.get('/signup', (req, res, next) => {
  let messages = req.flash('error')
  res.render('../views/users/signup', {csrfToken: req.csrfToken(), messages: messages, hasErrors: messages.length > 0})
})

router.post('/signup', passport.authenticate('local.signup', {
  successRedirect: '/',
  failureRedirect: '/user/signup',
  failureFlash: true
}))

router.get('/signin', (req, res, next) => {
  let messages = req.flash('error')
  res.render('../views/users/signin', {csrfToken: req.csrfToken(), messages: messages, hasErrors: messages.length > 0})
})

router.post('/signin', passport.authenticate('local.signin', {
  successRedirect: '/',
  failureRedirect: '/user/signin',
  failureFlash: true
}))

module.exports = router

function isLoggedIn (req, res, next) {
  if (req.isAuthenticated()) {
    return next()
  }
  res.redirect('/user/signin')
}

function isNotLoggedIn (req, res, next) {
  if (!req.isAuthenticated()) {
    return next()
  }
  res.redirect('/')
}
