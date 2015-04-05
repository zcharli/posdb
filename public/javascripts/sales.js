$(document).ready(function() {
  var dateToday = new Date();
  var currDate = dateToday.getDate();
  var currMonth = dateToday.getMonth() + 1;
  var currYear = dateToday.getFullYear();
  var dateStr = currYear + "-" + currMonth + "-" + currDate;
  var dp = $("#datepicker");
  dp.datepicker({
    "endDate":dateToday,
    "dateFormat": "YY-MM-DD",
    "defaultDate": dateStr
  });

  var addSalesHandler = function() {
    $(".sale_row").click(function(e){
      var transID = $(this).data().transid;
      alert(transID)
      $.get("/getSalesDetails/+transID",function(data){
        populateDetails(data)
      });
    });
  }

  var populateDetails = function(data) {
    console.log(data)
  }

  var saleTable = $(".sales_table_div");
  $(dp).datepicker().on('changeDate', function(e){
      selectedDate = dp.data('datepicker').getFormattedDate('yyyy-mm-dd');
      var split = selectedDate.split("-");
      currYear = split[0];
      currMonth = split[1];
      currDate = split[2];
      console.log(currMonth)
      getSales(currYear,currMonth,currDate);
  });

  $(dp).datepicker().on('changeMonth', function(e){ 
      currMonth = new Date(e.date).getMonth() + 1;
      console.log("month")
      getSales(currYear,currMonth);
  });

  $(dp).datepicker().on('changeYear', function(e){
      currYear = String(e.date).split(" ")[3];
      console.log("year")
      getSales(currYear);
  });

  var getFormattedDateSQL = function(date) {
    var year = date.getFullYear();
    var month = (1 + date.getMonth()).toString();
    month = month.length > 1 ? month : '0' + month;
    var day = date.getDate().toString();
    day = day.length > 1 ? day : '0' + day;
    return year + '/' + month + '/' + day;
  }

  var getSales = function(year,month,day){
    var q = "/getSales";
    if(!year){
      q += "/"+getFormattedDateSQL(dateToday);
    }else{
      q += "/"+currYear;
      if(month) {
        month = month.length > 1 ? month : '0' + month;
        q+="/"+month;
      }
      if(day) {q+="/"+day;}
    }
    console.log(q)
    $.get(q,function(data){
      saleTable.empty();
      saleTable.append(data);
      addSalesHandler();
    });
  }

  getSales();
});
