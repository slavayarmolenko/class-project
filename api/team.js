var common = require('./common');

exports.create = function(app, connection) {
    app.get('/api/team', function (req, res) {
        if (req.query.id) {
            getLawyerById(req, res);
            return;
        }
        connection.query("SELECT name, email, role FROM users", function (err, results) {
            if (err) {
                console.error('DB exception while getting users.');
                res.json(common.getSqlErrorObject(err, req));
                return;
            }

            var send = common.getSuccessObject(results, req);
            res.json(send);
        });
    });
    
};

