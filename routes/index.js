var express = require('express');
var router = express.Router();
var sqlite3 = require('sqlite3').verbose();

var db = new sqlite3.Database('data/posdb');
var tempCatNum = 0;
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

router.get('/getProducts/:option?/:start?/:end?',function(req,res,next){
  var username = req.session.username;
  var priv = req.session.privledge;
  var option = req.params.option;
  var start = req.params.start;
  var end = req.params.end;
  var rows = [];
  if(username){ //&& (priv == "Admin" || priv == "Manager")
    db.serialize(function(){
      db.each("SELECT PRODUCT_ID,PRODUCT_BARCODE_SKU, PRODUCT_NAME, CATEGORY_NAME, PRICE,"
        + " P.CATEGORY_ID FROM PRODUCT P JOIN CATEGORY C ON"
        + " P.CATEGORY_ID=C.CATEGORY_ID WHERE DATE_DISCONTINUED IS NULL"
        + " ORDER BY PRODUCT_NAME ASC",function(err,row){
        var r = [];
        var price = 0;
        for(var i in row) {
          if(price == 4) //price is the 5th column
            row[i] = row[i]/100;
          r.push(row[i]);
          ++price;
        }
       // console.log(r);
        rows.push(r);
      },function(err){
        if(err){
          console.log(err)
        }else{
          console.log(this);
        }
        //callback function when all rows are 
        if(option){
          var pagiNeed = 0;
          option -= Math.ceil(tempCatNum/6);
          var maxProd = option*6;
          if(!start){start = 0;}
          if(!end){end = rows.length}
          if(rows.length > maxProd){
            pagiNeed = 1;
            rows = rows.splice(start,maxProd);
          }else{
            rows = rows.splice(start,end);
          }
          console.log(rows)
          res.render('partials/product_select', {rows: rows, page:pagiNeed});
        }else{
          res.render('partials/product_table',{rows:rows});
        }
      })
    });
  }else{
    res.redirect('login');
  }
});

router.post('/update',function(req,res,next){
  var username = req.session.username;
  var priv = req.session.privledge;
  var data = req.body; //id, name,price,category_id,sku
  //console.log(data);
  if(username && (priv == "Admin" || priv == "Manager")){
    db.serialize(function(){
      if(data.id == ""){
        var stmt = db.prepare("INSERT INTO PRODUCT (PRODUCT_BARCODE_SKU, "+
        "CATEGORY_ID,PRODUCT_NAME,PRICE) VALUES ($sku,$cat,$name,$price)");
        var param = {$sku:data.sku,$cat:data.category_id,$name:data.name,
                     $price:data.price*100};
      }else{
        var stmt = db.prepare("UPDATE PRODUCT SET PRODUCT_BARCODE_SKU=$sku, "+
        "CATEGORY_ID=$cat,PRODUCT_NAME=$name,PRICE=$price WHERE PRODUCT_ID=$id");
        var param = {$sku:data.sku,$cat:data.category_id,$name:data.name,
                     $price:data.price*100,$id:data.id};
      }

      stmt.run(param,function(err){
        if(err){
          console.log(err);
          res.json({'data':'failure'});
        }else{
          res.json({'data':'successful'});
          console.log(this);
        }
      });
      stmt.finalize();
    });
  }else{
    res.redirect('login');
  }
});

router.post('/update_cat',function(req,res,next){
  var username = req.session.username;
  var priv = req.session.privledge;
  var data = req.body; //id, name,parent
  //console.log(data);
  if(username && (priv == "Admin" || priv == "Manager")){
    db.serialize(function(){
      if(data.id == ""){
        var stmt = db.prepare("INSERT INTO CATEGORY (PARENT_CATEGORY_ID, "+
        "CATEGORY_NAME) VALUES ($parent,$name)");
        var param = {$parent:data.parent,$name:data.name};
      }else{
        var stmt = db.prepare("UPDATE CATEGORY SET PARENT_CATEGORY_ID=$sku, "+
        "CATEGORY_NAME=$cat WHERE CATEGORY_ID=$id");
        var param = {$parent:data.parent,$name:data.name,$id:data.id};
      }
      stmt.run(param,function(err){
        if(err){
          console.log(err);
          res.json({'data':'failure'});
        }else{
          res.json({'data':'successful'});
          console.log(this);
        }
      });
      stmt.finalize();
    });
  }else{
    res.redirect('login');
  }
});

