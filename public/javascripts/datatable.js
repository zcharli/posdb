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
          }
        });
    });


    $("#btnUpdate").click(function(){
      var error = 0;
      if($("#p_sku").val().length <= 0){

      }
      if($("#p_sku").val().length <= 0){

      }
    });

    $("#btnDelete").click(function(){
      
    });

  });
});
