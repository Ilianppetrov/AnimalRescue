let Animal = require('../models/animal')
let User = require('../models/user')
let Message = require('../models/messages')


module.exports = (id) => {
  return new Promise((resolve, reject) => {
    let messages = []
    User.findById(id, (err, receiver) => {
      if (err) reject(err)
      let messagesReceived = receiver.messagesReceived
      for (let i = 0; i < messagesReceived.length; i++) {
        (function (messageId, index) {
          let singleMessage = {}
          Message.findById(messageId, (err, message) => {
            console.log(message)
            if (err) console.log(err)
            singleMessage.num = i + 1
            singleMessage.id = message._id
            singleMessage.content = message.content
            singleMessage.date = message.date.toDateString()
            singleMessage.seen = message.seen
            Animal.findById(message.about, (err, animal) => {
              if (animal === null) {
                singleMessage.about = 'Deleted'
              } else {
                if (err) reject(err)
                singleMessage.about = animal.name
              }
            })
            User.findById(message.sendBy, (err, sender) => {
              if (err) reject(err)
              singleMessage.sendBy = sender.username
              messages.push(singleMessage)
              if (index === messagesReceived.length - 1) {
                resolve(messages)
              }
            })
          })
        }(messagesReceived[i], i))
      }
    })
  })
}

