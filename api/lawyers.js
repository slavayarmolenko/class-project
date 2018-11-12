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
        
       // var addNewLawyerLine = 'INSERT INTO lawyers (uzvername, password, email, description, name, shortname, russian, spanish, english, zip, daca, family, deportationProtection, address) VALUES (';
       // addNewLawyerLine = addNewLawyerLine + request.body.uzvername + "," + request.body.password + "," + request.body.email  + "," + request.body.description  + "," + request.body.name + "," + request.body.shortname + "," + request.body.russian + "," + request.body.spanish + "," + request.body.english + "," + request.body.zip + "," + request.body.daca + "," + request.body.family + "," + request.body.deportationProtection + "," + request.body.address + ");";
      
       var addNewLawyerLine = 'INSERT INTO lawyers (name, email) VALUES (';
       console.log("Here " + req.body);
       addNewLawyerLine = addNewLawyerLine + "'" + req.body.name + "', '" + req.body.email + "')";
       
       console.log("addNewLawyerLine = " + addNewLawyerLine);
       connection.query(addNewLawyerLine, function (err, results) {
            if(err){
                res.json({success: false, errMessage: err.sqlMessage});
            } else {
                res.json({success: true, results: results});
            }
            console.log(results);
            
        });
    });

};

