let Message = require('../models/messages')
let User = require('../models/user')

module.exports = (id) => {
  Message.findById(id, (err, message) => {
    if (err) console.log(err)
    message.seen = true
    message.save()
    User.findById(message.receivedBy, (err, user) => {
      if (err) console.log(err)
      user.unreadMessages -= 1
      user.save()
    })
  })
}
