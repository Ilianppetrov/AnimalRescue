var express = require('express')
var router = express.Router()
let addMessage = require('../config/add-message')
let allMessages = require('../config/all-messages')
let changeStatus = require('../config/change-status')
let paginate = require('express-paginate')
let totalMessages = require('../config/my-messages-pagination')

router.use(paginate.middleware(10, 10))

router.get('/all', (req, res, next) => {
  if (req.user._doc.messagesReceived.length === 0) {
    return res.render('../views/messages/my-messages.hbs', {noMessages: true})
  }
  allMessages(req.session.passport.user, req.query.page, req.query.limit).then((messages) => {
    let pageCount = totalMessages(req.session.passport.user, req.query.limit)
    res.render('../views/messages/my-messages.hbs',
     {messages: messages,
      hasMessages: true,
      previous: res.locals.paginate.hasPreviousPages,
      previousValue: paginate.href(req)(true),
      next: res.locals.paginate.hasNextPages(2),
      nextValue: paginate.href(req)(false),
      pages: paginate.getArrayPages(req)(4, 2, req.query.page)
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


module.exports = router
