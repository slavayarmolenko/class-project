var express = require('express');
var app = express();
var teamService = require('./team');
var postService =  require('./posts');
var lawyersService = require('./lawyers');
var companiesService = require('./companies');
var loginService = require('./login');
var utilsService = require('./utils');
var mysql = require('mysql');
var bodyParser = require('body-parser');
var session = require('express-session');
var dbconfig = require("/etc/app/dbconfig.json")

app.use(session({ secret: 'this-is-a-secret-token', cookie: { maxAge: 1200000 }}));
app.all('*', function (req, res, next) {
    console.log(req.session);

  next(); // pass control to the next handler
});
/* var pool  = mysql.createPool({
    connectionLimit : 10,
    host: "localhost",
    user: "root",
    password: "aaa12345",
    database: "classdb"
  }); */
  
  var pool  = mysql.createPool({
    connectionLimit : 10,
    /*host: "localhost",
    user: "root",
    password: "aaa12345",
    database: "classdb"*/
    host: dbconfig.address,
    user: dbconfig.login,
    password: dbconfig.pass,
    database: dbconfig.dbname
  });
     

console.log('Trying to create connection');
/*pool.connect(function (err) {
    if (err)
        throw err;
    console.log('You are now connected...');
})*/

app.use(bodyParser.json()); // support json encoded bodies
app.use(bodyParser.urlencoded({ extended: true })); // support encoded bodies



utilsService.create(app, pool);
teamService.create(app, pool);
lawyersService.create(app, pool);
companiesService.create(app, pool);
loginService.create(app, pool);
postService.create(app, pool);
var server = app.listen(8081, function () {
    var host = server.address().address;
    var port = server.address().port;
    console.log("Example app listening at http://%s:%s", host, port);
});

