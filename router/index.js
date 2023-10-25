const {generateRandomString} = require('./random.js');
const mysql = require('mysql');
const connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'root',
  database: 'mysql'
});
connection.connect();
module.exports = function (app) {
    var tokenList = []
    app.get('/test', function (req, res) {
        connection.query('SELECT * from sys_user', function (error, results, fields) {
            if (error) throw error;
            var result = {
                code:0,
                msg:'success',
                data:results
            }
            res.send(result)
        });
    });
    app.post('/login', function (req, res) {
        connection.query(`select * from sys_user where name = "${req.body.name}" and password = ${req.body.password}`, function (error, results, fields) {
            if (error) throw error;
            var result = {
                code:0,
                msg:'success'
            }
            if(results.length===0) {
                result.code = 500,
                result.msg='no data'
            }else {
                result.token = generateRandomString(36)
                // tokenList.push(result.token)
                connection.query(`update sys_user set token = "${result.token}" where id=${results[0].id}`, function (error, results, fields) {
                  console.log(11,error,222,results)
                  if (error) throw error;
                });
            }
            res.send(result)
        });
    });
    app.post('/insert', function (req, res) {
        connection.query(`insert into sys_user (name,password) values("${req.body.name}",${req.body.password})`, function (error, results, fields) {
            if (error) throw error;
            var result = {
                code:0,
                msg:'success'
            }
            res.send(result)
        });
    });
    app.post('/update', function (req, res) {
        connection.query(`update sys_user set name = "${req.body.name}",password="${req.body.password}" where id=${req.body.id}`, function (error, results, fields) {
            if (error) throw error;
            var result = {
                code:0,
                msg:'success'
            }
            res.send(result)
        });
    });
    app.delete('/delete', function (req, res) {
        var url = require('url')
        var parseObj = url.parse(req.url,true)
        connection.query(`delete from sys_user where id = ${parseObj.query.id}`, function (error, results, fields) {
            if (error) throw error;
            var result = {
                code:0,
                msg:'success'
            }
            res.send(result)
        });
    });
}