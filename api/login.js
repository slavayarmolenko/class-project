
var cookieParser = require('cookie-parser');
var session = require('express-session');


exports.create = function (app) {
    console.log("we were in init session " + app);
    app.use(cookieParser());
    app.use(session({secret: "Shh, its a secret!"}));
    app.get('/api/login', function (req, res) {
        if (req.session.page_views) {
            req.session.page_views++;
        } else {
            req.session.page_views = 1;
        }
        console.log(req.session + " Logged in");
        res.json({success: true, page_views: req.session.page_views});
    });
};

