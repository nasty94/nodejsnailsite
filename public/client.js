$(document).ready(function(){
  
  function getDayOfWeek(date) {
  var dayOfWeek = new Date(date).getDay();    
  return isNaN(dayOfWeek) ? null : ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'][dayOfWeek];
  }
  // Instantiate the Bootstrap carousel
  $('.multi-item-carousel').carousel({
    interval: false
  });

  var disabled=false;
                        
  //Reveal form fields on button clicks
  $("#appt0").click(function(){
    $("#insert0").show();
  });
  
  $("#appt1").click(function(){
    $("#insert1").show();
  });
  
  //update time dropdown menu and get schedule info from server when date field changes
  //enable time dropdown menu upon date selection
  $('#input1').change(function(){
    $("#input2").text('') //refresh menu 
    $.get('/updatedSchedule')
       .done(function(data){
         for (var i of data[getDayOfWeek($("#input1").val())]){
           if (i === ""){
              $("#input2").append(`<option disabled>No times available. Please choose another date</option>`) 
           }else{
              $("#input2").append(`<option value=${i}:00>${i}:00</option>`) 
           }
         }
     }).fail(function(err){
       alert('Form did not update properly. Please reload page. If the problem persists check internet connection...');
    })
    $("#input2").prop( "disabled", false );
  });
  
   
   $("#appt2").click(function(){
     $("#insert2").show();
  });
  
   $("#appt3").click(function(){
    $("#insert3").show();
  });

  //Validate form and submit
  $("form").submit(function(event){
    event.preventDefault();
    var body = {name: $("#input0").val(),
                date: $("#input1").val(),
                time: $("#input2").val(),
                email: $("#input3").val()
               }
    $.post("/appointment", body, function(err, data){
      if (err){
        alert('Error In Submission. Please try Again')
        throw err;
      } else{
        return false;
      }
    })
    
    //send response message and clear input fields
    $("#apptResponse").text("Thank you! You'll receive a confirmation email soon...")
    $("input").val("")
  })
  
});