var express = require('express')
var router = express.Router()
let Animal = require('../models/animal')

/* GET home page. */
router.get('/', (req, res, next) => {
  Animal.find({}, function (err, data) {
    if (err) console.log(err)
    let animalChunks = []
    let chunkSize = 3
    for (let i = 0; i < data.length; i += chunkSize) {
      animalChunks.push(data.slice(i, i + chunkSize))
    }
    req.session.newMessages = 30
    res.render('index', { title: 'Hello', animals: animalChunks })
  })
})

module.exports = router
