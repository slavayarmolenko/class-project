/*
Vladislav Iarmolenko
slava.yarmolenko@gmail.com
Created: August 2018
*/
var fileSystem = require("fs");
var common = require('./common');

var ZipCodes = require('zipcodes');
var filter = require("./lawyersFilter");
var errorCodes = require('./errorTypes.js');

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
        console.log('Search for lawyers. Query: ' + query);
        connection.query(query, function (err, results) {
            if (err) {
                console.error('DB exception while getting lawyers.');
                res.json(common.getSqlErrorObject(err, req));
                return;
            }

            var send = common.getSuccessObject(results, req);
            console.log('Searched succesfully.');
            res.json(send);
        });
    });
    app.post('/api/lawyer', function (req, res) {
        console.log('Update/Insert lawyers. Data: ');
        console.log(req.body);
        if (!common.getIsLogged(req)) {
            res.json(common.getUnloggedError());
            console.warn('User can not update lawyer unlogged');
            return;
        }
        var isUpdate = req.body.id ? true : false;
        var addNewLawyerLine1 = 'INSERT INTO lawyers (';
        var addNewLawyerLine2 = ') VALUES (';
        var i = 0;
        var ending = ");"
        if (isUpdate) {
            addNewLawyerLine1 = 'UPDATE lawyers SET ';
            ending = " WHERE id=" + req.body.id + ";";
            addNewLawyerLine2 = ' ';
            connection.query("DELETE FROM lawyer_language WHERE lawyerID = " + req.body.id + ";", function (err, results) {
                if (err) {
                    console.error('Error while updating languages for lawyers.');
                    res.json(common.getSqlErrorObject(inErr, req));
                    return;
                }
            });
            connection.query("DELETE FROM lawyer_service WHERE lawyerID = " + req.body.id + ";", function (err, results) {
                if (err) {
                    console.error('Error while updating services for lawyers.');
                    res.json(common.getSqlErrorObject(inErr, req));
                    return;
                }
            });
        }
        

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
            }, {
                type: "number",
                id: "imageID",
                required: true
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
        console.log('Query for lawyer update: ');
        console.log(addNewLawyerLine1 + addNewLawyerLine2);
        connection.query(addNewLawyerLine1 + addNewLawyerLine2, function (err, results) {
            if (err) {
                console.error('Failed while updating lawyer:');
                res.json(common.getSqlErrorObject(err, req));
                return;
            }
            if (!req.body.id) {
                IDLawyer = results.insertId;
            } else {
                IDLawyer = req.body.id;
            }
            var languages = req.body.languages;
            res.json(common.getSuccessObject({...req.body, id: results.insertId}, req));
            if (languages && languages.length) {
                var addLanguages = "INSERT INTO lawyer_language (lawyerID, languageID) VALUES ";
                for (var i = 0; i < languages.length; i++) {
                    addLanguages += "(" + IDLawyer + ", "
                        + languages[i] + ")";
                    if (i < languages.length - 1) {
                        addLanguages += ", ";
                    } else addLanguages += ";";
                }
                connection.query(addLanguages, function (inErr, inResults) {
                    if (inErr) {
                        console.error('Failed while insert languages for the lawyer:');
                        res.json(common.getSqlErrorObject(inErr, req));
                        return;
                    }
                });
            }       
            var services = req.body.services;    
            if (services && services.length) {
                var addServices = "INSERT INTO lawyer_service (lawyerID, serviceID) VALUES ";
                for (var i = 0; i < services.length; i++) {
                    addServices += "(" + IDLawyer + ", "
                        + services[i] + ")";
                    if (i < services.length - 1) {
                        addServices += ", ";
                    } else addServices += ";";
                }
                connection.query(addServices, function (inErr, inResults) {
                    if (inErr) {
                        console.error('Failed while insert services for the lawyer:');
                        res.json(common.getSqlErrorObject(inErr, req));
                        return;
                    };
                });
            }
        });

    });
    var getLawyerById = function (req, res) {
        var userId = req.query.id;
        console.log('We get lawyer by ID=' + userId);
        connection.query('SELECT lawyers.*,lawyer_language.languages,lawyer_service.services, images.url AS imageURL ' +
            'FROM (SELECT * FROM lawyers WHERE id='+ userId+') AS lawyers ' +
            'LEFT JOIN (SELECT lawyerID, GROUP_CONCAT(languageID) AS languages FROM lawyer_language GROUP BY lawyerID) AS lawyer_language ON lawyers.id=lawyer_language.lawyerID ' + 
            'LEFT JOIN (SELECT lawyerID, GROUP_CONCAT(serviceID) AS services FROM lawyer_service GROUP BY lawyerID) AS lawyer_service ON lawyers.id=lawyer_service.lawyerID ' +
            'LEFT JOIN images ON images.id=lawyers.imageID;', function (err, results) {
            if (err) {
                console.error('Failed to get lawyer by id:');
                res.json(common.getSqlErrorObject(err, req));
                return;
            }

            if (results.length !== 1) {
                res.json(common.getErrorObject('Attorney with assigned ID is not found', req, errorCodes.errors.NOT_FOUND));
                return;
            }

            var lawyer = results[0];
            eval("var languages = [" + (lawyer.languages||"") + "]");
            eval("var services = [" + (lawyer.services||"") + "]");
            
            lawyer.languages = languages;
            lawyer.services = services;
            console.log('Lawyer: ');
            res.json(common.getSuccessObject(lawyer, req));

        });

    };

    app.delete('/api/lawyer', function (req, res) {
        var userId = req.query.id;
        if (!userId) {
            return;
        }

        console.log('Deleting lawyer from the table');
        if (!common.getIsLogged(req)) {
            console.warn('WARN: You can not delete lawyer unlogged');
            res.json(common.getUnloggedError());
            return;
        }

        connection.query('DELETE FROM lawyers WHERE id=' + userId, function (delErr) {
            if (delErr) {
                console.error('Error while deleting lawyer.');
                res.json(common.getSqlErrorObject(delErr, req));
                return;
            }
            var usersDistance = parseInt(req.query.distance);
            var usersZip = parseInt(req.query.usersZip);
            if (req.query.units == "km") {
                usersDistance = ZipCodes.toMiles(usersDistance);
            }
            var query = filter.filterLawyers(req.query.languages, req.query.services, usersZip, usersDistance);
            connection.query(query, function (selectErr, results) {
                if (selectErr) {
                    console.error('Error while getting the list of lawyers after lawyer delete.');
                    res.json(common.getSqlErrorObject(selectErr, req));
                    return;
                }
                console.log('Lawyer is retrieved succesfully.');
                res.json({ data: results, success: true });
            });

        });

    });
}


