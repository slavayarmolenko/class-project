exports.create = function(app, connection) {
    app.get('/api/partner', function (req, res) {
        res.json({data:[]});
    });
};

