$(function(){
  // disable scrolling
  $('html, body').css({
    'overflow': 'hidden',
    'height': '100%'
  });

  //set nav bar active
  $('.nav li').click(function(){
    //console.log("yes");
    $('.nav li').removeClass('active');
    $(this).addClass('active');
  });
  $(".goHome").click(function(){
    getMainLayout();
  });

  var ajaxPost = function(url,successcb,completecb,errorcb){
    $.ajax({
      type: "POST",
      dataType: "json",
      complete: completecb,
      success: successcb,
      error: errorcb
    });
  }

  var mainContainer = $('.mainContainer');
  var loadingSpinner = function(){  
    //mainContainer.addClass("radialBackground");
    mainContainer.append('<div class="span centered"><div class="square"></div>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Loading...</div>');
  }
  loadingSpinner(); //first load

  var getMainLayout = function() {
    $.get("/main",function(data){
      mainContainer.empty();
      mainContainer.append(data);
    });
  }
  getMainLayout();


});