var express = require('express')
var router = express.Router()
let Animal = require('../models/animal')

router.get('/profile/:id', (req, res, next) => {
  let animalId = req.params.id
  console.log(animalId)
  Animal.findById(animalId, (err, data) => {
    console.log(data)
    if (err) {
      res.render('/')
    }
    res.render('../views/animal/animal-profile.hbs', {data: data})
  })
})

module.exports = router
