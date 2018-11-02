
var cookieParser = require('cookie-parser');
var session = require('express-session');
var array_flatten = require('array-flatten');
var mysql = require('mysql');
var connection = mysql.createConnection({
    host: "classdb.c1fc1qmtlpg9.us-west-1.rds.amazonaws.com",
    user: "master",
    password: "dEbi07oOFHaAW1s",
    database: "test1"
});


exports.create = function (app) {
    console.log("we were in init session " + app);
    app.use(cookieParser());
    app.use(session({secret: "Shh, its a secret!"}));
    app.post('/api/login', function (req, res) {
        if (req.session.page_views) {
            req.session.page_views++;
        } else {
            req.session.page_views = 1;
        }
        console.log(req.body.login + " Logged in");
        var query = 'SELECT * FROM users WHERE password="' + req.body.password + '" AND name="' + req.body.login + '";';
        connection.query(query, function (err, results) {
            console.log('Users found =' + results.length);
            if (err) 
                throw err;
            console.log("Bug here");
            var receivedPassword = results[0];  
            if ((req.body.login === "Vasya")&&(req.body.password === results[1])){
                req.session.admin = true;
                req.session.ssid = 1;
            }   
        });
        
        
        console.log('connection query successfully sent');
        //console.log(req.session.admin);
        res.json({success: true, page_views: req.session.page_views, ssid: req.session.ssid, admin: req.session.admin});
        
        
    });
};

