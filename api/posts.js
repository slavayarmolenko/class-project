var common = require('./common');
exports.create = function(app, connection) {
    app.get('/api/post', function (req, res) {
        if (req.query.id) {
            getPostById(req,res);
            return;
        }
        if (req.query.userID){
            getPostByUserID(req,res);
            return;
        }
        
        SQLquery = 'SELECT posts.id, posts.subject, images.url AS imageURL, posts.body, DATE_FORMAT(posts.created, "%H:%i %M %D %Y") AS createdAt, users.id AS userID, users.name AS author FROM users ' + 
        'LEFT JOIN (SELECT * FROM posts) AS posts ON posts.userID = users.id ' + 
        'LEFT JOIN (SELECT * FROM images) AS images ON images.id=posts.imageID WHERE type <> "profile" ORDER BY posts.created DESC;';
        connection.query(SQLquery, function (err, results) {
            if (err) {
                console.error('DB exception while getting posts.');
                res.json(common.getSqlErrorObject(err, req));
                return;
            }

            var send = common.getSuccessObject(results, req);
            console.log('Searched succesfully.');
            res.json(send);
        });
    });
    var getPostByID = function (req, res){
        SQLquery = 'SELECT posts.id, posts.subject, images.url AS imageURL, posts.body, DATE_FORMAT(posts.created, "%H:%i %M %D %Y") AS createdAt, users.id AS userID, users.name AS author FROM users ' + 
            'LEFT JOIN (SELECT * FROM posts) AS posts ON posts.userID = users.id ' + 
            'LEFT JOIN (SELECT * FROM images) AS images ON images.id=posts.imageID WHERE posts.id = '+req.query.id+' ORDER BY posts.created DESC;';
            connection.query(SQLquery, function (err, results) {
                if (err) {
                    console.error('DB exception while getting posts.');
                    res.json(common.getSqlErrorObject(err, req));
                    return;
                }
    
                var send = common.getSuccessObject(results, req);
                console.log('Searched succesfully.');
                res.json(send);
            });
    
    }
    var getPostByUserID = function (req, res){
        SQLquery = 'SELECT posts.id, posts.subject, images.url AS imageURL, posts.body, DATE_FORMAT(posts.created, "%H:%i %M %D %Y") AS createdAt, users.id AS userID, users.name AS author FROM users ' + 
            'LEFT JOIN (SELECT * FROM posts) AS posts ON posts.userID = users.id ' + 
            'LEFT JOIN (SELECT * FROM images) AS images ON images.id=posts.imageID WHERE users.id = '+req.query.userID+' ORDER BY posts.created DESC;';
            connection.query(SQLquery, function (err, results) {
                if (err) {
                    console.error('DB exception while getting posts.');
                    res.json(common.getSqlErrorObject(err, req));
                    return;
                }
    
                var send = common.getSuccessObject(results, req);
                console.log('Searched succesfully.');
                res.json(send);
            });
    
    }
    app.post('/api/post', function (req, res) {

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
                type: "number",
                id: "userID",
                required: true
            }, {
                type: "string",
                id: "body",
                required: true
            }, {
                type: "string",
                id: "subject",
                required: true
            }, {
                type: "number",
                id: "imageID",
                required: true
            }, {
                type: "string",
                id: "body",
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


        var postID = req.body.id;
        console.log('Query for user update: ');
        console.log(addNewLawyerLine1 + addNewLawyerLine2);
        connection.query(addNewLawyerLine1 + addNewLawyerLine2, function (err, results) {
            if (err) {
                console.error('Failed while updating user:');
                res.json(common.getSqlErrorObject(err, req));
                return;
            }
            if (!req.body.id) {
                postID = results.insertId;
            }
            res.json(common.getSuccessObject({ ...req.body, id: results.insertId }, req));


        });
        


    });
    
};










































exports.getUpdatePostsString = function (req, isUpdate, needsWhere){
    console.log("Post created!");
    console.log(req.body);
    var addNewPost1 = 'INSERT INTO posts (';
    var addNewPost2 = ') VALUES (';
    var i = 0;
        var ending = ");";
        if (isUpdate) {
            addNewPost1 = 'UPDATE posts SET ';
            ending =needsWhere ? " WHERE id=" + req.body.id : "" ;
            addNewPost2 = ' ';
        }
    var columnObject = [
        {
            type: "string",
            id: "body",
            required: true
        }, {
            type: "string",
            id: "subject",
            required: true
        }, {
            type: "number",
            id: "imageID",
            required: false
        }, {
            type: "number",
            id: "userID",
            required: true
        }, {
            type: "string",
            id: "body",
            required: false
        }, 
    ];
    
    for (var i = 0; i < columnObject.length; i++) {
        if (isUpdate) {
            addNewPost1 += common.getUpdateValueString(columnObject[i], req.body[columnObject[i].id]);
            console.log('update result ' + addNewPost1);
        } else {
            addNewPost1 += common.getInsertNameString(columnObject[i], req.body[columnObject[i].id]);
            addNewPost2 += common.getInsertValueString(columnObject[i], req.body[columnObject[i].id]);

        }

    }
    addNewPost1 = addNewPost1.substring(0, addNewPost1.length - 2);
    addNewPost2 = addNewPost2.substring(0, addNewPost2.length - 2) + ending;
    var res = addNewPost1 + addNewPost2;
    console.log(res);
    return res;
}
