let Animal = require('../models/animal')

module.exports = (array, animalId) => {
  return new Promise(function (resolve, reject) {
    Animal.findById(animalId, (err, animal) => {
      if (err) console.log(err)
      let totalLenght = animal.images.length + array.length
      if (totalLenght > 6) {
        let message = 'You can have up to 6 images'
        resolve({fail: message})
        return
      }
      for (let i = 0; i < array.length; i++) {
        (function (animalPic, index) {
          let imagePath = 'images/' + animalPic.filename
          animal.images.push(imagePath)
          if (i === array.length - 1) {
            animal.save()
            let message = 'successfully added'
            resolve({success: message})
          }
        }(array[i], i))
      }
    })
  })
}
