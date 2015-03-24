var express = require('express');
var router = express.Router();
var sqlite3 = require('sqlite3').verbose();

//var db = new sqlite3.Database('data/posdb');

/* GET home page. */
router.get('/', function(req, res, next) {
  var username = req.session.username;
  var privledge = req.session.privledge;
  if(username){
    res.render('index', { user: username,
                          user: username,
                          privledge: privledge});
  }else{
    res.render('login', { user: username });
  }
});

router.get('/main', function(req, res, next) {
  var username = req.session.username;

  if(username){

    res.render('partials/main');
  }else{
    res.render('login', { user: username });
  }
});

router.get('/goproduct', function(req, res, next) {
  var username = req.session.username;
  if(username){
    res.render('partials/product');
  }else{
    res.render('login', { user: username });
  }
});

router.get('/gousers', function(req, res, next) {
  var username = req.session.username;
  if(username){
    res.render('partials/users');
  }else{
    res.render('login', { user: username });
  }
});

router.get('/gosales', function(req, res, next) {
  var username = req.session.username;
  if(username){
    res.render('partials/sales');
  }else{
    res.render('login', { user: username });
  }
});

router.get('/login', function(req, res, next) {
  req.session.username = undefined;
  req.session.privledge = undefined;
  res.render('login', { user: username });
});

router.post('/signin', function(req, res, next) {
  var username = req.body.username;
  var pass = req.body.password;
  // test password
  //then
  var priv = "Admin";
  req.session.username = username;
  req.session.privledge = priv;
  res.redirect("/");

});

module.exports = router;
