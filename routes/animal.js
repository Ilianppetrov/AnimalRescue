var express = require('express')
var router = express.Router()
// let csrf = require('csurf')
let multer = require('multer')
let Animal = require('../models/animal')
let addingAnimal = require('../config/add-animal')
let addImages = require('../config/add-images')
let animalEdit = require('../config/edit-animal')
let resizeImages = require('../config/image-editor')


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


router.use('/', isLoggedIn)

router.get('/add', (req, res, next) => {
  res.render('../views/animal/animal-add.hbs')
})

router.post('/add', upload.single('image'), (req, res, next) => {
  req.checkBody('name', 'Invalid name').notEmpty()
  req.checkBody('description', 'Description not enough').isLength({min: 10})
  resizeImages.editSingleImage('public/images/' + req.file.filename)
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
  animalEdit.deleteAnimal(req.params.id)
  res.redirect('/user/animals')
})

router.get('/adopted/:id', (req, res, next) => {
  animalEdit.adoptedAnimal(req.params.id)
  res.redirect('/user/animals')
})

router.get('/edit-profile/:id', (req, res, next) => {
  Animal.findById(req.params.id, (err, data) => {
    if (err) console.log(err)
    res.render('../views/animal/animal-edit.hbs', {data: data})
  })
})

router.post('/edit/details/:id', (req, res, next) => {
  animalEdit.editAnimal(req.params.id, req.body)
  res.sendStatus(200)
})

router.post('/edit/picture/:id', (req, res, next) => {
  animalEdit.deletePicture(req.params.id, req.body)
  res.sendStatus(200)
})
router.post('/edit/changePicture/:id', (req, res, next) => {
  animalEdit.changePicture(req.params.id, req.body)
  res.sendStatus(200)
})
router.get('/add-images/:id', (req, res, next) => {
  res.redirect('/animal/edit-profile/:id')
})
router.post('/add-images/:id', upload.array('images', 6), (req, res, next) => {
  resizeImages.editMultipleImages(req.files)
  addImages(req.files, req.params.id).then(message => {
    Animal.findById(req.params.id, (err, data) => {
      if (err) console.log(err)
      res.render('../views/animal/animal-edit.hbs', {data: data, success: message.success, fail: message.fail, hasMessage: true})
    })
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


module.exports = router

function isLoggedIn (req, res, next) {
  if (req.isAuthenticated()) {
    return next()
  }
  res.redirect('/user/signin')
}
