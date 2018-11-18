
exports.create = function(app, connection) {
    app.get('/api/utils/languages', function (req, res) {
        connection.query('SELECT * FROM languages', function (err, results) {
            if (err)
                throw err;
            res.json({data: results, success: true});
        });    

    });
    
    app.get('/api/utils/services', function (req, res) {
        connection.query('SELECT * FROM service', function (err, results) {
            if (err)
                throw err;
            res.json({data: results, success: true});
        });    

    });

    app.post('/api/utils/languages', function (req, res) {
        var newName = (req.body.name || '').trim();
        if (!newName) {
            return { success: false, errMessage: 'New Language name is required.'};
        }
        connection.query('INSERT INTO languages(name) VALUES ("' + newName + '")', function (err, results) {
            if (err)
                throw err;
            res.json({data: {id: results.insertId}, success: true});
        });    

    });

    app.post('/api/utils/services', function (req, res) {
        var newName = (req.body.name || '').trim();
        if (!newName) {
            return { success: false, errMessage: 'New Service name is required.'};
        }
        connection.query('INSERT INTO service(name) VALUES ("' + newName + '")', function (err, results) {
            if (err)
                throw err;
            res.json({data: {id: results.insertId}, success: true});
        });    

    });
};

