var common = require('./common');

exports.create = function(app, connection) {
    app.get('/api/company', function (req, res) {
        var companyType = req.body.companyType;
        var query = 'SELECT id, description, name FROM companies' + (companyType?' WHERE companyTypeId=' + companyType: '');
        connection.query(query, function (err, results) {
            if (err) {
                res.json(common.getSqlErrorObject(err, req));
                return;
            }
            res.json(common.getSuccessObject(results, req));
        });
    });
};

