let User = require('../models/user')
let Animal = require('../models/animal')

module.exports.toArray = (username) => {
  let animalsList = []
  User.findOne({'username': username}, (err, user) => {
    if (err) console.log(err)
    let animals = user.animals
    for (let i = 0; i < animals.length; i++) {
      (function (animal, index) {
        Animal.findById(animal, (err, data) => {
          if (err) console.log(err)
          animalsList.push(data)
          if (index === animals.length - 1) {
            console.log(animalsList)
            return animalsList
          }
        })
      }(animals[i], i))
    }
  })
}
