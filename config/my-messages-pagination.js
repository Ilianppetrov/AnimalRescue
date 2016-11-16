let User = require('../models/user')

module.exports = (req, res, next) => {
  console.log('yes')
  next()
}
