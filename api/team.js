
exports.create = function(app) {
    app.get('/api/team', function (req, res) {
       res.json({data:[{name: "Slava", role:"UI programmer/God, just god"},{name:"Vika", role:"CEO"}]});
       //res.send('Hello');
    });
};

