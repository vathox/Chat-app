const socket = io();

socket.on('connect', () => {
    console.log('Connected to server');
});

socket.on('disconnect', () =>{
    console.log('Connected to server');
});

socket.on('newMessage', (message) => {

    const  formattedTime = moment(message.createdAt).format('h:mm');
    const template = $('#message-template').html();
    const html = Mustache.render(template, {
        text : message.text,
        from: message.from,
        createdAt: formattedTime
    });

    $('#messages').append(html)

});

socket.on('newLocationMessage', (message) =>{

    const  formattedTime = moment(message.createdAt).format('h:mm');
    const template = $('#location-message-template').html();
    const html = Mustache.render(template, {
        from: message.from,
        url: message.url,
        createdAt: formattedTime
    });

    $('#messages').append(html)



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