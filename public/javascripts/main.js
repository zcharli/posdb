$(function(){
  var catPane = $(".categoryResult");
  var prodPane = $(".productResult");
  var vWidth = $(window).width();
  var vHeight = $(window).height();
  //custom appender 
  String.prototype.compose = (function (){
    var re = /\{{(.+?)\}}/g;
    return function (o){
            return this.replace(re, function (_, k){
                return typeof o[k] != 'undefined' ? o[k] : '';
            });
        }
  }());
  // Array Remove - By John Resig (MIT Licensed)
  Array.prototype.remove = function(from, to) {
    var rest = this.slice((to || from) + 1 || this.length);
    this.length = from < 0 ? this.length + from : from;
    return this.push.apply(this, rest);
  };
  var tblCart = $("#tblCart").children('tbody');
  var table = tblCart.length ? tblCart : $('#tblCart');
  //appender template
  var item = '<tr id="row_{{id}}">'+
             '<td>{{sku}}</td>'+
             '<td>{{name}}</td>'+
             '<td class="col-xs-3"><input type="number"'+ 
             'class="form-control" min="0" id="prod_{{id}}"/></td>'+
             '<td>{{price}}</td>'+
             '</tr>';
  var getCategoryPane = function() {
    $.get("/getCategories/2/all",function(data){
      catPane.empty();
      catPane.append(data);
    });
  }
  var cart = [];
  // var checkQuantity = function(c) {
  //   var count = 0;
  //   for(var i = 0;i<cart.length;++i){
  //     if(cart[i]['id'] == c['id']){
  //       cart[i]['quantity'] += 1;
  //       count = cart[i]['quantity'];
  //       break;
  //     }
  //   }
  //   if(!c.hasOwnProperty('quantity')){
  //     c['quantity'] = 1;
  //     count = 1;
  //   }
  //   if(c['quantity'] == 1){
  //     count = 1;
  //   }
  //   return count;
  // }

  // var updateQuantity = function(id,val){
  //   for(var i = 0;i<cart.length;++i){
  //     if(cart[i]['id'] == id){
  //       cart[i]['quantity'] = val;
  //       break;
  //     }
  //   }
  //   $("#prod_"+id).val(val);
  // }

  var checkQuantity = function(c) {
    var count = 0;
    for(var i = 0;i<cart.length;++i){
      if(cart[i]['id'] == c['id']){
        count = cart[i]['quantity'];
        break;
      }
    }
    if(!c.hasOwnProperty('quantity')){
      c['quantity'] = 0;
    }
    return count;
  }

  var updateQuantity = function(id,val){
    var q = 1;
    for(var i = 0;i<cart.length;++i){
      if(cart[i]['id'] == id){
        cart[i]['quantity'] += 1;
        q = cart[i]['quantity'];
        console.log("q " + q)
        break;
      }
    }
    $("#prod_"+id).val(q);
  }

  var setQuantity = function(id,val){
    for(var i = 0;i<cart.length;++i){
      if(cart[i]['id'] == id){
        cart[i]['quantity'] = val;
        break;
      }
    }
    $("#prod_"+id).val(val);
  }

  var addToCart = function(c){
    var quantity = checkQuantity(c);
    console.log(quantity)
    if(quantity == 0){
      table.append(item.compose({
        'sku':c['sku'],
        'name':c['name'],
        'id': c['id'],
        'price':c['price']
      }));
      $("#prod_"+c['id']).bind('keyup mouseup', function(e){
        var val = $("#prod_"+c['id']).val();
        if(val != 0){
          setQuantity(c['id'],Number(val));
        }else{
          clearCart(c['id'])
          $('#row_'+c['id']).remove();
        }
        updatePrice();
      });
      cart.push(c);
      updateQuantity(c['id'],quantity)
    }else{
      updateQuantity(c['id'],quantity)
    }
    updatePrice();
  }

  var clearCart = function(id) {
    if(id){
      for(var i = 0;i<cart.length;++i){
        if(cart[i]['id'] == id){
          cart.remove(i);
          break;
        }
      }
    }else{
      // remove everything
    }
  }

  var updatePrice = function(){
    var subtotal = 0;
    var tax = 0;
    var items = 0;

    for(var i = 0;i<cart.length;++i){
      //console.log(cart[i]['price'] +" with "+cart[i]['quantity'])
      subtotal += cart[i]['price']*cart[i]['quantity'];
      items += cart[i]['quantity'];
        
    }
    tax = subtotal*0.13;
    subtotal += tax;
    $('#subtotal').text("$"+subtotal.toFixed(2));
    $('#tax').text("$"+tax.toFixed(2));
    $('#items').text(items);
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