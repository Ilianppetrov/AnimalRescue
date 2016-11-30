let lwip = require('lwip')


module.exports = {
  editSingleImage: function (filesrc) {
    lwip.open(filesrc, (err, image) => {
      if (err) console.log()
      image.batch()
        .scale(0.2)
        .writeFile(filesrc, (err) => {
          if (err) console.log
          console.log('image resized')
        })
    })
  },
  editMultipleImages: function (filesArray) {
    filesArray.forEach((Obj, index) => {
      let fileSrc = 'public/images/' + Obj.filename
      lwip.open(fileSrc, (err, image) => {
        if (err) console.log()
        image.batch()
          .scale(0.2)
          .writeFile(fileSrc, (err) => {
            if (err) console.log
            console.log(`${index + 1} image resized`)
          })
      })
    })
  }
}

