var express = require('express')
var router = express.Router()
// let csrf = require('csurf')
let multer = require('multer')
let fs = require('fs')
let Animal = require('../models/animal')
let User = require('../models/user')
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

router.get('/test', (req, res, next) => {
  Animal.find({}, (err, animals) => {
    res.send(animals)
  })
})
router.get('/profile/:id', (req, res, next) => {
  let animalId = req.params.id
  Animal.findById(animalId, (err, data) => {
    if (err) {
      res.render('/')
    }
    req.animalId = req.param.id
    if (req.session.passport) {
      if (req.session.passport.user == data._doc.addedBy) {
        return res.render('../views/animal/animal-profile.hbs', {data: data, notOwner: false})
      }
    }
    res.render('../views/animal/animal-profile.hbs', {data: data, notOwner: true})
  })
})

router.get('/add', (req, res, next) => {
  res.render('../views/animal/animal-add.hbs')
})

router.post('/add', upload.single('image'), (req, res, next) => {
  req.checkBody('name', 'Invalid name').notEmpty()
  req.checkBody('description', 'Description not enough').isLength({min: 10})
  let errors = req.validationErrors()
  if (errors) {
    let messages = []
    errors.forEach((error) => {
      messages.push(error.msg)
    })
    return res.render('../views/animal/animal-add.hbs', {messages: messages, hasErrors: messages.length > 0})
  }
  if (!req.body.year && !req.body.month) {
    return res.render('../views/animal/animal-add.hbs', {messages: ['We need some age'], hasErrors: true})
  }
  if (!req.file) {
    return res.render('../views/animal/animal-add.hbs', {messages: ['Uploading image is required'], hasErrors: true})
  }
  addingAnimal.addAnimal(req.body, req.file, req.session.passport.user)
  res.redirect('/')
})
router.get('/delete/:id', (req, res, next) => {
  let deleteId = req.params.id
  Animal.findByIdAndRemove(deleteId, (err, animal) => {
    if (err) console.log(err)
    fs.unlink('public\\' + animal.imagePath, (err, result) => {
      if (err) console.log(err)
    })
  })
  res.redirect('/user/animals')
})


module.exports = router
