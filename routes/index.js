var express = require('express')
var router = express.Router()
let Animal = require('../models/animal')
let paginate = require('express-paginate')
let searchQuery = require('../config/search-query')

router.use(paginate.middleware(9, 9))
/* GET home page. */
router.get('/', (req, res, next) => {
  searchQuery(req.query).then((queryObj) => {
    Animal.paginate(queryObj, { page: req.query.page, limit: req.query.limit, sort: { added: -1 } }, function (err, animals) {
      if (err) console.log(err)
      let animalChunks = []
      let chunkSize = 3
      for (let i = 0; i < animals.docs.length; i += chunkSize) {
        animalChunks.push(animals.docs.slice(i, i + chunkSize))
      }
      res.render('index', { title: 'Hello',
      animals: animalChunks,
      previous: res.locals.paginate.hasPreviousPages,
      previousValue: paginate.href(req)(true),
      next: res.locals.paginate.hasNextPages(animals.pages),
      nextValue: paginate.href(req)(false),
      pages: paginate.getArrayPages(req)(4, animals.pages, req.query.page)
      })
    })
  })
})

module.exports = router
