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
  // var catSelection = [];
  //   $('.rounded-list').bind( "mousedown", function ( e ) {
  //     e.metaKey = true;
  //   }).selectable({
  //     filter: 'li div',
  //     selected: function(event,ui){
  //       //add search query to 
  //     },
  //     selecting: function (event, ui) {
  //       if ($(ui.selecting).parent().hasClass('level-1')) {
  //         //this is a level-1 item, so select all of it's children
  //         var ch = $(ui.selecting).parent().find('.level-2 .ui-selectee');
  //         $(ch).not(".ui-selected").addClass("ui-selecting");
  //       } else {
  //         //this is a level-2 item, so check to see if all of it's siblings are also selected
  //         var sibs = $(ui.selecting).parent().siblings().find('.ui-selectee');
  //         var notSelected = 0;
  //         for (var i = 0; i < sibs.length; i++) {
  //             if ($(sibs[i]).hasClass('ui-selected') || $(sibs[i]).hasClass('ui-selecting')) {
  //                 notSelected = notSelected;
  //             } else {
  //                 notSelected = notSelected + 1;
  //             }
  //         }
  //         if (notSelected === 0) { //all siblings are selected, so select their level-1 parent as well
  //             $(ui.selecting).parent().parent().parent().find('>:first-child').not(".ui-selected").addClass("ui-selecting");
  //         }
  //         //otherwise, just select as usual
  //       }
  //     },
  //     unselected: function (event, ui) {
  //       if ($(ui.unselected).parent().hasClass('level-1')) {
  //         //unselect all of it's children
  //         $(ui.unselected).parent().children().each(function () {
  //             $(this).find('.ui-selectee').removeClass('ui-selected').addClass('ui-unselected');
  //         });
  //       } else {
  //         //this is a level-2 item, so we need to deselect its level-1 parent
  //         $(ui.unselected).parents('li.level-1').find(">:first-child").removeClass('ui-selected');
  //       }
  //     }
  // });
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