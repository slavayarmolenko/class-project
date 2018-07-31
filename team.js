var express = require('express');
var router = express.Router();

router.get('/team', function (req, res) {
    var data = {data:[{name: "Slava", role:"UI programmer/God, just god"},{name:"Vika", role:"CEO"}]};
   // data = "slava";
    console.log(data);
    //res.send(data);    //
    res.json(data);
});

module.exports = router;


