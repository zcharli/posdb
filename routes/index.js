var express = require('express');
var router = express.Router();
var sqlite3 = require('sqlite3').verbose();

//var db = new sqlite3.Database('data/posdb');

/* GET home page. */
router.get('/', function(req, res, next) {
  var username = req.session.username;

  if(username){
    res.render('index', { title: 'Express' });
  }else{
    res.render('login', { title: 'Express' });
  }

});

module.exports = router;
