var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http, {
    cors: true
});
var bodyParser = require('body-parser')
// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))
// parse application/json
app.use(bodyParser.json())
app.use((req, res, next) => {
    //设置请求头
    res.set({
        'Access-Control-Allow-Credentials': true,
        'Access-Control-Max-Age': 1728000,
        'Access-Control-Allow-Origin': req.headers.origin || '*',
        'Access-Control-Allow-Headers': 'X-Requested-With,Content-Type',
        'Access-Control-Allow-Methods': 'PUT,POST,GET,DELETE,OPTIONS',
        'Content-Type': 'application/json; charset=utf-8'
    })
    req.method === 'OPTIONS' ? res.status(204).end() : next()
})
require('./router')(app)


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