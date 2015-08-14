var express = require('express');
var router = express.Router();
var sqlite3 = require('sqlite3').verbose();
var crypto = require('crypto')
var db = new sqlite3.Database('data/posdb');
var sha1sum = function(input){
  return crypto.createHash('sha1').update(input.toString()).digest('hex')
}
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

router.get('/getProducts/:option?/:page?/:bar?/:criteria?/:force?',function(req,res,next){
  var username = req.session.username;
  var priv = req.session.privledge;
  var option = req.params.option;
  var page = req.params.page;
  var bar = req.params.bar;
  var filter = req.params.criteria;
  var forceid = req.params.forceid;
  var start = 0;
  var end = 0;
  var rows = [];
  var query;
  if(username){ //&& (priv == "Admin" || priv == "Manager")
    db.serialize(function(){
      query = "SELECT PRODUCT_ID,PRODUCT_BARCODE_SKU, PRODUCT_NAME, CATEGORY_NAME, PRICE,"
      + " P.CATEGORY_ID FROM PRODUCT P JOIN CATEGORY C ON"
      + " P.CATEGORY_ID=C.CATEGORY_ID WHERE";
      var param = {};
      if(filter){
        param = {$filter:filter};
        if(!isNaN(filter)){
          //checking id's
          if(forceid){
            //checking exact id's
            query += " P.CATEGORY_ID=$filter AND";
                
          }else{
            //checking loose id's
            query +=" P.CATEGORY_ID=$filter"
                + " OR P.CATEGORY_ID IN (SELECT CATEGORY_ID FROM "
                +"CATEGORY WHERE PARENT_CATEGORY_ID=$filter) AND";
          }
        }else{
          //matching name query

          var sku = filter.match(/\d+/);
          if(sku){
            filter = sku[0];
            query += " PRODUCT_BARCODE_SKU LIKE ? AND";
                
          }else{
            filter = filter.split("-")[1];
            query += " PRODUCT_NAME LIKE ? AND";
          }
          var param = "%"+filter+"%"; 
        }
      }
      query +=" DATE_DISCONTINUED IS NULL ORDER BY PRODUCT_NAME ASC";  
      var stmt = db.prepare(query);
      stmt.each(param,function(err,row){
        if(err){
          //console.log(err);
          //res.json({'data':'failure'});
        }else{
          var r = [];
          var price = 0;
          for(var i in row) {
            if(price == 4) //price is the 5th column
              row[i] = row[i]/100;
            r.push(row[i]);
            ++price;
          }
          rows.push(r);
        }
      },function(err){
        if(err){
          //console.log(err)
        }else{
          //console.log(this)
        }
        if(option){
          var showBar = true;
          if(bar){
            showBar = false;
          }
          var pageEnd = 0;
          option -= Math.ceil(tempCatNum/6);
          var maxProd = option*6; //maximum products per page
          var totalRows = rows.length;
          var maxPage = Math.ceil(totalRows/maxProd);

          end = rows.length;
          start = start+page*maxProd;
          if(end - maxProd > 0){
            //console.log(maxProd)
            pageEnd = maxProd;
            rows = rows.splice(start,
                                maxProd+page*maxProd);
          }else{
            pageEnd = end;
            rows = rows.splice(start,end);
          }
          //console.log("setting max page:"+maxPage+ " from "+totalRows/maxProd)
          res.header("Cache-Control", "no-cache, no-store");
          res.header("Pragma", "no-cache");
          res.header("Expires", 0);
          res.render('partials/product_select', {rows:rows,
            pages:maxPage,shownext:page!=maxPage-1,showprev:start!=0,
            showbar:showBar});
        }else{
          res.render('partials/product_table',{rows:rows});
        }
      });
      stmt.finalize();
    });
  }else{
    res.redirect('login');
  }
});

