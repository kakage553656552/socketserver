module.exports = function (app) {
    app.get('/test', function (req, res) {
        // res.send('hellow index')
        var mysql = require('mysql');
        var connection = mysql.createConnection({
            host: 'localhost',
            user: 'root',
            password: 'root',
            database: 'sys'
        });
        connection.connect();
        connection.query('SELECT * from sys_user', function (error, results, fields) {
            if (error) throw error;
            console.log(results);
            res.send(results)
        });
        connection.end();
    });
    app.post('/insert', function (req, res) {
        console.log(req.body);
        var mysql = require('mysql');
        var connection = mysql.createConnection({
            host: 'localhost',
            user: 'root',
            password: 'root',
            database: 'sys'
        });
        connection.connect();
        console.log(req.body);
        connection.query('insert into sys_user (id,name,age) values(null,"isisi",10)', function (error, results, fields) {
            if (error) throw error;
            console.log(results);
            res.send(results)
        });
        connection.end();
    });
}