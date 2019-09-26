var common = require('./common');
var errorCodes = require('./errorTypes.js');
var nodemailer = require('nodemailer');
var transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: 'slava.yarmolenko@gmail.com',
        pass: 'ECL7flier'
    }
});

exports.create = function (app, connection) {
    app.get('/api/user', function (req, res) {
        connection.query("SELECT name, role FROM users;", function (err, results) {
            if (err) {
                res.json(common.getSqlErrorObject(err, req));
                return;
            }

            var send = common.getSuccessObject(results, req);
            res.json(send);
        });
    });
    app.post('/api/user', function (req, res) {
        var email;
        connection.query("SELECT email FROM users WHERE id = " + req.body.id + ";", function (err, results) {
            if (err) {

                res.json(common.getSqlErrorObject(err, req));
                return;
            }
            console.log(res);
            var email = res.email;
        });
        var mailOptions = {
            from: 'slava.yarmolenko@gmail.com',
            to: email,
            subject: req.body.subject,
            text: req.body.text
        };
        transporter.sendMail(mailOptions, function (error, info) {
            if (error) {
                console.log(error);
            } else {
                console.log('Email sent: ' + info.response);
            }
        });
    });
}