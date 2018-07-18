const socket = io();

socket.on('connect', () => {
    console.log('Connected to server');
});

socket.on('disconnect', () =>{
    console.log('Connected to server');
});

socket.on('newMessage', (message) => {

    const  formattedTime = moment(message.createdAt).format('h:mm');
    console.log('New message', message);
    const li= $('<li></li>');
    li.text(`${message.from} ${formattedTime}: ${message.text}`);

    $('#messages').append(li);
});

socket.on('newLocationMessage', (message) =>{

    const  formattedTime = moment(message.createdAt).format('h:mm');
    console.log(message);
    let li = $('<li></li>');
    let a = $('<a target="_blank">My location</a>');

    li.text(`${message.from} ${formattedTime}: `);
    a.attr('href', message.url);
    li.append(a);
    $('#messages').append(li);


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