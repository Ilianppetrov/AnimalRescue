$('.confirm-alert').click( () => {
  if(!confirm ("are you sure you want to delete?"))
       event.preventDefault()
})