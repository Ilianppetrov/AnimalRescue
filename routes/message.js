var express = require('express')
var router = express.Router()
let addMessage = require('../config/add-message')
let allMessages = require('../config/all-messages')
let changeStatus = require('../config/change-status')
let paginate = require('express-paginate')
let User = require('../models/user')

router.use(paginate.middleware(10, 10))

router.get('/', isLoggedIn)

router.get('/all', (req, res, next) => {
  if (req.user._doc.messagesReceived.length === 0) {
    return res.render('../views/messages/my-messages.hbs', {noMessages: true})
  }
  allMessages(req.session.passport.user, req.query.page, req.query.limit).then((messages) => {
    User.findById(req.session.passport.user, (err, user) => {
      if (err) console.log(err)
      let totalMessages = user.messagesReceived.length
      let totalPages = Math.ceil(totalMessages / req.query.limit)
      res.render('../views/messages/my-messages.hbs',
          {messages: messages,
          hasMessages: true,
          previous: res.locals.paginate.hasPreviousPages,
          previousValue: paginate.href(req)(true),
          next: res.locals.paginate.hasNextPages(totalPages),
          nextValue: paginate.href(req)(false),
          pages: paginate.getArrayPages(req)(4, totalPages, req.query.page)
      })
    })
  })
})
router.post('/change/:id', (req, res, next) => {
  changeStatus(req.params.id)
  res.sendStatus(200)
})
router.get('/send/:id', (req, res, next) => {
  res.render('../views/messages/message-send.hbs', {id: req.params.id})
})
router.post('/send/:id', (req, res, next) => {
  if (!req.params.id) {
    return res.redirect('/')
  }
  req.checkBody('content', 'Can not send empty messages').notEmpty()
  let errors = req.validationErrors()
  if (errors) {
    let messages = []
    errors.forEach((error) => {
      messages.push(error.msg)
    })
    return res.render('../views/messages/message-send.hbs', {id: req.params.id, messages: messages, hasErrors: messages.length > 0})
  }
  addMessage.addMessage(req.session.passport.user, req.params.id, req.body.content)
  res.render('../views/messages/message-send.hbs', {id: req.params.id, message: 'Message send', noErrors: true})
})
router.get('/response/:id/:animalId', (req, res, next) => {
  res.render('../views/messages/message-response.hbs', {id: req.params.id, animalId: req.params.animalId})
})
router.post('/response/:id/:animalId', (req, res, next) => {
  if (!req.params.id) {
    return res.redirect('/')
  }
  req.checkBody('content', 'Can not send empty messages').notEmpty()
  let errors = req.validationErrors()
  if (errors) {
    let messages = []
    errors.forEach((error) => {
      messages.push(error.msg)
    })
    return res.render('../views/messages/message-response.hbs', {id: req.params.id, animalId: req.params.animalId, messages: messages, hasErrors: messages.length > 0})
  }
  addMessage.addResponse(req.session.passport.user, req.params.animalId, req.params.id, req.body.content)
  res.render('../views/messages/message-send.hbs', {id: req.params.id, animalId: req.params.animalId, message: 'Message send', noErrors: true})
})

module.exports = router

function isLoggedIn (req, res, next) {
  if (req.isAuthenticated()) {
    return next()
  }
  res.redirect('/user/signin')
}
