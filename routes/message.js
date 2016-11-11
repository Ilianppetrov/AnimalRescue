var express = require('express')
var router = express.Router()
let addMessage = require('../config/add-message')
let allMessages = require('../config/all-messages')
let changeStatus = require('../config/change-status')

router.post('/change/:id', (req, res, next) => {
  changeStatus(req.params.id)
  res.sendStatus(200)
})
router.get('/all', (req, res, next) => {
  allMessages(req.session.passport.user).then((messages) => {
    res.render('../views/messages/my-messages.hbs', {messages: messages})
  })
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


module.exports = router
