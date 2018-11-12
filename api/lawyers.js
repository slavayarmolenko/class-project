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
            if (req.query.units == "km") {
                usersDistance = ZipCodes.toMiles(usersDistance);
            };
            if ((usersDistance) && (usersZip)) {
                for (var i = 0; i < results.length; i++) {
                    console.log("Dist " + ZipCodes.distance(usersZip, results[i].zip));
                    console.log("users " + typeof (usersZip) + " " + usersZip);
                    console.log("adv " + typeof (results[i].zip) + " " + results[i].zip);
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

        var addNewLawyerLine1 = 'INSERT INTO lawyers (';
        var addNewLawyerLine2 = ') VALUES (';
        var i = 0;
        var columnNames = ["uzvername", "password", "email", "description", "name", "shortname", "russian", "spanish", "english", "zip", "daca", "family", "deportationProtection", "address"];
        for (var propname in req.body) {
            var propvalue = req.body[propname];
            if ((propname == "uzvername")||(propname == "password")||(propname != "email")||(propname != "description")||(propname != "name")||(propname != "shortname")||(propname != "address")){
                if(propvalue != ""){
                    addNewLawyerLine1 = addNewLawyerLine1 + columnNames[i];
                    addNewLawyerLine2 = addNewLawyerLine2 + '"' + req.body[propname] + '"';
                    if (propname != "address") {
                        addNewLawyerLine1 = addNewLawyerLine1 + ", ";
                        addNewLawyerLine2 = addNewLawyerLine2 + ", ";
                    } else {
                        addNewLawyerLine2 = addNewLawyerLine2 + ");";
                    } 
                }
            } else if ((propname == "russian")||(propname == "spanish")||(propname == "english")||(propname == "daca")||(propname == "family")||(propname == "deportationProtection")){
                if(propvalue != ""){
                    addNewLawyerLine1 = addNewLawyerLine1 + columnNames[i] + ", ";
                    addNewLawyerLine2 = addNewLawyerLine2 + req.body[propname] + ", ";
                }
            }  else if (propname == "zip"){
                if(propvalue != ""){
                    addNewLawyerLine1 = addNewLawyerLine1 + columnNames[i] + ", ";
                    addNewLawyerLine2 = addNewLawyerLine2 + req.body[propname] + ", ";
                }
            }
            i++;
        }
        console.log("Here " + req.body);


        console.log("addNewLawyerLine = " + addNewLawyerLine);
        connection.query(addNewLawyerLine1 + addNewLawyerLine2, function (err, results) {
            if (err) {
                res.json({ success: false, errMessage: err.sqlMessage });
            } else {
                res.json({ success: true, results: results });
            }
            console.log(results);

        });
    });

};

