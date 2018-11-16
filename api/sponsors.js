exports.create = function(app, connection) {
    app.get('/api/sponsor', function (req, res) {
       res.json({data:[]});
    });
};