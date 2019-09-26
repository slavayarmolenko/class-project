var common = require('./common');
var errorCodes = require('./errorTypes.js');
var posts = require('./posts');
var nodemailer = require('nodemailer');
var transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: 'slava.yarmolenko@gmail.com',
        pass: 'ECL7flier'
    }
});
exports.create = function (app, connection) {
    app.get('/api/user', function (req, res) {
        if (req.query.id) {
            getUserById(req, res);
            return;
        }
        connection.query("SELECT users.id, users.name, users.email, users.role, images.url AS imageURL "+
        'FROM users ' + 
        'LEFT JOIN (SELECT * FROM posts WHERE type = "profile") AS posts ON posts.userID = users.id ' +
        'LEFT JOIN images ON images.id=posts.imageID ORDER BY users.ranking;', function (err, results) {
            if (err) {

                res.json(common.getSqlErrorObject(err, req));
                return;
            }

            var send = common.getSuccessObject(results, req);
            res.json(send);
        });
    });
    var getUserById = function (req, res) {
        var userId = req.query.id;

        connection.query('SELECT users.id, images.id AS imageID, users.username, users.name, users.email, users.role,  posts.body, posts.subject, images.url ' +
            'FROM (SELECT * FROM users WHERE id=' + userId + ' ) AS users ' +
            'LEFT JOIN (SELECT * FROM posts WHERE type = "profile") AS posts ON posts.userID = users.id ' +
            'LEFT JOIN images ON images.id=posts.imageID;', function (err, results) {
                if (err) {
                    console.error('Failed to get lawyer by id:');
                    res.json(common.getSqlErrorObject(err, req));
                    return;
                }

                if (results.length !== 1) {
                    res.json(common.getErrorObject('User with assigned ID is not found', req, errorCodes.errors.NOT_FOUND));
                    return;
                }

                var user = results[0];

                res.json(common.getSuccessObject(user, req));

            });

    };
    app.post('/api/user', function (req, res) {
        if (req.body.email){
            connection.query("SELECT email FROM users WHERE id = " + req.body.id + ";", function (err, results) {
                if (err) {
    
                    res.json(common.getSqlErrorObject(err, req));
                    return;
                }
                console.log(res);
                var email = res.email;
            });
            var mailOptions = {
                from: 'youremail@gmail.com',
                to: email,
                subject: req.body.subj,
                text: req.body.message
            };
            transporter.sendMail(mailOptions, function (error, info) {
                if (error) {
                    console.log(error);
                } else {
                    console.log('Email sent: ' + info.response);
                }
            });
        }
        if (!common.getIsLogged(req)) {
            res.json(common.getUnloggedError());
            console.warn('User can not update user unlogged');
            return;
        }
        
        
        var isUpdate = req.body.id ? true : false;
        var addNewLawyerLine1 = 'INSERT INTO users (';
        var addNewLawyerLine2 = ') VALUES (';
        var i = 0;
        var ending = ");"
        if (isUpdate) {
            addNewLawyerLine1 = 'UPDATE users SET ';
            ending = " WHERE id=" + req.body.id + ";";
            addNewLawyerLine2 = ' ';

        }


        var columnObject = [
            {
                type: "string",
                id: "username",
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
                id: "name",
                required: true
            }, {
                type: "string",
                id: "role",
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


        var userID = req.body.id;
        console.log('Query for user update: ');
        console.log(addNewLawyerLine1 + addNewLawyerLine2);
        connection.query(addNewLawyerLine1 + addNewLawyerLine2, function (err, results) {
            if (err) {
                console.error('Failed while updating user:');
                res.json(common.getSqlErrorObject(err, req));
                return;
            }
            if (!req.body.id) {
                userID = results.insertId;
            }
            res.json(common.getSuccessObject({ ...req.body, id: results.insertId }, req));


        });

        var postsQuery = posts.getUpdatePostsString(req, true, false) + ' WHERE userID=' + userID + ' AND type = "profile"';
        connection.query(postsQuery, function (inErr, inResults) {
            if (inErr) {
                console.error('Failed while insert posts for the user:');
                res.json(common.getSqlErrorObject(inErr, req));
                return; ``
            }
        });


    });


};