router.get('/getSales/:num/:year/:month?/:day?',function(req,res,next){
  var username = req.session.username;
  var priv = req.session.privledge;
  var year = req.params.year;
  var num = req.params.num;
  var month = req.params.month;
  var day = req.params.day;
  var rows = [];
  var query;
  var params;
  if(username && priv == "Admin" || priv == "Manager" || priv == "Accountant"){
    db.serialize(function(){
      if(num==1){
        query = "SELECT SUM(TOTAL_SUM),SUM(TAX),SUM(ITEM_TOTAL) FROM SALE_TRANSACTION WHERE ";
      }else{
        query = "SELECT SALE_TRANSACTION_ID,FNAME,LNAME,TOTAL_SUM,TAX,ITEM_TOTAL,"
                + "DATETIME_SOLD FROM SALE_TRANSACTION S JOIN EMPLOYEE E ON "
                + "S.EMPlOYEE_NUMBER=E.EMPLOYEE_NUMBER WHERE ";
      }
      if(day && month && year){//if there is a day, eveverything else assumed to exist
        query += "strftime('%Y-%m-%d',DATETIME_SOLD)=?";
        params = year+"-"+month+"-"+day;
      }else if(month && year){//otherwise
        query += "strftime('%Y-%m',DATETIME_SOLD)=?";
        params = year+"-"+month;
      }else{
        query += "strftime('%Y',DATETIME_SOLD)=?";
        params = year;
      }
      query += "  ORDER BY DATETIME_SOLD ASC";
      var stmt = db.prepare(query);
      //console.log(params)
      stmt.each(params,function(err,row){
        if(err){
          //console.log(err);
          //res.json({'data':'failure'});
        }else{
          if(num==0){
            var r = [];
            var price = 0;
            for(var i in row) {
              if(price == 3 || price == 4) //sum and tax needed
                row[i] = row[i]/100;
              r.push(row[i]);
              ++price;
            }
            rows.push(r);
          }else{
            rows = {"sum":row["SUM(TOTAL_SUM)"]/100,"tax":row["SUM(TAX)"]/100,"quant":row["SUM(ITEM_TOTAL)"]};
          }
        }
      },function(err){
          if(err){
            //console.log(er)
          }else{
            //console.log(this)
          }
          if(num==0){
            res.render('partials/sales_table',{rows:rows});
          }else{
            //console.log(rows)
            res.send(rows);
          }
      });
      stmt.finalize();
    });
  }else{
    res.redirect('login');
  }
});

router.get('/getSalesDetails/:id',function(req,res,next){
  var username = req.session.username;
  var priv = req.session.privledge;
  var id = req.params.id;
  var rows = [];
  var query;
  if(username && priv == "Admin" || priv == "Manager" || priv == "Accountant"){
    db.serialize(function(){
      query = "SELECT PRODUCT_NAME,PRODUCT_BARCODE_SKU,CATEGORY_NAME,"
        + "FINAL_PRICE,QUANTITY_BOUGHT FROM SALE_DETAILS S JOIN PRODUCT P ON "
        + "S.PRODUCT_ID=P.PRODUCT_ID JOIN CATEGORY C ON C.CATEGORY_ID=P.CATEGORY_ID "
        + "WHERE SALE_TRANSACTION_ID=$id ORDER BY QUANTITY_BOUGHT DESC";
      var param = {$id:Number(id)};
      var stmt = db.prepare(query);
      //console.log(param)
      stmt.each(param,function(err,row){
        if(err){
          //console.log(err);
        }else{
          var r = [];
          var price = 0;
          for(var i in row) {
            if(price == 3) {//sum and tax needed
              row[i] = row[i]/100;
            }
            r.push(row[i]);
            ++price;
          }
          rows.push(r);
        }
      },function(err){
          if(err){
            //console.log(er)
          }else{
            //console.log(this)
            //console.log(rows)
          }
          res.render('partials/sale_details',{rows:rows});
      });
      stmt.finalize();
    });
  }else{
    res.redirect('login');
  }
});

router.post('/update',function(req,res,next){
  var username = req.session.username;
  var priv = req.session.privledge;
  var data = req.body; //id, name,price,category_id,sku
  ////console.log(data);
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
          //console.log(err);
          res.json({'data':'failure'});
        }else{
          res.json({'data':'successful'});
          //console.log(this);
        }
      });
      stmt.finalize();
    });
  }else{
    res.redirect('login');
  }
});

