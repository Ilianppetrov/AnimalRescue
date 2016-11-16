$('.confirm-alert').click(() => {
  if (!confirm ('are you sure you want to delete?')) {
    event.preventDefault()
  }
})

let messageCont = $('.messages-container');
messageCont.on('click','.unseen',function(ev){
    let $message = $(this); 
    let id = $message.attr('data-id');
    $message.removeClass('unseen');
    $.ajax(`/message/change/${id}`,{
    method: 'POST',
    contentType: 'application/x-www-form-urlencoded',
    headers: {},
    success: function(data){
        console.log(data)
        $message.removeClass('unseen');
        $message.addClass('seen');
    },
    error: function(err){
        console.log(err);
    } 
})
})

let animal = $('.animal-image')
animal.load(function () {
    let $animal = $(this)
    $.ajax('/animal/test', {
      method: 'GET',
      contentType: 'application/x-www-form-urlencoded',
      headers: {},
      success: function(data) {
        console.log(data)
    },
    error: function(err){
        console.log(err);
    } 
    })

})