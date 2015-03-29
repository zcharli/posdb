$(function(){
  var ajaxPost = function(url,data,successcb,completecb,errorcb){
    $.ajax({
      type: "POST",
      url: url,
      data: data,
      dataType: "json",
      complete: completecb,
      success: successcb,
      error: errorcb
    });
  }
  var pnlCat = $('.pnlCat');
  var pnlProd = $('.pnlProd');
  var loadingSpinner = function(){  
    pnlCat.append('<div class="centerDiv" style="margin-top:150px;">&nbsp;&nbsp<i class="spin large"></i><br>Loading...</div>');
  }
  var loadingSpinner2 = function(){  
    pnlProd.append('<div class="centerDiv" style="margin-top:150px;">&nbsp;&nbsp<i class="spin large"></i><br>Loading...</div>');
  }
  loadingSpinner();
  loadingSpinner2();

  $.get("/getCategories",function(data){
      pnlCat.empty();
      pnlCat.append(data);
  });
  $.get("/getProducts",function(data){
      pnlProd.empty();
      pnlProd.append(data);
  });
  $.get("/getCategories/1",function(data){
      $("#cat_name").append(data);
  });
});