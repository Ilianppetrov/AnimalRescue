let gulp = require('gulp')
let lwip = require('lwip')

gulp.task('resize', () => {
  lwip.open('../public/images/cat.jpg', (err, image) => {
    if (err) console.log(err)
    image.scale(0.3, (err, image) => {
      if (err) console.log(err)
      image.writeFile('../public/images/cat.jpg', () => {
        if (err) console.log(err)
        console.log('done')
      })
    })
  })
})
