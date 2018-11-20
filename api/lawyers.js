/*
Vladislav Iarmolenko
slava.yarmolenko@gmail.com
Created: August 2018
*/
var common = require('./common');
var ZipCodes = require('zipcodes');
var filter = require("./lawyersFilter");

exports.create = function (app, connection) {

    app.get('/api/lawyer', function (req, res) {
        if (req.query.id) {
            getLawyerById(req, res);
            return;
        }

        var usersDistance = parseInt(req.query.distance);
        var usersZip = parseInt(req.query.usersZip);
        if (req.query.units == "km") {
            usersDistance = ZipCodes.toMiles(usersDistance);
        }
        var query = filter.filterLawyers(req.query.languages, req.query.services, usersZip, usersDistance);

        connection.query(query, function (err, results) {
            if (err) {
                res.json(common.getErrorObject(err));
                return;
            }

            var send = { data: [], success: true };
            send.data = results;
            res.json(send);



            //res.send('Hello');
        });
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
            console.log("DELETE FROM lawyer_language WHERE lawyerID = " + req.body.id + ";")
            connection.query("DELETE FROM lawyer_language WHERE lawyerID = " + req.body.id + ";", function (err, results) {
                if (err) throw err;
            });
            connection.query("DELETE FROM lawyer_service WHERE lawyerID = " + req.body.id + ";", function (err, results) {
                if (err) throw err;
            });
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

            }

        }

        addNewLawyerLine1 = addNewLawyerLine1.substring(0, addNewLawyerLine1.length - 2);
        addNewLawyerLine2 = addNewLawyerLine2.substring(0, addNewLawyerLine2.length - 2) + ending;


        var IDLawyer;
        connection.query(addNewLawyerLine1 + addNewLawyerLine2, function (err, results) {
            if (err) {
                res.json(common.getErrorObject(err));
                return;
            }
            if (!req.body.id) {
                console.log("new" + results.insertId);
                IDLawyer = results.insertId;
            } else {
                console.log("upd" + req.body.id);
                IDLawyer = req.body.id;
            }
            var languages = req.body.languages;
            res.json({ success: true, results: results, returnObj: results });
            if (languages && languages.length) {
                console.log(IDLawyer + " check 2");
                var addLanguages = "INSERT INTO lawyer_language (lawyerID, languageID) VALUES ";
                for (var i = 0; i < languages.length; i++) {
                    addLanguages += "(" + IDLawyer + ", "
                        + languages[i] + ")";
                    if (i < languages.length - 1) {
                        addLanguages += ", ";
                    } else addLanguages += ";";
                }
                connection.query(addLanguages, function (inErr, inResults) {
                    if (inErr) throw inErr;
                });
            }       
            var services = req.body.services;    
            if (services && services.length) {
                console.log(IDLawyer + " check 2");
                var addServices = "INSERT INTO lawyer_service (lawyerID, serviceID) VALUES ";
                for (var i = 0; i < services.length; i++) {
                    addServices += "(" + IDLawyer + ", "
                        + services[i] + ")";
                    if (i < services.length - 1) {
                        addServices += ", ";
                    } else addServices += ";";
                }
                console.log(addServices);
                connection.query(addServices, function (inErr, inResults) {
                    if (inErr) throw inErr;
                });
            }
        });

    });
    var getLawyerById = function (req, res) {
        var userId = req.query.id;
        connection.query('SELECT lawyers.*,lawyer_language.languages,lawyer_service.services FROM (SELECT * FROM lawyers WHERE id='+ userId+') AS lawyers LEFT JOIN (SELECT lawyerID, GROUP_CONCAT(languageID) AS languages FROM lawyer_language GROUP BY lawyerID) AS lawyer_language ON lawyers.id=lawyer_language.lawyerID LEFT JOIN (SELECT lawyerID, GROUP_CONCAT(serviceID) AS services FROM lawyer_service GROUP BY lawyerID) AS lawyer_service ON lawyers.id=lawyer_service.lawyerID ;', function (err, results) {
            if (err) {
                res.json(common.getErrorObject(err));
                return;
            }
            /*var languages = [];
            languages[0] = results[0].languageID;
            var services = [];
            services[0] = results[0].serviceID;
            var isPresent;
            for (var i = 1; i < results.length; i++) {
                isPresent = true;
                for (var a = 0; a < languages.length; a++) {
                    if (results[i].languageID == languages[a]) {
                        isPresent = false;

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

                    }


                }
                if (isPresent) {
                    services.push(results[i].serviceID);
                }
            }*/
             

            var lawyer = results[0];
            console.log(lawyer);
            eval("var languages = [" + (lawyer.languages||"") + "]");
            eval("var services = [" + (lawyer.services||"") + "]");
            
            lawyer.languages = languages;
            lawyer.services = services;
            console.log(lawyer);
            res.json({ data: lawyer, success: true });

        });

    };

    app.delete('/api/lawyer', function (req, res) {
        var userId = req.query.id;
        if (!userId) {
            return;
        }
        connection.query('DELETE FROM lawyers WHERE id=' + userId, function (delErr) {
            if (delErr) {
                res.json(common.getErrorObject(delErr));
                return;
            }
            connection.query('SELECT id, email, name FROM lawyers', function (selectErr, results) {
                if (selectErr) {
                    res.json(common.getErrorObject(selectErr));
                    return;
                }
                res.json({ data: results, success: true });
            });

        });

    });
}


