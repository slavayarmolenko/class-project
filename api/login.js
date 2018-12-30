var common = require('./common');
var errorCodes = require('./errorTypes.js');


exports.create = pool.getConnection(function (app, connection) {  

    
    app.post('/api/login', function (req, res) {
        var password = req.body.password;
        var username = req.body.login;
        var query = 'SELECT id FROM users WHERE password = "' + password + '" and name="' + username + '";';
        console.log(query);
        connection.query(query, function (err, results) {
            if (err){
                res.json(common.getSqlErrorObject(err, req));
                return;
            } 
            if (results && results.length == 1){
                var sessData = req.session;
                sessData.userID = results[0].id;
                res.json(common.getSuccessObject(results, req));
                console.log(username + " logged in.");
            } else {
                res.json(common.getErrorObject('User with assigned username and password is not found', req, errorCodes.errors.NOT_FOUND));
            }
        });
        
    });
    app.get('/api/login', function(req,res){
        res.json(common.getSuccessObject({}, req));
    });
});



