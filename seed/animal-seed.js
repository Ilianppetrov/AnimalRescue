let mongoose = require('mongoose')
let Animal = require('../models/animal')
let connection = 'mongodb://localhost:27017/animal'
let User = require('../models/user')
mongoose.Promise = global.Promise
mongoose.connect(connection)

let id = '581cf972a3c0003e14002bb6'
Animal.findById('581c6f283c90db0c1002fa15')
  .then(cat => {
    User.findByIdAndUpdate(id, {
      $set: {username: 'Admin', animals: [cat]}
    }).exec()
  })





