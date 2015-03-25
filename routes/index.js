var express = require('express');
var router = express.Router();
var sqlite3 = require('sqlite3').verbose();

var db = new sqlite3.Database('data/posdb');

var getAllQuery = function(sql) {
  var rows = [];
  db.serialize(function(){
    db.each(sql,function(err,row){
      var r = [];
      for(var i in row) {
        r.push(row[i]);
      }
      rows.push(r);
    },function(){
      //callback function when all rows are done
      console.log(rows);
      return rows;
    })
  });
}

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
  res.render('login');
<<<<<<< HEAD
});

router.get('/getCategories', function(req, res, next) {
  var username = req.session.username;
  var priv = req.session.privledge;
  if(username && (priv == "Admin" || priv == "Manager")){
    var rows = [];
    db.serialize(function(){
      db.each("SELECT * FROM CATEGORY",function(err,row){
        var r = [];
        for(var i in row) {
          r.push(row[i]);
        }
        rows.push(r);
      },function(){
        //callback function when all rows are done
        
        res.json();
      })
    });
  }else{
    res.redirect('login');
  }
=======
>>>>>>> 8fd463961012fec1f3549bf634b7db30fda64d80
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
