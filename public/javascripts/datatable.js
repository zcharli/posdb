$(document).ready(function() {
    $('#tblProducts').dataTable();

  $(function(){
    $('#updateModal').modal({
        keyboard: true,
        show:false
    }).on('shown.bs.modal',function(e){ 
      var row = $(e.relatedTarget).data(); 
      if(row){//on update, else its on insert
        $('#song_name').val(row['song']);
      }
    });
  });
});
