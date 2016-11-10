let Animal = require('../models/animal')
let User = require('../models/user')
let Message = require('../models/messages')

module.exports.addMessage = (senderId, animalId, content) => {
  let message = new Message({
    content: content
  })
  User.findById(senderId, (err, sender) => {
    if (err) console.log(err)
    sender.messagesSend.push(message)
    sender.save()
    message.sendBy = sender
  })
  Animal.findById(animalId, (err, animal) => {
    if (err) console.log(err)
    User.findById(animal.addedBy, (err, receiver) => {
      if (err) console.log(err)
      receiver.messagesRecieved.push(message)
      receiver.save()
      message.receivedBy = receiver
      message.save()
    })
  })
}
