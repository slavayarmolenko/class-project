exports.create = function(app, connection) {
    app.get('/api/volonteer', function (req, res) {
       res.json({data:[]});
    });
};

