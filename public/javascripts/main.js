$(function(){
  var catPane = $(".categoryResult");
  var prodPane = $(".productResult");
  var vWidth = $(window).width();
  var vHeight = $(window).height();
  var getCategoryPane = function() {
    $.get("/getCategories/2/all",function(data){
      catPane.empty();
      catPane.append(data);
      console.log($('numCat').val());
    });
  }

  var cart = [];
  var checkQuantity = function(id) {
    var count = 0;
    
    for(var i = 0;i<cart.length;++i){
      if(cart[i]['id'] == id){
        count++;
      }
    }
    return count;
  }
  var tblCart = $("#tbLCart");
  var addToCart = function(c){
    var quantity = checkQuantity(c['id']) + 1;
    console.log(quantity)
    if(quantity == 1){
      console.log("<tr><td>"+c['sku']+"</td>" +
               "<td>"+c['name']+"</td>" +
               "<td id="+c['id']+">"+quantity+"</td>" +
               "<td>"+c['price']+"</td></tr>")
      tblCart.append("<tr><td>"+c['sku']+"</td>" +
               "<td>"+c['name']+"</td>" +
               "<td id="+c['id']+">"+quantity+"</td>" +
               "<td>"+c['price']+"</td></tr>");
    }else{
      $(c['id']).val(quantity);
    }
    cart.push(c);
  }

  var getProductPane = function() {
    $.get("/getProducts/"+numBtn,function(data){
      prodPane.empty();
      prodPane.append(data);
      $('.product').click(function(e){
        e.preventDefault();
        var el = $(this).data();
        addToCart(el);
      });
    });
  }
  var numBtn = Math.floor((vHeight - 120)/75);
  getCategoryPane();
  getProductPane();
});