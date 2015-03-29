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
    //$('select[name=cat_name]').selectpicker(function(){});

    $("#btnUpdate").click(function(e){
      e.stopPropagation();
      var val = $('#cat_name').val();
      if(val == 0){
        alert("Don't forget to select a valid category");
      }
    });

    $("#btnDelete").click(function(){
    });

  });
});
