
var cookieParser = require('cookie-parser');
var session = require('express-session');


exports.create = function (app, connection) {  

    app.use(session({ secret: 'this-is-a-secret-token', cookie: { maxAge: 1200000 }}));
    app.post('/api/login', function (req, res) {
        var password = req.body.password;
        var username = req.body.login;
        var timestamp =  new Date();
        var sessData = req.session;
        var query = 'SELECT id FROM users WHERE password = "' + password + '" and name="' + username + '";';
        console.log(query);
        connection.query(query, function (err, results) {
            if (err){
                res.json({success: false});
                return;
            } 
            if (results && results.length == 1){
                var sessData = req.session;
                sessData.userID = results[0].id;
                res.json({success: true});
                console.log(username + " logged in.");
            } else {
                res.json({success: false});
            }
        });
        
    });
    app.get('/api/login', function(req,res){
        var userID = req.session.userID;
        if(userID){
            res.json({success: true});
        } else {
            res.json({success: false});
        }
    });
};

