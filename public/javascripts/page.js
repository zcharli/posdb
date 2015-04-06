$(function(){
  // disable scrolling
  $('html, body').css({
    'overflow': 'hidden',
    'height': '100%'
  });
  //set nav bar active
  $('.nav li').click(function(){
    ////console.log("yes");
    $('.nav li').removeClass('active');
    $(this).addClass('active');
  });
  $(".goHome").click(function(){
    getMainLayout();
  });
  $(".goProduct").click(function(){
    getProductLayout();
  });
  $(".goUsers").click(function(){
    getUsersLayout();
  });
  $(".goSales").click(function(){
    getSalesLayout();
  });

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

  var mainContainer = $('.mainContainer');
  var loadingSpinner = function(){  
    mainContainer.append('<div class="centered">&nbsp;&nbsp<i class="spin extra-large"></i><br>Loading...</div>');
  }

  var getProductLayout = function() {
    mainContainer.empty();
    loadingSpinner();
    $.get("/goproduct",function(data){
      mainContainer.empty();
      mainContainer.append(data);
    });
  }

  var getSalesLayout = function() {
    mainContainer.empty();
    loadingSpinner();
    $.get("/gosales",function(data){
      mainContainer.empty();
      mainContainer.append(data);
    });
  }

  var getUsersLayout = function() {
    mainContainer.empty();
    loadingSpinner();
    $.get("/gousers",function(data){
      mainContainer.empty();
      mainContainer.append(data);
    });
  }

  var getMainLayout = function() {
    mainContainer.empty();
    loadingSpinner();
    $.get("/main",function(data){
      mainContainer.empty();
      mainContainer.append(data);
    });
  }
  loadingSpinner();
  getMainLayout();
  //getSalesLayout();
  //getUsersLayout();
  //getProductLayout();

});
