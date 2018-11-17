var express = require('express');
var app = express();
var teamService = require('./team');
var lawyersService = require('./lawyers');
var companiesService = require('./companies');
var loginService = require('./login');
var utilsService = require('./utils');
var mysql = require('mysql');
var bodyParser = require('body-parser');
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

app.use(bodyParser.json()); // support json encoded bodies
app.use(bodyParser.urlencoded({ extended: true })); // support encoded bodies

utilsService.create(app, connection);
teamService.create(app, connection);
lawyersService.create(app, connection);
companiesService.create(app, connection);
loginService.create(app, connection);
var server = app.listen(8081, function () {
    var host = server.address().address;
    var port = server.address().port;
    console.log("Example app listening at http://%s:%s", host, port);
});

