
var mysql = require('mysql');
var connection = mysql.createConnection({
    host: "classdb.c1fc1qmtlpg9.us-west-1.rds.amazonaws.com",
    user: "master",
    password: "dEbi07oOFHaAW1s",
    database: "test1"
});
exports.create = function (app) {
    
    app.get('/api/lawyers', function (req, res) {

        connection.query('SELECT * FROM lawyers', function (err, results) {
            if (err)
                    throw err;
            var send = {data: []};
                console.log(results);
            for (var i = 0; i < results.length; i++){
                console.log(results[i]);
                var localemail = results[i].email;
                var localname = results[i].name;
                var localdescription = results[i].description;
                var entry = {name: localname, email: localemail, description: localdescription};
                
                send.data.push(entry);
                
            }
            res.json(send);
        });
        


        //res.send('Hello');
    });

    app.post('/api/lawyers', function (req, res) {
        var name = req.param("name");

        console.log("Post on lawyers");
        console.log(name);
    });
};

