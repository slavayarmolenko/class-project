exports.create = function(app, connection) {
    app.get('/api/user', function (req, res) {
       res.json({data:[{name: "Slava", role:"UI programmer/God, just god"},{name:"Vika", role:"CEO"}]});
       //res.send('Hello');
    });
};

