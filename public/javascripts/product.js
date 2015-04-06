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
  $.get("/getCategories/2",function(data){
      $("#cat_parent").append(data);
  });
  
  $("body").on('click',"#btnDeleteCat",function(e){
    e.preventDefault();
    var r = confirm("Are you sure you want to delete this category?");
    if (r == true) {
      $.ajax({
        type: 'POST',
        url: '/delete/category',
        data: {'id': $('#cat_id').val()},
        success: function(res) {
          $('#updateCategory').modal('toggle');
          if (res['data'] == 'successful') {

            $.get("/getCategories",function(data){
              $('.pnlCat').empty();
              $('.pnlCat').append(data);
            });
            $.get("/getCategories/1",function(data){
              $("#cat_name").empty();
              $("#cat_name").append("<option></option>")
              $("#cat_name").append(data);
            });
          }
          else {
            alert("Something terrible happened while deleting");
          } 
        }
      });
    }
    return false;
  });
  $("#btnDeleteProd").click(function(){
    var r = confirm("Are you sure you want to delete this product?");
    if (r == true) {
      $.ajax({
        type: 'POST',
        url: '/delete/product',
        data: {'id': $('#prod_id').val()},
        success: function(res) {
          //console.log(res);
          if (res['data'] == 'successful') {
            $.get("/getProducts",function(data){
              $('#updateModal').modal('toggle');
              $('.pnlProd').empty();
              $('.pnlProd').append(data);
            });
          }
          else {
            alert("Something terrible happened while deleting");
          } 
        }
      });
    }
  });
  $(function(){
    $('#updateModal')
        .prop('class', 'modal fade') // revert to default
        .addClass( $(this).data('direction') );
        $('#updateModal').modal({
      keyboard: true,
      show:false
      }).on('shown.bs.modal',function(e){ 
        var row = $(e.relatedTarget).data();
        $('#btnDeleteProd').attr('disabled','disabled');
        //console.log(row)
        if(row){//on update, else its on insert
          ////console.log(row)
          if(row['id']){
            $('#btnDeleteProd').removeAttr('disabled','disabled');
          }
          $('#prod_id').val(row['id']);
          $('#p_name').val(row['name']);
          $('#p_price').val(row['price']);
          $('#cat_name').val(row['catid']);
          $('#p_sku').val(row['sku'])
      };
    });
    $('.addProductCat').click(function() {
      if(!$('cat_id').val()){
        $('#btnDeleteCat').attr('disabled','disabled');
      }
      $('#updateCategory')
          .prop('class', 'modal fade') // revert to default
          .addClass( $(this).data('direction') );
          $('#updateModal').modal({
        keyboard: true,
        show:false
        }).on('shown.bs.modal',function(e){ 
        });
    });

    $('#p_form').validator().on('submit', function(e) {
      if(e.isDefaultPrevented())  {
        // alert("The form is not completed correctly");
      } else {
        e.preventDefault();
        $.ajax({
          type: 'POST',
          url: '/update',
          data: {'id': $('#prod_id').val(),
                 'name': $('#p_name').val(),
                 'price': $('#p_price').val(),
                 'category_id': $('#cat_name').val(),
                 'sku': $('#p_sku').val()},
          success: function(res) {
            //console.log(res);
            if (res['data'] == 'successful') {
              // window.location=('thanks.php');
              alert("Add was successful, you may continue.");
              $('#prod_id').val("");
              $('#p_name').val("");
              $('#p_sku').val("");
              $('#prod_id').val("");
              $.get("/getProducts",function(data){
                $('.pnlProd').empty();
                $('.pnlProd').append(data);
              });
            }
            else {
              alert("Something terrible happened while saving");
            } 
          }
        });      
      }
    });
  });
});