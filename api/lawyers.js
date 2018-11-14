/*
Vladislav Iarmolenko
slava.yarmolenko@gmail.com
Created: August 2018
*/

var ZipCodes = require('zipcodes');

exports.create = function (app, connection) {

    app.get('/api/lawyers', function (req, res) {
        if (req.query.id) {
            getLawyerById(req, res);
            return;
        }       
        connection.query('SELECT * FROM lawyers', function (err, results) {
            if (err)
                throw err;
            var usersZip = parseInt(req.query.usersZip);
            var usersDistance = parseInt(req.query.distance);
            var send = { data: [], success: true };
            if (req.query.units == "km") {
                usersDistance = ZipCodes.toMiles(usersDistance);
            };
            if ((usersDistance) && (usersZip)) {
                for (var i = 0; i < results.length; i++) {
                    if (ZipCodes.distance(usersZip, results[i].zip) < usersDistance) {
                        var localid = results[i].id;
                        var localemail = results[i].email;
                        var localname = results[i].name;
                        var localdescription = results[i].description;
                        var entry = { id: localid, name: localname, email: localemail, description: localdescription };
                        send.data.push(entry);
                    }
                }
            } else {
                for (var i = 0; i < results.length; i++) {
                    var localid = results[i].id;
                    var localemail = results[i].email;
                    var localname = results[i].name;
                    var localdescription = results[i].description;
                    var entry = { id: localid, name: localname, email: localemail, description: localdescription };

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
        var ending = ");"
        if(req.body.id){
            addNewLawyerLine1 = 'UPDATE lawyers SET ';
            ending = " WHERE ID="+req.body.id+";";
            addNewLawyerLine2 = ' ';
        }
        var column;
        if(req.body.uzvername){
            column = "uzvername";
            if(req.body.id){
                addNewLawyerLine1 = addNewLawyerLine1 + column +'="'+req.body.uzvername+'", ';
            } else {
            addNewLawyerLine1 = addNewLawyerLine1 + column +', ';
            addNewLawyerLine2 = addNewLawyerLine2 + '"' + req.body.uzvername + '",';
            }
        }
        if(req.body.password){       
            column = "password";
            if(req.body.id){
                addNewLawyerLine1 = addNewLawyerLine1 + column +'="'+req.body.password+'", ';
            } else {
            addNewLawyerLine1 = addNewLawyerLine1 + column +', ';
            addNewLawyerLine2 = addNewLawyerLine2 + '"' + req.body.password + '",';
            }
        }
        if(req.body.email){
            column = "email";
            if(req.body.id){
                addNewLawyerLine1 = addNewLawyerLine1 + column +'="'+req.body.email+'", ';
            } else {
            addNewLawyerLine1 = addNewLawyerLine1 + column +', ';
            addNewLawyerLine2 = addNewLawyerLine2 + '"' + req.body.email + '",';
            }
        } 
        if(req.body.description){
            column = "description";
            if(req.body.id){
                addNewLawyerLine1 = addNewLawyerLine1 + column +'="'+req.body.description+'", ';
            } else {
            addNewLawyerLine1 = addNewLawyerLine1 + column +', ';
            addNewLawyerLine2 = addNewLawyerLine2 + '"' + req.body.description + '",';
            }
        }
        if(req.body.name){
            column = "name";
            if(req.body.id){
                addNewLawyerLine1 = addNewLawyerLine1 + column +'="'+req.body.name+'", ';
            } else {
            addNewLawyerLine1 = addNewLawyerLine1 + column +', ';
            addNewLawyerLine2 = addNewLawyerLine2 + '"' + req.body.name + '",';
            }
        }       
        if(req.body.shortname){
            column = "shortname";
            if(req.body.id){
                addNewLawyerLine1 = addNewLawyerLine1 + column +'="'+req.body.shortname+'", ';
            } else {
            addNewLawyerLine1 = addNewLawyerLine1 + column +', ';
            addNewLawyerLine2 = addNewLawyerLine2 + '"' + req.body.shortname + '",';
            }
        }
        if(req.body.zip){
            column = "zip";
            if(req.body.id){
                addNewLawyerLine1 = addNewLawyerLine1 + column +'="'+req.body.zip+'", ';
            } else {
            addNewLawyerLine1 = addNewLawyerLine1 + column +', ';
            addNewLawyerLine2 = addNewLawyerLine2 + req.body.zip + ',';
            }
        }
        if(req.body.daca){
            column = "daca";
            if(req.body.id){
                addNewLawyerLine1 = addNewLawyerLine1 + column +'="'+req.body.daca+'", ';
            } else {
            addNewLawyerLine1 = addNewLawyerLine1 + column +', ';
            addNewLawyerLine2 = addNewLawyerLine2 + req.body.daca + ',';
            }
        }
        if(req.body.family){
            column = "family";
            if(req.body.id){
                addNewLawyerLine1 = addNewLawyerLine1 + column +'="'+req.body.family+'", ';
            } else {
            addNewLawyerLine1 = addNewLawyerLine1 + column +', ';
            addNewLawyerLine2 = addNewLawyerLine2 + req.body.family + ',';
            }
        }
        if(req.body.deportationProtection){
            column = "deportationProtection";
            if(req.body.id){
                addNewLawyerLine1 = addNewLawyerLine1 + column +'="'+req.body.deportationProtection+'", ';
            } else {
            addNewLawyerLine1 = addNewLawyerLine1 + column +', ';
            addNewLawyerLine2 = addNewLawyerLine2 + req.body.deportationProtection + ',';
            }
        }
        if(req.body.address){
            column = "address";
            if(req.body.id){
                addNewLawyerLine1 = addNewLawyerLine1 + column +'="'+req.body.address+'", ';
            } else {
            addNewLawyerLine1 = addNewLawyerLine1 + column +', ';
            addNewLawyerLine2 = addNewLawyerLine2 + '"' + req.body.address + '",';
            }
        }
        addNewLawyerLine1 = addNewLawyerLine1.substring(0, addNewLawyerLine1.length - 2);
        addNewLawyerLine2 = addNewLawyerLine2.substring(0, addNewLawyerLine2.length - 1) + ending;


        console.log('SQL: ' + addNewLawyerLine1 + addNewLawyerLine2);
        connection.query(addNewLawyerLine1 + addNewLawyerLine2, function (err, results) {
            if (err) {
                res.json({ success: false, errMessage: err.sqlMessage });
            } else {
                res.json({ success: true, results: results });
            }
            

        });
    });
    var getLawyerById = function (req, res) {
        var userId = req.query.id;
        connection.query('SELECT id, uzvername, name, email, ' +
            'description, zip, address, '+
            'daca, family, deportationProtection FROM lawyers WHERE id=' + userId, function (err, results) {
                if (err)
                    throw err;
                if (results.length === 1) {
                    var lawyer = results[0];
                    lawyer.languages = [];
                    lawyer.services = [];
                    res.json({ data: lawyer, success: true});
                } else {
                    res.json({ data: {}, success: false, errMessage: 'Error: We found ' + results.length + ' lawyers with id {' + userId + '}'});
                }
        });

    };

};

/*
Vladislav Iarmolenko
slava.yarmolenko@gmail.com
Created: August 2018
*/


