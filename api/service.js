var express = require('express');
var app = express();
var teamService = require('./team');
var lawyersService = require('./lawyers');
var loginService = require('./login');
var mysql = require('mysql');
var connection = mysql.createConnection({
    host: "classdb.c1fc1qmtlpg9.us-west-1.rds.amazonaws.com",
    user: "master",
    password: "dEbi07oOFHaAW1s",
    database: "test1"
});
console.log('Trying to create connection');
connection.connect(function (err) {
    if (err)
        throw err;
    console.log('You are now connected...');
    //connection.query('INSERT INTO people (id,name, age, address) VALUES (?, ?, ?, ?)', ['4', 'Slava', '17', 'California, USA'], function (err, result) {
    if (err)
        throw err;
})
            //})
teamService.create(app);
lawyersService.create(app);
loginService.create(app);
var server = app.listen(8081, function () {
    var host = server.address().address;
    var port = server.address().port;
    console.log("Example app listening at http://%s:%s", host, port);
});

