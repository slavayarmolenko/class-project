var common = require('./common');
var errorCodes = require('./errorTypes.js');

exports.create = function(app, connection) {
    app.get('/api/user', function (req, res) {
        if (req.query.id) {
            getUserById(req, res);
            return;
        }
        connection.query("SELECT id, name, email, role FROM users", function (err, results) {
            if (err) {
                console.error('DB exception while getting users.');
                res.json(common.getSqlErrorObject(err, req));
                return;
            }

            var send = common.getSuccessObject(results, req);
            res.json(send);
        });
    });
    var getUserById = function (req, res) {
        var userId = req.query.id;
        console.log('We get user by ID=' + userId);
        connection.query('SELECT users.id, users.username, users.name, users.email, users.role,  posts.body, posts.subject, images.url ' + 
            'FROM (SELECT * FROM users WHERE id=' + userId + ' ) AS users ' +
            'LEFT JOIN (SELECT * FROM posts WHERE type = "profile") AS posts ON posts.userID = users.id '+
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
    
};

