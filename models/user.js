let mongoose = require('mongoose')
let Animal = require('./animal')
let userSchema = mongoose.Schema({
  username: { type: String, require: true },
  password: { type: String, require: true },
  animals: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Animal' }]
})

module.exports = mongoose.model('User', userSchema)
