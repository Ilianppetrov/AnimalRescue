$('.confirm-alert').click(() => {
  if (!confirm ("are you sure you want to delete?"))
    event.preventDefault()
})

let messageCont = $('.messages-container');
messageCont.on('click','.unseen',function(ev){
    let $message = $(this); 
    let id = $message.attr('data-id');
    console.log($message);
    console.log(id);
    $message.removeClass('unseen');
    $.ajax(`/message/change/${id}`,{
    method: 'POST',
    contentType: 'application/x-www-form-urlencoded',
    headers: {},
    success: function(data){
        $message.removeClass('unseen');
        $message.addClass('seen');
        console.log('suck')
    },
    error: function(err){
        console.log(err);
    } 
})
})