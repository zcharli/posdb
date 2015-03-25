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
  var catSelection = [];
  $(".selectable" ).selectable({
    filter: 'li div',
    selected: function(event,ui){
      // proj.push(ui.selected.id);
      // console.log(ui.selected.id);
      // $("#projection").val(proj);
    },
    unselected: function(event,ui) {
      
      // var idx = proj.indexOf(ui.unselected.id);
      // if(idx > -1){
      //   proj.splice(idx,1);
      // }
      // $("#projection").val(proj);
    }
  });
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
});