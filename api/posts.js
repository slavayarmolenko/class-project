var common = require('./common');
exports.create = function(app, connection) {
    app.get('/api/post', function (req, res) {
        if (req.query.id) {
            getPostById(req, res);
            return;
        }
        if (req.query.userID){
            getPostByUserID(req, res);
            return;
        }
        
        SQLquery = 'SELECT posts.id, posts.subject, images.url AS imageURL, posts.body, posts.created AS createdAt, users.id AS userID, users.name AS author FROM users ' + 
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
    
};
exports.getPostByID = function (postID){
    SQLquery = 'SELECT posts.id, posts.subject, images.url AS imageURL, posts.body, posts.created AS createdAt, users.id AS userID, users.name AS author FROM users ' + 
        'LEFT JOIN (SELECT * FROM posts) AS posts ON posts.userID = users.id ' + 
        'LEFT JOIN (SELECT * FROM images) AS images ON images.id=posts.imageID WHERE posts.id = '+postID+' ORDER BY posts.created DESC;';
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
exports.getPostByUserID = function (userID){
    SQLquery = 'SELECT posts.id, posts.subject, images.url AS imageURL, posts.body, posts.created AS createdAt, users.id AS userID, users.name AS author FROM users ' + 
        'LEFT JOIN (SELECT * FROM posts) AS posts ON posts.userID = users.id ' + 
        'LEFT JOIN (SELECT * FROM images) AS images ON images.id=posts.imageID WHERE users.id = '+userID+' ORDER BY posts.created DESC;';
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
            required: false
        }, {
            type: "string",
            id: "subject",
            required: false
        }, {
            type: "number",
            id: "imageID",
            required: true
        }
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
