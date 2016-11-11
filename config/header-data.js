let Message = require('../models/messages')

module.exports = (req, res, next) => {
  if (req.user) {
    res.locals.headerData = {
      username: req.user.username,
      unreadMessages: req.user._doc.unreadMessages
    }
  }
  return next()
}

