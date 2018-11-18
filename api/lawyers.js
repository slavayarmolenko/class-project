/*
Vladislav Iarmolenko
slava.yarmolenko@gmail.com
Created: August 2018
*/
var common = require('./common');
var ZipCodes = require('zipcodes');

exports.create = function (app, connection) {

    app.get('/api/lawyer', function (req, res) {
        if (req.query.id) {
            getLawyerById(req, res);
            return;
        }
        connection.query('SELECT id, email, name FROM lawyers', function (err, results) {
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
                    var curResult = results[i];
                    if (ZipCodes.distance(usersZip, curResult.zip) < usersDistance) {
                        send.data.push(curResult);
                    }
                }
            } else {
                send.data = results;
            }
            res.json(send);
        });




        //res.send('Hello');
    });



    app.post('/api/lawyer', function (req, res) {
        var addNewLawyerLine1 = 'INSERT INTO lawyers (';
        var addNewLawyerLine2 = ') VALUES (';
        var i = 0;
        var ending = ");"
        if (req.body.id) {
            addNewLawyerLine1 = 'UPDATE lawyers SET ';
            ending = " WHERE id=" + req.body.id + ";";
            addNewLawyerLine2 = ' ';
        }
        var isUpdate = req.body.id ? true : false;

        var columnObject = [
            {
                type: "string",
                id: "uzvername",
                required: true
            }, {
                type: "string",
                id: "password",
                required: true
            }, {
                type: "string",
                id: "email",
                required: true
            }, {
                type: "string",
                id: "description",
                required: false
            }, {
                type: "string",
                id: "name",
                required: true
            }, {
                type: "string",
                id: "shortname",
                required: false
            }, {
                type: "number",
                id: "zip",
                required: true
            }, {
                type: "string",
                id: "address",
                required: false
            }
        ];
        for (var i = 0; i < columnObject.length; i++) {
            if (isUpdate) {
                addNewLawyerLine1 += common.getUpdateValueString(columnObject[i], req.body[columnObject[i].id]);
            } else {
                addNewLawyerLine1 += common.getInsertNameString(columnObject[i], req.body[columnObject[i].id]);
                addNewLawyerLine2 += common.getInsertValueString(columnObject[i], req.body[columnObject[i].id]);
                console.log(req.body[columnObject[i].id]);
            }
            
        }
        addNewLawyerLine1 = addNewLawyerLine1.substring(0, addNewLawyerLine1.length - 2);
        addNewLawyerLine2 = addNewLawyerLine2.substring(0, addNewLawyerLine2.length - 2) + ending;


        console.log('SQL: ' + addNewLawyerLine1 + addNewLawyerLine2);
        connection.query(addNewLawyerLine1 + addNewLawyerLine2, function (err, results) {
            if (err) {
                res.json({ success: false, errMessage: err.sqlMessage });
            } else {
                res.json({ success: true, results: results, returnObj: results });
            }


        });
    });
    var getLawyerById = function (req, res) {
        var userId = req.query.id;
        connection.query('SELECT * FROM lawyers LEFT JOIN lawyer_language ON lawyers.id = lawyer_language.lawyerID LEFT JOIN lawyer_service ON lawyers.id = lawyer_service.lawyerID WHERE lawyers.id = ' + userId, function (err, results) {
            if (err)
                throw err;
            var languages = [];
            languages[0] = results[0].languageID;
            var services = [];
            services[0] = results[0].serviceID;
            var isPresent;
            for (var i = 1; i < results.length; i++) {
                isPresent = true;
                for (var a = 0; a < languages.length; a++) {
                    if (results[i].languageID == languages[a]) {
                        isPresent = false;
                        console.log("here " + results[i].languageID);
                    }


                }
                if (isPresent) {
                    languages.push(results[i].languageID);
                }
            }
            for (var i = 1; i < results.length; i++) {
                isPresent = true;
                for (var a = 0; a < services.length; a++) {
                    if (results[i].serviceID == services[a]) {
                        isPresent = false;
                        console.log("here " + results[i].serviceID);
                    }


                }
                if (isPresent) {
                    services.push(results[i].serviceID);
                }
            }
            console.log("services" + services + " languages:" + languages);

            var lawyer = results[0];
            lawyer.languages = languages;
            lawyer.services = services;
            res.json({ data: lawyer, success: true });

        });

    };

    app.delete('/api/lawyer', function (req, res) {
        var userId = req.query.id;
        if (!userId) {
            return;
        }
        connection.query('DELETE FROM lawyers WHERE id=' + userId, function (delErr) {
            if (delErr)
                throw delErr;
            connection.query('SELECT id, email, name FROM lawyers', function (selectErr, results) {
                if (selectErr)
                    throw selectErr;
                res.json({ data: results, success: true });
            });
        });

    });

};



