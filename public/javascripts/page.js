$(function(){
  // disable scrolling
  $('html, body').css({
    'overflow': 'hidden',
    'height': '100%'
  });

  var mainContainer = $('.container-fluid');

  mainContainer.append('<div class="span centered"><div class="square"></div></div>');

});