exports.create = function(app, connection) {
    app.get('/api/company', function (req, res) {
        var companyType = req.body.companyType;
        var query = 'SELECT id, email, name FROM companies' + (companyType?' WHERE companyTypeId=' + companyType: '');
        connection.query(query, function (err, results) {
            if (err)
                throw err;
            res.json({ data: results, success: true});
        });
    });
};

