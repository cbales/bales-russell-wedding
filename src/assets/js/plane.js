$(document).on("click", "#send", function(){
      setTimeout(function() {
          $('#plate').removeClass('front');
          $('#container').removeClass('beginning');
          $('.curvable').addClass('curved');
          setTimeout(function() {
              $('#container').addClass('hover');
              setTimeout(function() {
                  $('#container').addClass('fly_away_first');
                  setTimeout(function() {
                      $('#container').addClass('fly_away');
                      setTimeout(function(){
                          $('#plate').addClass('front');
                          $('#container').removeClass('fly_away fly_away_first hover').addClass('beginning');
                          $('.curvable').removeClass('curved');
                      },3000);
                  }, 600);
              }, 1200);
          }, 1500);
      }, 800);

    // Send the form
    var user = {
        firstName: document.getElementById("firstName").value, 
        lastName: document.getElementById("lastName").value, 
        mealOption: document.getElementById("mealOption").value, 
        dietaryRestrictions: document.getElementById("dietaryRestrictions").value
    };

    $.post("/sendRsvp", user)
        .success(function(res) {
        UIkit.notification("RSVP sent!", "primary");
        //Clear the form
        document.getElementById("firstName").value = '';
        document.getElementById("lastName").value = '';
        document.getElementById("dietaryRestrictions").value = '';
        document.getElementById("mealOption").selectedIndex = 0;
    });
  });
