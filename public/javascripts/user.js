$(document).ready(function () {
  var pnlUsers = $('.userList');
  var getUsers = function() {
    $.get("/getUsers",function(data){
      pnlUsers.empty();
      pnlUsers.append(data);
      addUserAccountHandler();
    });
  }

  $.fn.serializeObject = function()
  {//form serialization
    var o = {};
    var a = this.serializeArray();
    $.each(a, function() {
      if (o[this.name] !== undefined) {
        if (!o[this.name].push) {
            o[this.name] = [o[this.name]];
        }
        o[this.name].push(this.value || '');
      } else {
        o[this.name] = this.value || '';
      }
    });
    return o;
  };

  $.get("/getUsers/1",function(data){
    $("#job_title").empty();
    $("#job_title").append("<option></option>");
    $("#job_title").append(data);
  });

  $("#btnClear").click(function(){
    $("#user_id").val("");
    $("#address_id").val("");
    $("#job_id").val("");
  });

  var addUserAccountHandler = function() {
    $(".userProfile").click(function(e){
      var data = $(this).data();
      prepopulateFields(data);
    });
  }

  var prepopulateFields = function(data){
    $("#fname").val(data.fname);
    $("#lname").val(data.lname);
    $("#emp").val(data.id);
    $("#password").val();
    $("#job_title").val(data.jid);
    $("#wage").val(data.wage);
    $("#sin").val(data.sin);
    $("#postal").val(data.postal);
    $("#street_num").val(data.stnum);
    $("#street_name").val(data.stname);
    $("#suit_num").val(data.suite);
    $("#suffix").val(data.stsuff);
    $("#city").val(data.city);
    $("#prov").val(data.prov);
    $("#user_id").val(data.id);
    $("#address_id").val(data.addrid);
    $("#job_id").val(data.jid);
  }

  $('#u_form').validator().on('submit', function(e) {
    if(e.isDefaultPrevented())  {
      //alert("The form is not completed correctly");
    } else {
      e.preventDefault();
      ////console.log(JSON.stringify($('form').serializeObject()))
      $.ajax({
        type: 'POST',
        url: '/updateuser',
        data: JSON.stringify($('form').serializeObject()),
        dataType: "json",
        contentType: "application/json; charset=utf-8",
        success: function(res) {
          //console.log(res);
          if (res['data'] == 'successful') {
            getUsers();
            var message = "";
            if(res['change'] != 0 ){
              message = "Update successful";
            }
            if(res['id'] != 0){
              message = "Your new user's id is " +res['id'];
            }
            alert(message);
          }
          else {
            alert("Something terrible happened while saving");
          } 
        }
      });
      return false;
    }
  });

  getUsers();
});