module.exports = function (app) {
    var tokenList = []
    app.get('/test', function (req, res) {
        var mysql = require('mysql');
        var connection = mysql.createConnection({
            host: 'localhost',
            user: 'root',
            password: '521521',
            database: 'sys'
        });
        connection.connect();
        connection.query('SELECT * from user', function (error, results, fields) {
            if (error) throw error;
            var result = {
                code:0,
                msg:'success',
                data:results
            }
            res.send(result)
        });
        connection.end();
    });
    app.post('/login', function (req, res) {
        console.log(req.body);
        var mysql = require('mysql');
        var connection = mysql.createConnection({
            host: 'localhost',
            user: 'root',
            password: '521521',
            database: 'sys'
        });
        connection.connect();
        connection.query(`select * from user where name = "${req.body.name}" and age = ${req.body.age}`, function (error, results, fields) {
            if (error) throw error;
            console.log(results);
            var result = {
                code:0,
                msg:'success'
            }
            if(results.length===0) {
                result.code = 500,
                result.msg='no data'
            }else {
                result.token = Math.random().toString(36).substr(2)
                tokenList.push(result.token)
            }
            res.send(result)
        });
        connection.end();
    });
    app.post('/insert', function (req, res) {
        console.log(req.body);
        var mysql = require('mysql');
        var connection = mysql.createConnection({
            host: 'localhost',
            user: 'root',
            password: '521521',
            database: 'sys'
        });
        connection.connect();
        connection.query(`insert into user (name,age) values("${req.body.name}",${req.body.age})`, function (error, results, fields) {
            if (error) throw error;
            var result = {
                code:0,
                msg:'success'
            }
            res.send(result)
        });
        connection.end();
    });
    app.post('/update', function (req, res) {
        console.log(req.body);
        var mysql = require('mysql');
        var connection = mysql.createConnection({
            host: 'localhost',
            user: 'root',
            password: '521521',
            database: 'sys'
        });
        connection.connect();
        connection.query(`update user set name = "${req.body.name}",age="${req.body.age}" where id=${req.body.id}`, function (error, results, fields) {
            if (error) throw error;
            var result = {
                code:0,
                msg:'success'
            }
            res.send(result)
        });
        connection.end();
    });
    app.delete('/delete', function (req, res) {
        var url = require('url')
        var parseObj = url.parse(req.url,true)
        console.log(parseObj.query.id);
        var mysql = require('mysql');
        var connection = mysql.createConnection({
            host: 'localhost',
            user: 'root',
            password: '521521',
            database: 'sys'
        });
        connection.connect();
        connection.query(`delete from user where id = ${parseObj.query.id}`, function (error, results, fields) {
            if (error) throw error;
            var result = {
                code:0,
                msg:'success'
            }
            res.send(result)
        });
        connection.end();
    });
}