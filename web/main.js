var socket = io();

socket.on('markdown', function(data){
    document.title = data.title;
    document.getElementById('markdown-body').innerHTML = data.body;
});
