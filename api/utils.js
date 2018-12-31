var common = require('./common');
exports.create = function(app, connection) {
    app.get('/api/utils/languages', function (req, res) {
        connection.query('SELECT * FROM languages', function (err, results) {
            if (err) {
                res.json(common.getSqlErrorObject(err, req));
                return;
            } 
            res.json(common.getSuccessObject(results, req));
        });    

    });
    
    app.get('/api/utils/services', function (req, res) {
        connection.query('SELECT * FROM service', function (err, results) {
            if (err) {
                res.json(common.getSqlErrorObject(err, req));
                return;
            } 

            res.json(common.getSuccessObject(results, req));
            
        });    

    });

    app.get('/api/utils/companyTypes', function (req, res) {
        connection.query('SELECT * FROM companyTypes', function (err, results) {
            if (err) {
                res.json(common.getSqlErrorObject(err, req));
                return;
            } 

            res.json(common.getSuccessObject(results, req));
            
        });    

    });

    app.post('/api/utils/languages', function (req, res) {
        var newName = (req.body.name || '').trim();
        if (!newName) {
            return { success: false, errMessage: 'New Language name is required.'};
        }
        connection.query('INSERT INTO languages(name) VALUES ("' + newName + '")', function (err, results) {
            if (err) {
                res.json(common.getSqlErrorObject(err, req));
                return;
            } 
            res.json(common.getSuccessObject({...req.body, id: results.insertId}, req));
        });    

    });

    app.post('/api/utils/services', function (req, res) {
        var newName = (req.body.name || '').trim();
        if (!newName) {
            return { success: false, errMessage: 'New Service name is required.'};
        }
        connection.query('INSERT INTO service(name) VALUES ("' + newName + '")', function (err, results) {
            if (err) {
                res.json(common.getSqlErrorObject(err, req));
                return;
            } 
            res.json(common.getSuccessObject({...req.body, id: results.insertId}, req));
        });    

    });
    app.delete('/api/utils/languages', function (req, res) {
        var languageId = req.query.id;
        if (!languageId) {
            return;
        }
        connection.query('DELETE FROM languages WHERE id=' + languageId, function (delErr) {
            if (delErr) {
                res.json(common.getSqlErrorObject(delErr, req));
                return;
            }
            connection.query('SELECT * FROM languages', function (selectErr, results) {
                if (selectErr) {
                    res.json(common.getSqlErrorObject(selectErr, req));
                    return;
                } 
                res.json(common.getSuccessObject(results, req));
            });
            
        });

    });

    app.delete('/api/utils/services', function (req, res) {
        var languageId = req.query.id;
        if (!languageId) {
            return;
        }
        connection.query('DELETE FROM services WHERE id=' + languageId, function (delErr) {
            if (delErr) {
                res.json(common.getSqlErrorObject(delErr, req));
                return;
            }
            connection.query('SELECT * FROM services', function (selectErr, results) {
                if (selectErr) {
                    res.json(common.getSqlErrorObject(selectErr, req));
                    return;
                } 
                res.json(common.getSuccessObject(results, req));
            });
            
        });

    });

    app.post('/api/utils/uploadImage', function (req, res) {
        fs.open(temp_path, 'r', function (status, fd) {
            if (status) {
                console.log(status.message);
                return;
            }
            var fileSize = getFilesizeInBytes(temp_path);
            var buffer = new Buffer(fileSize);
            fs.read(fd, buffer, 0, fileSize, 0, function (err, num) {
        
                var query = "INSERT INTO images SET ?",
                    values = {
                        file_type: 'img',
                        file_size: buffer.length,
                        file: buffer
                    };
                mySQLconnection.query(query, values, function (er, da) {
                    if(er)throw er;
                });
        
            });
        });
    });
};

