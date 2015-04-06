$(document).ready(function () {
  $('#cat_form').validator().on('submit', function(e) {
    if(e.isDefaultPrevented())  {
      //alert("The form is not completed correctly");
    } else {
      e.preventDefault();
      $.ajax({
        type: 'POST',
        url: '/update_cat',
        data: {'id': $('#cat_id').val(),
               'name': $('#cat_detail').val(),
               'parent': $('#cat_parent').val()},
        success: function(res) {
          //console.log(res);
          if (res['data'] == 'successful') {
            alert("Add was successful, you may continue adding");
            $('#cat_id').val("");
            $('#cat_detail').val("");
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
            alert("Something terrible happened while saving");
          } 
        }
      });
    }
  });
  $(function(){
    $(".cat_row").click(function(e){
      e.preventDefault();
      $('#updateCategory')
          .prop('class', 'modal fade') // revert to default
          .addClass( $(this).data('direction') );
      $('#updateCategory').modal({
      keyboard: true,
      show:false
      }).on('shown.bs.modal',function(e){ 
        $('#btnDeleteCat').removeAttr('disabled','disabled');
        var row = $(e.relatedTarget).data();
        if(row){//on update, else its on insert
          $('#cat_detail').val(row['name']);
          $('#cat_parent').val(row['parent']);
          $('#cat_id').val(row['id']);
        };
      });
    });
  });
});