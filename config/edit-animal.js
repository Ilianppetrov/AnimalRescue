let Animal = require('../models/animal')
let fs = require('fs')

module.exports = {
  editAnimal: (id, obj) => {
    Animal.findByIdAndUpdate(id, obj, (err) => {
      if (err) console.log(err)
    })
  },
  deletePicture: (id, obj) => {
    Animal.findById(id, (err, animal) => {
      if (err) console.log(err)
      for (let i = 0, len = animal.images.length; i < len; i++) {
        if (animal.images[i] === obj.path) {
          animal.images.splice(i, 1)
        }
        animal.save()
      }
    })
    fs.unlink('public\\' + obj.path, (err, result) => {
      if (err) console.log(err)
    })
  },
  changePicture: (id, obj) => {
    Animal.findById(id, (err, animal) => {
      if (err) console.log(err)
      let originalImage = animal.imagePath
      for (let i = 0, len = animal.images.length; i < len; i++) {
        if (animal.images[i] === obj.path) {
          animal.imagePath = animal.images[i]
          animal.images.set(i, originalImage)
        }
        animal.save()
      }
    })
  },
  deleteAnimal: (id) => {
    Animal.findByIdAndRemove(id, (err, animal) => {
      if (err) console.log(err)
      fs.unlink('public\\' + animal.imagePath, (err, result) => {
        if (err) console.log(err)
      })
      animal.images.forEach((image) => {
        fs.unlink('public\\' + image, (err, result) => {
          if (err) console.log(err)
        })
      })
    })
  },
  adoptedAnimal: (id) => {
    Animal.findByIdAndUpdate(id, {adopted: true}, (err) => {
      if (err) console.log(err)
    })
  }
}