router.post('/updateuser',function(req,res,next){
  var username = req.session.username;
  var priv = req.session.privledge;
  var data = req.body;
  //console.log(data);
  if(username && (priv == "Admin" || priv == "Manager")){
    var lastAddrId = 0;
    db.serialize(function(){
     if(data.address_id == ""){
        var stmt = db.prepare("INSERT INTO ADDRESS (STREET_NUMBER,SUITE_NUMBER,"
          + "STREET_NAME,STREET_SUFFIX,CITY,PROVINCE,POSTAL_CODE) "
          + "VALUES ($street_num,$suit_num,$street_name,$suffix,$city,$prov,$postal)");
        var paramsAddr = {
          $postal:data.postal,$street_num:data.street_num,$street_name:data.street_name,
          $suit_num:data.suit_num,$suffix:data.suffix,$city:data.city,$prov:data.prov,};
      }else{
        var stmt = db.prepare("UPDATE ADDRESS SET STREET_NUMBER=$street_num, "
          + "SUITE_NUMBER=$suit_num,STREET_NAME=$street_name,STREET_SUFFIX=$suffix, "
          + "CITY=$city,PROVINCE=$prov,POSTAL_CODE=$postal WHERE ADDRESS_ID=$addrid");
        var paramsAddr = {
          $postal:data.postal,$street_num:data.street_num,$street_name:data.street_name,
          $suit_num:data.suit_num,$suffix:data.suffix,$city:data.city,$prov:data.prov,
          $addrid:data.addrid,};
      }
      //console.log(stmt)
      stmt.run(paramsAddr,function(err){
        if(err){
          //console.log(err + " in address insert");
          res.json({'data':'failure'});
        }else{
          //res.json({'data':'successful'});
          //console.log(this);
          lastAddrId = this.lastID;
        }
      },function(err){
        if(err){
          //console.log(err);
          res.json({'data':'failure'});
        }else{
          //res.json({'data':'successful'});
          //console.log(this);
          lastAddrId = this.lastID;
          if(data.user_id == ""){
            var stmt2 = db.prepare("INSERT INTO EMPLOYEE (PASSWORD,EMPlOYEE_NUMBER, "
              + "JOB_TITLE_ID,ADDRESS_ID,FNAME,LNAME,VACATION_DAYS_LEFT, "
              + "HOURLY_WAGE,SOCIAL_INSURANCE) VALUES ($password,$emp,$job_id, "
              + "$addrId,$fname,$lname,30,$wage,$sin)"); 
            var paramEmp = {$fname:data.fname,$lname:data.lname,$emp:data.emp,
              $password:sha1sum(data.password),$wage:data.wage,$sin:data.sin,
              $job_id:data.job_title,$addrId: lastAddrId};
          }else{
            var stmt2 = db.prepare("UPDATE EMPLOYEE SET PASSWORD=$password, "
              + "JOB_TITLE_ID=$job_id,FNAME=$fname,LNAME=$lname,HOURLY_WAGE=$wage, "
              + "SOCIAL_INSURANCE=$sin WHERE EMPlOYEE_NUMBER=$emp");
            var paramEmp = {
              $fname:data.fname,$lname:data.lname,$emp:data.user_id,$password:sha1sum(data.password),
              $wage:data.wage,$sin:data.sin,$job_id:data.job_title};
          }
          //console.log(stmt2)
          stmt2.run(paramEmp,function(err){
            if(err){
              //console.log(err + " in employee insert");
              res.json({'data':'failure'});
            }else{
              res.json({'data':'successful','id':this.lastID,'change':this.changes});
              //console.log(this);
            }
          });
          stmt2.finalize();
        }
      });
      stmt.finalize();
    });
  }else{
    res.redirect('login');
  }
});

