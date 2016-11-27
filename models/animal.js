let mongoose = require('mongoose')
let User = require('./user')
let mongoosePaginate = require('mongoose-paginate')
let animalSchema = mongoose.Schema({
  imagePath: { type: String, require: true },
  name: { type: String, require: true },
  description: String,
  years: Number,
  months: Number,
  added: { type: Date, default: Date.now },
  addedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  images: [{ type: String }],
  adopted: { type: Boolean, default: false }
})
animalSchema.plugin(mongoosePaginate)
module.exports = mongoose.model('Animal', animalSchema)
