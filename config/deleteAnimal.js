let mongoose = require('mongoose')
let Animal = require('../models/animal')
let connection = 'mongodb://localhost:27017/animal'
let User = require('../models/user')
mongoose.Promise = global.Promise
mongoose.connect(connection)


Animal.findById('5821d9f8bd572435e8c5b0d4')
  .then(animal => {
    User.findByIdAndUpdate(animal.addedBy, {'$pull': {'animals': {'_id': '5821d9f8bd572435e8c5b0d4'}}})
  })
