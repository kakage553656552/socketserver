var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http, {
    cors: true
});

// app.get('/', function (req, res) {
//     res.sendFile(__dirname + '/index.html');
// });


var usocket = []; //全局变量
io.on('connection', function (socket) {
    usocket.push(socket)
    // console.log('a user connected');
    // console.dir(socket.id);
    console.log(usocket.length);
    socket.emit("setId", socket.id)
    //监听msg事件
    socket.on("message", function (msg,id) {
        // io.emit("message", msg) //服务器通过广播将新用户发送给全体群聊成员
        // socket.emit("message", msg) //发送广播给指定用户
        usocket.forEach(item=>{
            if(item.id !== id) {
                item.emit('message',msg)
            }
        })
    })
});

http.listen(9000, function () {
    console.log('listening on *:9000');
});