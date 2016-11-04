let mongoose = require('mongoose')
let Animal = require('../models/animal')
let connection = 'mongodb://localhost:27017/animal'
mongoose.connect(connection)

new Animal({
  imagePath: 'https://encrypted-tbn2.gstatic.com/images?q=tbn:ANd9GcTUDQgbT9PFaERFaLbqP8sFsyq2r3sSYu6BtCj63z90tLEpALgo',
  name: 'Michael',
  description: 'Cool guy',
  age: 8
}).save()
