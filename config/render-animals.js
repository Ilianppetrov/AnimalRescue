let User = require('../models/user')
let Animal = require('../models/animal')

module.exports.toArray = (id) => {
  return new Promise(function (resolve, reject) {
    let animalsList = []
    User.findById(id, (err, user) => {
      if (err) console.log(err)
      let animals = user.animals
      if (animals.length === 0) {
        resolve(animalsList)
      }
      for (let i = 0; i < animals.length; i++) {
        (function (animal, index) {
          Animal.findById(animal, (err, data) => {
            if (data !== null) {
              animalsList.push(data)
            }
            if (err) console.log(err)
            if (index === animals.length - 1) {
              resolve(animalsList)
            }
          })
        }(animals[i], i))
      }
    })
  })
}
