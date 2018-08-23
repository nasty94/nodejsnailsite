$(document).ready(function(){

  //get array of numbers from space seperated list of numbers
  //send info to server
  $("#Scheduler").submit(function(event){
    event.preventDefault() 
    var bodyInfo={};
    var myArray=[];

    for(var i = 0; i < $(this).children("input").length; i++){
      myArray = $(this).children("input")[i]["value"].trim().split(" ");
      
      bodyInfo[$(this).children("input")[i]["name"]] = myArray
    }
    $.post('/scheduler', bodyInfo, function(err, data){
 
      if (err){
        alert('An error occurred. Please try again...')        
      } else{
        return false;
      }
    })
    $("#postRes").text("Your schedule has been updated");
    $("input").val("")
  })
})

