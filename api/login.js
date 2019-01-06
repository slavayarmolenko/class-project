var common = require('./common');
var errorCodes = require('./errorTypes.js');


exports.create = function (app, pool) {  
    //console.log(pool);
    //connection = pool.getConnection();
    app.post('/api/login', function (req, res) {
        var password = req.body.password;
        var username = req.body.login;
        var query = 'SELECT id FROM users WHERE password = "' + password + '" and username="' + username + '";';
        pool.query(query, function (err, results) {
            if (err){
                res.json(common.getSqlErrorObject(err, req));
                console.error('User failed to login: DB error.');
                return;
            } 
            if (results && results.length == 1){
                var sessData = req.session;
                sessData.userID = results[0].id;
                sessData.username = username;
                res.json(common.getSuccessObject(results, req));
                console.log(username + " logged in.");
            } else {
                res.json(common.getErrorObject('User with assigned username and password is not found', req, errorCodes.errors.NOT_FOUND));
                console.warn('User failed to login: User is not found.');
            }
        });
        
    });
    app.get('/api/login', function(req,res){
        res.json(common.getSuccessObject({}, req));
    });
};



