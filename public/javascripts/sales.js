$(document).ready(function() {
  var dateToday = new Date();
  var currDate = dateToday.getDate();
  var currMonth = dateToday.getMonth() + 1;
  var currYear = dateToday.getFullYear();
  var dateStr = currYear + "-" + currMonth + "-" + currDate;
  var dp = $("#datepicker");
  var m = new Array();
  m[0] = "January";
  m[1] = "February";
  m[2] = "March";
  m[3] = "April";
  m[4] = "May";
  m[5] = "June";
  m[6] = "July";
  m[7] = "August";
  m[8] = "September";
  m[9] = "October";
  m[10] = "November";
  m[11] = "December";
  dp.datepicker({
    "endDate":dateToday,
    "dateFormat": "YY-MM-DD",
    "defaultDate": dateStr
  });

  var addSalesHandler = function() {
    $(".sale_row").click(function(e){
      var transID = $(this).data().transid;
      //alert(transID)
      $.get("/getSalesDetails/"+transID,function(data){
        populateDetails(data)
      });
    });
  }

  var populateDetails = function(data) {
    //console.log(data)
    $(".pnlSaleDetails").empty();
    $(".pnlSaleDetails").append(data);
  }

  var saleTable = $(".sales_table_div");
  $(dp).datepicker().on('changeDate', function(e){
      selectedDate = dp.data('datepicker').getFormattedDate('yyyy-mm-dd');
      var split = selectedDate.split("-");
      currYear = split[0];
      currMonth = split[1];
      currDate = split[2];
      //console.log(currMonth)
      getSales(0,currYear,currMonth,currDate);
      getSales(1,currYear,currMonth,currDate);
      changeNotifier(currYear,currMonth,currDate)
  });

  $(dp).datepicker().on('changeMonth', function(e){ 
      currMonth = new Date(e.date).getMonth() + 1;
      //console.log("month")
      getSales(0,currYear,currMonth);
      getSales(1,currYear,currMonth);
      changeNotifier(currYear,currMonth)
  });

  $(dp).datepicker().on('changeYear', function(e){
      currYear = String(e.date).split(" ")[3];
      //console.log("year")
      getSales(0,currYear);
      getSales(1,currYear);
      changeNotifier(currYear)
  });

  var changeNotifier = function(year,month,day){
    var str = year;
    if(month){
      str += ", "+m[month-1];
    }
    if(day){
      str += ", "+day;
    }
    $("#resultDate").text("For the period of "+str);
  }

  var getFormattedDateSQL = function(date) {
    var year = date.getFullYear();
    var month = (1 + date.getMonth()).toString();
    month = month.length > 1 ? month : '0' + month;
    var day = date.getDate().toString();
    day = day.length > 1 ? day : '0' + day;
    return year + '/' + month + '/' + day;
  }

  var getSales = function(amt,year,month,day){
    var q = "/getSales/"+amt;
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
    $.get(q,function(data){
      if(amt == 0){
        saleTable.empty();
        saleTable.append(data);
        addSalesHandler();
      }else{
        //console.log(data)
        $("#s_today").text("$"+data.sum);
        $("#s_month").text("$"+data.tax);
        if(!data.quant){
          data.quant = 0;
        }
        $("#s_sold").text(data.quant);

      }
    });
  }

  getSales(0);
  getSales(1);
  changeNotifier(currYear,currMonth,currDate);
});
