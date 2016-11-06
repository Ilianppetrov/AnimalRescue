var express = require('express')
var router = express.Router()
// let csrf = require('csurf')
let multer = require('multer')
let Animal = require('../models/animal')
let addingAnimal = require('../config/add-animal')

let storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, './public/images')
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + '-' + file.originalname)
  }
})
let upload = multer({storage: storage})

// let csrfProtection = csrf()
// router.use('/', csrfProtection)

router.get('/profile/:id', (req, res, next) => {
  let animalId = req.params.id
  Animal.findById(animalId, (err, data) => {
    console.log(data)
    if (err) {
      res.render('/')
    }
    res.render('../views/animal/animal-profile.hbs', {data: data})
  })
})

router.get('/add', (req, res, next) => {
  res.render('../views/animal/animal-add.hbs')
})

router.post('/add', upload.single('image'), (req, res, next) => {
  console.log(req.file)
  addingAnimal.addAnimal(req.body, req.file, req.session.passport.user)
  res.redirect('/')
})

module.exports = router
