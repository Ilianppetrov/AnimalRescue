$('.confirm-alert').click(() => {
  if (!confirm ('are you sure you want to delete?')) {
    event.preventDefault()
  }
})
// change messages status
let messageCont = $('.messages-container')
messageCont.on('click', '.unseen', function (ev) {
  let $message = $(this)
  let id = $message.attr('data-id')
  $message.removeClass('unseen')
  $.ajax(`/message/change/${id}`, {
    method: 'POST',
    contentType: 'application/x-www-form-urlencoded',
    headers: {},
    success: function (data) {
      console.log(data)
      $message.removeClass('unseen')
      $message.addClass('seen')
    },
    error: function (err) {
      console.log(err)
    }
  })
})
// change messages status

// let animal = $('.animal-image')
// animal.load(function () {
//   $.ajax('/animal/test', {
//     method: 'GET',
//     contentType: 'application/x-www-form-urlencoded',
//     headers: {},
//     success: function (data) {
//       console.log(data)
//     },
//     error: function (err) {
//       console.log(err)
//     }
//   })
// })
// animal profile pictures
let $imageSelector = $('.images-selector')
let $profileImages = $('.profile-images')
let $selected = $('.selected')
let $currentImage = $('#current-image')
let $profileContainer = $('.profile-container')
let $disabled = $('#disabled')

$imageSelector.click(() => {
  $profileImages.addClass('profile-images-add')
})

$imageSelector.click(() => {
  let images = $profileImages.find('img')
  $profileImages.addClass('profile-images-add')
  let dataInfo = 1
  images.each(function () {
    $(this).attr('data-info', dataInfo)
    dataInfo += 1
  })
  $imageSelector.remove()
})

$profileImages.on('click touchstart', 'img', function (ev) {
  if (ev.type === 'touchstart') {
    ev.preventDefault()
    return
  }
  let $this = $(this)
  let imgSrc = $this.attr('src')
  let index = $this.data('info')
  $currentImage.attr('src', imgSrc)
  $currentImage.attr('data-info', index)
  $selected.fadeTo('slow', 2)
  $profileContainer.addClass(' blurred')
})

$currentImage.click(() => {
  $selected.hide()
  $profileContainer.removeClass(' blurred')
})

$selected.hide()
// animal profile pictures - end

// animal profile-edit form
let animalObj = {
  changes: false
}

$('.animalForm').on('change', function (ev) {
  let $this = $(ev.target)
  console.log($this.val())
  animalObj[$this[0].name] = $this.val()
  animalObj.changes = true
})

$('.animalForm').on('click', '.fa.fa-pencil', function (ev) {
  let $this = $(ev.target)
  console.log($this)
  $this.prev().hide(() => {
    $this.parent().next().removeClass('hide')
  })
})
let $hiddenId = $('input[type="hidden"]').attr('data-id')

$('.edit-save').click(function (ev) {
  if (animalObj.changes === true) {
    delete animalObj.changes
    $.ajax(`/animal/edit/${$hiddenId}`, {
      method: 'POST',
      contentType: 'application/json',
      data: JSON.stringify(animalObj),
      headers: {},
      success: function (data) {
        if ($('.alert.alert-success').length > 0) {
          return
        }
        let $div = $('<div></div>')
        $div.addClass('alert alert-success')
        $div.html('Changes saved')
        $('.animalForm').prepend($div)
      },
      error: function (err) {
        console.log(err)
      }
    })
  }
  $('.animalForm input, textarea').addClass('hide')
  ev.preventDefault()
})
// animal profile-edit form - end



