var common = require('./common');
exports.create = function(app, connection) {
    app.get('/api/utils/languages', function (req, res) {
        connection.query('SELECT * FROM languages', function (err, results) {
            if (err) {
                res.json(common.getErrorObject(err));
                return;
            } 
            res.json({data: results, success: true});
        });    

    });
    
    app.get('/api/utils/services', function (req, res) {
        connection.query('SELECT * FROM service', function (err, results) {
            if (err) {
                res.json(common.getErrorObject(err));
                return;
            } 

            res.json({data: results, success: true});
            
        });    

    });

    app.get('/api/utils/companyTypes', function (req, res) {
        connection.query('SELECT * FROM companyTypes', function (err, results) {
            if (err) {
                res.json(common.getErrorObject(err));
                return;
            } 

            res.json({data: results, success: true});
            
        });    

    });

    app.post('/api/utils/languages', function (req, res) {
        var newName = (req.body.name || '').trim();
        if (!newName) {
            return { success: false, errMessage: 'New Language name is required.'};
        }
        connection.query('INSERT INTO languages(name) VALUES ("' + newName + '")', function (err, results) {
            if (err) {
                res.json(common.getErrorObject(err));
                return;
            } 
            res.json({data: {id: results.insertId}, success: true});
        });    

    });

    app.post('/api/utils/services', function (req, res) {
        var newName = (req.body.name || '').trim();
        if (!newName) {
            return { success: false, errMessage: 'New Service name is required.'};
        }
        connection.query('INSERT INTO service(name) VALUES ("' + newName + '")', function (err, results) {
            if (err) {
                res.json(common.getErrorObject(err));
                return;
            } 
            res.json({data: {id: results.insertId}, success: true});
        });    

    });
    app.delete('/api/utils/languages', function (req, res) {
        var languageId = req.query.id;
        if (!languageId) {
            return;
        }
        connection.query('DELETE FROM languages WHERE id=' + languageId, function (delErr) {
            if (delErr) {
                res.json(common.getErrorObject(delErr));
                return;
            }
            connection.query('SELECT * FROM languages', function (selectErr, results) {
                if (selectErr) {
                    res.json(common.getErrorObject(selectErr));
                    return;
                } 
                res.json({ data: results, success: true });
            });
            
        });

    });
};