router.get('/getCategories/:option?/:format?', function(req, res, next) {
  var username = req.session.username;
  var priv = req.session.privledge;
  var rows = [];
  var option = req.params.option;
  var format = req.params.format;
  var query;
  if(username){ //&& (priv == "Admin" || priv == "Manager")
    if (option == 2){
      query = "SELECT * FROM CATEGORY WHERE PARENT_CATEGORY_ID=0 ORDER BY PARENT_CATEGORY_ID asc"
    }else if(option == 3){
      if(!isNaN(format)){
        query = "SELECT * FROM CATEGORY WHERE PARENT_CATEGORY_ID="+format+
          " ORDER BY PARENT_CATEGORY_ID asc"; // 
      }
    }else{
      query = "SELECT * FROM CATEGORY ORDER BY PARENT_CATEGORY_ID asc";
    }
    db.serialize(function(){
      db.each(query,function(err,row){
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
        if(format){
          tempCatNum = rows.length;
          res.render('partials/category_select',{rows:heirarchy});
        }else{
          if(option){
            res.render('partials/category_options',{rows:heirarchy});
          }else{
            res.render('partials/category',{rows:heirarchy});
          }
        }
      })
    });
  }else{
    res.redirect('login');
  }
});

router.get('/getUsers/:option?', function(req, res, next) {
  var username = req.session.username;
  var priv = req.session.privledge;
  var rows = [];
  var option = req.params.option;
  var query;
  if(username && (priv == "Admin" || priv == "Manager")){
    if(option){
      query = "SELECT * FROM JOB_TITLE ORDER BY JOB_TITLE_NAME DESC";
    }else{
      query = "SELECT EMPlOYEE_NUMBER,FNAME,LNAME,HOURLY_WAGE,SOCIAL_INSURANCE,"+
      "E.JOB_TITLE_ID,E.ADDRESS_ID,J.JOB_TITLE_NAME,STREET_NUMBER,STREET_NAME,"+
      "STREET_SUFFIX,SUITE_NUMBER,CITY,PROVINCE,POSTAL_CODE FROM EMPlOYEE E "+
      "JOIN JOB_TITLE J ON E.JOB_TITLE_ID=J.JOB_TITLE_ID JOIN ADDRESS A ON "+
      "E.ADDRESS_ID=A.ADDRESS_ID ORDER BY FNAME DESC;";
    }
    db.serialize(function(){
      db.each(query,function(err,row){
        var r = [];
        for(var i in row) {r.push(row[i]);}
        rows.push(r);
      },function(err){
        if(err){
          console.log(err)
        }else{
          console.log(this);
        }
        console.log(rows);
        if(option){
          res.render('partials/jobtitle',{rows:rows});
        }else{
          res.render('partials/userlist',{rows:rows});
        }
      })
    });
  }else{
    res.redirect('login');
  }
});

router.post('/delete/:table', function(req, res, next) {
  var username = req.session.username;
  var priv = req.session.privledge;
  var data = req.body;
  var option = req.params.table;
  if(username && (priv == "Admin" || priv == "Manager")){
    var pk = option + "_id";
    db.serialize(function(){
      var stmt = db.prepare("DELETE FROM "+option+" WHERE "+pk+" = $id");
      var param = {$id:data.id};
      stmt.run(param,function(err){
        if(err){
          console.log(err);
          res.json({'data':'failure'});
        }else{
          res.json({'data':'successful'});
          console.log(this);
        }
      });
      stmt.finalize();
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
