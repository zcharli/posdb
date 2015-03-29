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
});

router.get('/getProducts',function(req,res,next){
  var username = req.session.username;
  var priv = req.session.privledge;
  var rows = [];
  if(username && (priv == "Admin" || priv == "Manager")){
    
    db.serialize(function(){
      db.each("SELECT PRODUCT_ID,PRODUCT_BARCODE_SKU, PRODUCT_NAME, CATEGORY_NAME, PRICE"
        + " P.CATEGORY_ID FROM PRODUCTS P JOIN CATEGORY C ON"
        + " P.CATEGORY_ID=C.CATEGORY_ID WHERE DATE_DISCONTINUED IS NULL"
        + " ORDER BY PRODUCT_NAME ASC",function(err,row){
        var r = [];
        var price = 0;
        for(var i in row) {
          if(price == 5) //price is the 5th column
            row[i] = row[i]/100;
          r.push(row[i]);
          ++price;
        }
        rows.push(r);
      },function(){
        //callback function when all rows are 
        res.render('partials/product_table',{rows:rows});
      })
    });
  }else{
    res.redirect('login');
  }
});

router.get('/getCategories/:page?', function(req, res, next) {
  var username = req.session.username;
  var priv = req.session.privledge;
  var rows = [];
  var option = req.params.page;
  if(username && (priv == "Admin" || priv == "Manager")){
    
    db.serialize(function(){
      db.each("SELECT * FROM CATEGORY ORDER BY PARENT_CATEGORY_ID asc",function(err,row){
        var r = [];
        for(var i in row) {r.push(row[i]);}
        rows.push(r);
      },function(){
        //callback function when all rows are 
        var heirarchy = {};
        for(var i=0;i<rows.length;++i){
          if(rows[i][1] == 0){
            heirarchy[rows[i][0]] = [];
            heirarchy[rows[i][0]].push(rows[i]);
          }else{
            heirarchy[rows[i][1]].push(rows[i]);
          }
        }
        if(option){
          res.render('partials/category_options',{rows:heirarchy});
        }else{
          res.render('partials/category',{rows:heirarchy});
        }
      })
    });
  }else{
    res.redirect('login');
  }
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
