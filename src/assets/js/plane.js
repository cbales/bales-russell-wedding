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

  $(document).on("click", "#lookup-button", function() {
    var user = {
        firstName: document.getElementById("firstName").value, 
        lastName: document.getElementById("lastName").value
    };
      
    $.post("/lookupUser", user)
        .success(function(res) {
            //$(".invitee").show();
            var innerHtml = '<h2 style="color: inherit">Your invitation</h2>';
            res.party.forEach(guest => {
                innerHtml += '<h3 class="guestname" style="text-align: left; font-size: 1.2rem;">' + guest[0] + ' ' + guest[1] + '</h3>';
                innerHtml += ' <label style="margin-right: 20px"><input class="uk-radio" type="radio" name="rsvp-'+guest[0]+'"> I will be attending</label>  ';
                innerHtml += '<label><input class="uk-radio" type="radio" name="rsvp-'+guest[0]+'"> I will not be attending</label>';
                innerHtml += '<p class="diet-link" id="diet-link-'+guest[0]+'" style="text-align: left; cursor: pointer">+ Dietary restrictions</p>'
                innerHtml += '<input class="uk-input diet-input" id="diet-'+guest[0]+'" type="text" style="margin-top: 10px; display: none" placeholder="Dietary restrictions" />';
            });
            innerHtml += '<hr />';
            innerHtml += '<br/><input class="uk-input" type="text" placeholder="Favorite drink" />';
            innerHtml += '<br/><br/><input class="uk-input" type="text" placeholder="Favorite dance song" />';
            $('.invitees').html(innerHtml);
            $('.invitees').slideDown('400');
            $("#send").show();
        });
  });


  $(document).ready(function() {
      setTimeout(function() {
        $("#send").hide();
      }, 2000);
    
  });

  $(document).on("click", ".diet-link", function() {
    var linkName = this.id;
    var name = linkName.substring(10);
    var fieldName = "#diet-" + name;

    $(fieldName).show();
    $("#"+linkName).hide();
  });