router.post('/checkout',function(req,res,next){
  var username = req.session.username;
  var priv = req.session.privledge;
  var data = req.body;
  ////console.log(data);
  if(username){
    var subtotal = 0;
    var itemsSold = 0;
    var queryTransaction = [];
    for(var i=0;i<data.length;++i){
      subtotal += data[i].quantity * data[i].price;
      itemsSold += data[i].quantity;
    }
    db.serialize(function(){
      var lastTransId = 0;
      var query = "INSERT INTO SALE_TRANSACTION ("
        + "EMPlOYEE_NUMBER,ITEM_TOTAL,TAX,TOTAL_SUM) VALUES "
        + "($user_id,$total,$tax,$sum)";
      var params = {$user_id:req.session.user_id,$total:itemsSold,
        $tax:((subtotal*0.13).toFixed(2))*100,$sum:((subtotal*1.13).toFixed(2))*100};
      var stmt = db.prepare(query);
      stmt.run(params,function(err){
        //console.log("running transaction insert")
        if(err){
          //console.log(err)
          //console.log("sending failure transaction")

          res.json({'data':'failure'});
        }else{
          lastTransId = this.lastID;
        }
        //console.log(this);
      },function(err){
        if(err){
          //console.log(err)
          //console.log("sending failure after transaction")

          res.json({'data':'failure'});
        }
        lastTransId = this.lastID;
        //console.log(lastTransId)
        var query2 = "INSERT INTO SALE_DETAILS (SALE_TRANSACTION_ID,"
          + "PRODUCT_ID,DISCOUNTED,FINAL_PRICE,QUANTITY_BOUGHT) VALUES "
          + "($tranId,$pid,0,$price,$quant)";
        var stmt2 = db.prepare(query2);
        var queryCount = 0;
        for(var i = 0;i<data.length;++i){
          var params2 = {$tranId:lastTransId,$pid:data[i].id,$price:Number(data[i].price*100),
            $quant:data[i].quantity};
          stmt2.run(params2,function(err){
          //console.log("running sale detail insert")
            if(err){
              //console.log(err)
              //console.log("sending failure detail")
              res.json({'data':'failure'});
            }
            //console.log(this)
          },function(){
            //console.log("detail query finished")
            queryCount++;
            if(queryCount == data.length){
              //console.log("sending success at" + query)
              res.json({'data':'successful'});
            }
          });
        }
        stmt2.finalize();
        //console.log(this)
        ////console.log("sending success")
        //res.json({'data':'successful'});
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
  ////console.log(data);
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
          //console.log(err);
          res.json({'data':'failure'});
        }else{
          res.json({'data':'successful'});
          //console.log(this);
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
        if(format){
          //called when we dont want ordering
          for(var i=0;i<rows.length;++i){
            heirarchy[rows[i][0]] = [];
            heirarchy[rows[i][0]].push(rows[i]);
          }
        }else{
          //called when we want both parent and children in order
          for(var i=0;i<rows.length;++i){
            if(rows[i][1] == 0){
              heirarchy[rows[i][0]] = [];
              heirarchy[rows[i][0]].push(rows[i]);
            }else{
              heirarchy[rows[i][1]].push(rows[i]);
            }
          }
        }
        //console.log(heirarchy)
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
          //console.log(err)
        }else{
          //console.log(this);
        }
        ////console.log(rows);
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
          //console.log(err);
          res.json({'data':'failure'});
        }else{
          res.json({'data':'successful'});
          //console.log(this);
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
  if(!username || !pass){
    res.render('login', { error:"Login unsuccessful" });
  }else{
    var user_id = username.match(/\d+/);
    if(user_id){
      user_id = user_id[0];
    }else{
      res.render('login', { error:"Login unsuccessful" });
    }
    //console.log(user_id)
    db.serialize(function(){
      var stmt = db.prepare("SELECT FNAME,LNAME,"
        + "J.JOB_TITLE_NAME FROM EMPLOYEE E JOIN JOB_TITLE J ON "
        + "J.JOB_TITLE_ID=E.JOB_TITLE_ID WHERE EMPLOYEE_NUMBER=$id "
        + "AND PASSWORD=$password");
      var param = {$id:user_id, $password:sha1sum(pass)};
      //console.log(pass)
      stmt.each(param,function(err,row){
        if(err){
          //console.log(err);
          res.render('login', { error:"Login unsuccessful" });
        }else{
          //console.log(this);
          //console.log(row)
          if(row){
            req.session.username = row.fname+" "+row.lname;
            req.session.user_id = user_id;
            req.session.privledge = row.job_title_name;
            res.redirect("/");
            //console.log(this);
          }else{
            res.render('login', { error:"Login unsuccessful" });
          }
        }
      });
      stmt.finalize();
    });  
  } 
});

module.exports = router;
