let mongoose = require('mongoose')
let User = require('../models/user')
let Animal = require('../models/animal')
let mongoosePaginate = require('mongoose-paginate')

let messageSchema = new mongoose.Schema({
  content: {type: String, require: true},
  seen: {type: Boolean, default: false},
  sendBy: {type: mongoose.Schema.Types.ObjectId, ref: 'User'},
  receivedBy: {type: mongoose.Schema.Types.ObjectId, ref: 'User'},
  about: String,
  date: {type: Date, default: Date.now}
})
messageSchema.plugin(mongoosePaginate)
module.exports = mongoose.model('Message', messageSchema)
