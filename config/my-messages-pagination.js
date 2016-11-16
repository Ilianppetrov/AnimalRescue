let User = require('../models/user')

module.exports = (id, limit) => {
  limit = limit || 10
  (function (id, limit) {
    User.findById(id, (err, user) => {
      if (err) console.log(err)
      let totalMessages = user.messagesReceived
      let pages = Math.floor(totalMessages / limit)
      return pages
    })
  }(id, limit))
}
