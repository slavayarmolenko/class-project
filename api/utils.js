
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
};

