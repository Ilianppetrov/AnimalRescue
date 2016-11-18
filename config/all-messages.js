let Animal = require('../models/animal')
let User = require('../models/user')
let Message = require('../models/messages')


module.exports = (id, page, limit) => {
  page = page - 1 || 0
  limit = limit || 10
  let currentIndex = page * limit
  let nextIndex = (page * limit) + limit
  return new Promise((resolve, reject) => {
    let messages = []
    User.findById(id, (err, receiver) => {
      if (err) reject(err)
      let messagesReceived = receiver.messagesReceived
      for (let i = 0; i < messagesReceived.length; i++) {
        (function (messageId, index) {
          let singleMessage = {}
          Message.findById(messageId, (err, message) => {
            if (err) console.log(err)
            singleMessage.num = i + 1
            singleMessage.id = message._id
            singleMessage.content = message.content
            singleMessage.date = message.date.toLocaleString()
            singleMessage.seen = message.seen
            Animal.findById(message.about, (err, animal) => {
              if (animal === null) {
                singleMessage.about = 'Deleted'
              } else {
                if (err) reject(err)
                singleMessage.about = animal.name
                singleMessage.aboutId = animal._id
              }
            })
            User.findById(message.sendBy, (err, sender) => {
              if (err) reject(err)
              singleMessage.sendBy = sender.username
              singleMessage.sendById = sender._doc._id + ''
              messages.push(singleMessage)
              if (messages.length === messagesReceived.length) {
                messages.sort(function (a, b) {
                  if (a.date < b.date) {
                    return 1
                  }
                  if (a.date > b.date) {
                    return -1
                  }
                  return 0
                })
                let slicedMessages = messages.slice(currentIndex, nextIndex)
                resolve(slicedMessages)
              }
            })
          })
        }(messagesReceived[i], i))
      }
    })
  })
}

