var express = require('express');
var app = express();

var teamService = require('./team');
var lawyersService = require('./lawyers');

var name;
var description;
var email;
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
    console.log("adding person");
            //connection.query('INSERT INTO people (id,name, age, address) VALUES (?, ?, ?, ?)', ['4', 'Slava', '17', 'California, USA'], function (err, result) {
        if (err)
            throw err;

        connection.query('SELECT * FROM people', function (err, results) {
            if (err)
                throw err;
            console.log(results[2].id)
            console.log(results[2].name)
            console.log(results[2].age)
            console.log(results[2].address)
            connection.query('DELETE INTO people WHERE id = 1', function (err, result) {
                console.log(results[2].id)
                console.log(results[2].name)
                console.log(results[2].age)
                console.log(results[2].address)
            })
        })
    //})
    connection.query('INSERT INTO people (id,name, age, address) VALUES (?, ?, ?, ?)', ['4', 'Slava', '17', 'California, USA'], function (err, result) {
        name = "";
        email = "";
        description = "";
    })
});


teamService.create(app);
lawyersService.create(app);

var server = app.listen(8081, function () {
    var host = server.address().address;
    var port = server.address().port;

    console.log("Example app listening at http://%s:%s", host, port);
});

