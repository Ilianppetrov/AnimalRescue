let Animal = require('../models/animal')
let User = require('../models/user')

module.exports.addAnimal = (obj, obj2, id) => {
  let animal = new Animal({
    imagePath: 'images/' + obj2.filename,
    name: obj.name,
    description: obj.description,
    age: obj.age
  })
  User.findById(id, (err, user) => {
    if (err) console.log(err)
    animal.addedBy = user
    animal.save()
    user.animals = [animal]
    user.save()
  })
}
