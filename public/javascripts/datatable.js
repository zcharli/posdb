$(document).ready(function() {
    $('#tblProducts').dataTable();

  $(function(){
    $('.addProductBtn').click(function() {

      $('.modal')
          .prop('class', 'modal fade') // revert to default
          .addClass( $(this).data('direction') );
          $('#updateModal').modal({
        keyboard: true,
        show:false
        }).on('shown.bs.modal',function(e){ 
          var row = $(e.relatedTarget).data(); 
          if(row){//on update, else its on insert
            //$('select[name=cat_name]').val(2); // update the select
          }
        });
    });
    $('.addProductCat').click(function() {

      $('.modal')
          .prop('class', 'modal fade') // revert to default
          .addClass( $(this).data('direction') );
          $('#updateModal').modal({
        keyboard: true,
        show:false
        }).on('shown.bs.modal',function(e){ 
          
          var row = $(e.relatedTarget).data(); 
          if(row){//on update, else its on insert
            //$('select[name=cat_name]').val(2); // update the select
            //$('.selectpicker').selectpicker('refresh');
          }
        });
    });
  var validateEmpty = function(control){

  }

  $('#p_form').validator().on('submit', function(e) {
    if(e.isDefaultPrevented())  {
      alert("The form is not completed correctly");
    } else {
      e.preventDefault();
      
      $.ajax({
        type: 'POST',
        url: '/update',
        data: {'id': $('#product_id').val(),
               'name': $('#p_name').val(),
               'price': $('#p_price').val(),
               'category_id': $('#cat_name').val(),
               'sku': $('#p_sku').val()},
          success: function(res) {
            console.log(res);
            if (res['data'] == 'successful') {
                // window.location=('thanks.php');
                $('#product_id').val("");
                $('#p_name').val("");
                $('#p_sku').val("");
                $('#product_id').val("");
            }
            else {
                alert("Something terrible happened while sabing");
                // window.location=('thanks.php');
            } 
          },  
      });
      
    }
  });
  // $("#btnUpdate").click(function(e){
  //   // e.stopPropagation();
  //   // e.preventDefault();
  //   var val = $('#cat_name').val();
  //   if(val == 0){
  //     alert("Don't forget to select a valid category");
  //   }
  //   $('#p_form').submit(function(e){
  //     e.stopPropagation();
  //   });
  // });

  $("#btnDelete").click(function(){
  });

  });
});
