var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  console.log("na nachalnatra stranica sam ")
  res.render('index', { title: 'Bachka' });
});


module.exports = router;
