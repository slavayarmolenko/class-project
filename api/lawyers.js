/*
Vladislav Iarmolenko
slava.yarmolenko@gmail.com
Created: August 2018
*/

var ZipCodes = require('zipcodes');
var mysql = require('mysql');
var connection = mysql.createConnection({
    host: "classdb.c1fc1qmtlpg9.us-west-1.rds.amazonaws.com",
    user: "master",
    password: "dEbi07oOFHaAW1s",
    database: "test1"
});
exports.create = function (app) {

    app.get('/api/lawyers', function (req, res) {
        connection.query('SELECT * FROM lawyers', function (err, results) {
            if (err)
                throw err;
            var usersZip = parseInt(req.query.usersZip);
            var usersDistance = parseInt(req.query.distance);
            var send = { data: [] };
            console.log(req.query);
            if (req.query.units == "km"){
                usersDistance = ZipCodes.toMiles(usersDistance);
            };
            if ((usersDistance) && (usersZip)) {
                for (var i = 0; i < results.length; i++) {
                    console.log("Dist " +ZipCodes.distance(usersZip, results[i].zip));
                    console.log("users " + typeof(usersZip) + " " + usersZip);
                    console.log("adv "+typeof(results[i].zip) + " " + results[i].zip);
                    if (ZipCodes.distance(usersZip, results[i].zip) < usersDistance) {
                        var localemail = results[i].email;
                        var localname = results[i].name;
                        var localdescription = results[i].description;
                        var entry = { name: localname, email: localemail, description: localdescription };
                        send.data.push(entry);
                    }
                }
            } else {
                for (var i = 0; i < results.length; i++) {
                    var localemail = results[i].email;
                    var localname = results[i].name;
                    var localdescription = results[i].description;
                    var entry = { name: localname, email: localemail, description: localdescription };

                    send.data.push(entry);
                }
            }
            res.json(send);
        });




        //res.send('Hello');
    });

    app.post('/api/lawyers', function (req, res) {
        var send = { data: [] };
        connection.query('SELECT * FROM lawyers', function (err, results) {
            if (err)
                throw err;
            console.log("Req");
            console.log(req.body.susersZip);
            console.log("finish");
            //console.log(results);
            var usersZip = req.body.usersZip;
            var usersDistance = req.body.distance;


            console.log("send");
            console.log(send);
            res.json(send);
        });
    });

};

