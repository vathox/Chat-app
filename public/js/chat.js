const socket = io();


function scrollPage () {
    // Selectors
    const messages = jQuery('#messages');
    const newMessage = messages.children('li:last-child');
    // Heights
    const clientHeight = messages.prop('clientHeight');
    const scrollTop = messages.prop('scrollTop');
    const scrollHeight = messages.prop('scrollHeight');
    const newMessageHeight = newMessage.innerHeight();
    const lastMessageHeight = newMessage.prev().innerHeight();

    if (clientHeight + scrollTop + newMessageHeight + lastMessageHeight >= scrollHeight) {
        messages.scrollTop(scrollHeight);
    }
}

socket.on('connect', () => {
    const params = $.deparam(window.location.search);

    socket.emit('join', params, err => {
        if(err){
            alert(err);
            window.location.href = '/';
        } else{
            console.log("No error");
        }
    });
});

socket.on('disconnect', () =>{
    console.log('Disconnected from the server');
});

socket.on('updateUserList', users => {
    const ol = $('<ol></ol>');

    users.forEach(user => {
        ol.append($('<li></li>').text(user))
    });

    $('#users').html(ol)
});

socket.on('newMessage', (message) => {

    const  formattedTime = moment(message.createdAt).format('h:mm');
    const template = $('#message-template').html();
    const html = Mustache.render(template, {
        text : message.text,
        from: message.from,
        createdAt: formattedTime
    });

    $('#messages').append(html);

    scrollPage()
});

socket.on('newLocationMessage', (message) =>{

    const  formattedTime = moment(message.createdAt).format('h:mm');
    const template = $('#location-message-template').html();
    const html = Mustache.render(template, {
        from: message.from,
        url: message.url,
        createdAt: formattedTime
    });

    $('#messages').append(html);

    scrollPage()

});

$('#message-form').on('submit', function (e) {
   e.preventDefault();

    socket.emit('createMessage',{
        from: 'User',
        text: $('[name=message]').val()
    }, function () {
        $('[name=message]').val('')
    })
});

const locationButton = $('#location-button');

locationButton.on('click', function () {
    if(!navigator.geolocation){
        return alert('You browser does not support geolocation! Please update')
    }

    locationButton.attr('disabled', 'disabled').text('Sending location...');

    navigator.geolocation.getCurrentPosition(function (position) {
        locationButton.removeAttr('disabled').text('Send location');
        socket.emit('createLocationMessage', {
            latitude: position.coords.latitude,
            longitude: position.coords.longitude
        })
    }, function () {
        alert('Unable to fetch location!');
        locationButton.removeAttr('disabled').text('Send location');

    })
});