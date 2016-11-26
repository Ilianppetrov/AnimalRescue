let Animal = require('../models/animal')
let User = require('../models/user')
let Message = require('../models/messages')

module.exports = {
  addMessage: (senderId, animalId, content) => {
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
      message.about = animal.name
      User.findById(animal.addedBy, (err, receiver) => {
        if (err) console.log(err)
        receiver.messagesReceived.push(message)
        receiver.unreadMessages += 1
        receiver.save()
        message.receivedBy = receiver
        message.save()
      })
    })
  },
  addResponse: (senderId, animalName, receiverId, content) => {
    let message = new Message({
      content: content
    })
    User.findById(senderId, (err, sender) => {
      if (err) console.log(err)
      sender.messagesSend.push(message)
      sender.save()
      message.sendBy = sender
    })
    message.about = animalName
    User.findById(receiverId, (err, receiver) => {
      if (err) console.log(err)
      receiver.messagesReceived.push(message)
      receiver.unreadMessages += 1
      receiver.save()
      message.receivedBy = receiver
      message.save()
    })
  }
}
