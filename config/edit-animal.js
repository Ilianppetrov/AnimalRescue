let Animal = require('../models/animal')

module.exports = (id, obj) => {
  Animal.findByIdAndUpdate(id, obj, (err) => {
    if (err) console.log(err)
  })
}
