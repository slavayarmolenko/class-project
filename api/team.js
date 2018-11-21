exports.create = function(app, connection) {
    app.get('/api/user', function (req, res) {
       res.json({data:[
           {name: "Slava", role:"Full Stack programmer"},
            {name:"Jenna Teterin", role:"CEO"},
            {name:"Hanna Levin", role:"Project Manager"},
        ]
    });
       //res.send('Hello');
    });
};

