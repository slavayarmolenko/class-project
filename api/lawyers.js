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
        /*for (var propname in req.body) {
            var propvalue = req.body[propname];
            if ((propname == "uzvername")||(propname == "password")||(propname == "email")||(propname == "description")||(propname == "name")||(propname == "shortname")||(propname == "address")){
                if(propvalue != ""){
                    addNewLawyerLine1 = addNewLawyerLine1 + columnNames[i];
                    addNewLawyerLine2 = addNewLawyerLine2 + '"' + req.body[propname] + '"';
                    if (columnNames[i] != "address") {
                        addNewLawyerLine1 = addNewLawyerLine1 + ", ";
                        addNewLawyerLine2 = addNewLawyerLine2 + ", ";
                        console.log(columnNames[i]);
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
                if(propvalue != "00000"){
                    addNewLawyerLine1 = addNewLawyerLine1 + columnNames[i] + ", ";
                    addNewLawyerLine2 = addNewLawyerLine2 + req.body[propname] + ", ";
                }
            }
            i++;
        }*/
        if(req.body.uzvername){
            addNewLawyerLine1 = addNewLawyerLine1 + 'uzvername, ';
            addNewLawyerLine2 = addNewLawyerLine2 + '"' + req.body.uzvername + '",';
        }
        if(req.body.password){
            addNewLawyerLine1 = addNewLawyerLine1 + 'password, ';
            addNewLawyerLine2 = addNewLawyerLine2 + '"' + req.body.password + '",';
        }
        if(req.body.email){
            addNewLawyerLine1 = addNewLawyerLine1 + 'email, ';
            addNewLawyerLine2 = addNewLawyerLine2 + '"' + req.body.email + '",';
        } 
        if(req.body.description){
            addNewLawyerLine1 = addNewLawyerLine1 + 'description, ';
            addNewLawyerLine2 = addNewLawyerLine2 + '"' + req.body.description + '",';
        }
        if(req.body.name){
            addNewLawyerLine1 = addNewLawyerLine1 + 'name, ';
            addNewLawyerLine2 = addNewLawyerLine2 + '"' + req.body.name + '",';
        }       
        if(req.body.shortname){
            addNewLawyerLine1 = addNewLawyerLine1 + 'shortname, ';
            addNewLawyerLine2 = addNewLawyerLine2 + '"' + req.body.shortname + '",';
        }
        if(req.body.russian){
            addNewLawyerLine1 = addNewLawyerLine1 + 'russian, ';
            addNewLawyerLine2 = addNewLawyerLine2 + req.body.russian + ',';
        }
        if(req.body.spanish){
            addNewLawyerLine1 = addNewLawyerLine1 + 'spanish, ';
            addNewLawyerLine2 = addNewLawyerLine2 + req.body.spanish + ',';
        }
        if(req.body.english){
            addNewLawyerLine1 = addNewLawyerLine1 + 'english, ';
            addNewLawyerLine2 = addNewLawyerLine2 + req.body.english + ',';
        }
        if(req.body.zip){
            addNewLawyerLine1 = addNewLawyerLine1 + 'zip, ';
            addNewLawyerLine2 = addNewLawyerLine2 + req.body.zip + ',';
        }
        if(req.body.daca){
            addNewLawyerLine1 = addNewLawyerLine1 + 'daca, ';
            addNewLawyerLine2 = addNewLawyerLine2 + req.body.daca + ',';
        }
        if(req.body.family){
            addNewLawyerLine1 = addNewLawyerLine1 + 'family, ';
            addNewLawyerLine2 = addNewLawyerLine2 + req.body.family + ',';
        }
        if(req.body.deportationProtection){
            addNewLawyerLine1 = addNewLawyerLine1 + 'deportationProtection, ';
            addNewLawyerLine2 = addNewLawyerLine2 + req.body.deportationProtection + ',';
        }
        if(req.body.address){
            addNewLawyerLine1 = addNewLawyerLine1 + 'address, ';
            addNewLawyerLine2 = addNewLawyerLine2 + '"' + req.body.address + '",';
        }
        addNewLawyerLine1 = addNewLawyerLine1.substring(0, addNewLawyerLine1.length - 2);
        addNewLawyerLine2 = addNewLawyerLine2.substring(0, addNewLawyerLine2.length - 1) + ');';
        console.log("Here " + req.body);


        console.log(addNewLawyerLine1);
        console.log(addNewLawyerLine2);
        connection.query(addNewLawyerLine1 + addNewLawyerLine2, function (err, results) {
            if (err) {
                res.json({ success: false, errMessage: err.sqlMessage });
            } else {
                res.json({ success: true, results: results });
            }
            

        });
    });

};

