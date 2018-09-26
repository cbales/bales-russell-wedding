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
    var users = [];
    $('.invitation-guest').each(function() {
        var name = $($(this).children(".firstname")[0]).val();
        var user = {
            firstName: name,
            lastName: $($(this).children(".lastname")[0]).val(),
            dietaryRestrictions: $($(this).children(".diet-input")[0]).val(),
            rsvp: $("input[name='rsvp-"+name+"']:checked").val(),
            songRequest: $("#song-request").val()
        }
        users.push(user);
    });

    $.ajax({
        method:"POST",
        url:"/sendRsvp",
        data: JSON.stringify(users),
        contentType: "application/json",
        success:function(res) {
            UIkit.notification("RSVP sent!", "primary");
            //Clear the form
            $(".invitees").html("");
            $("#send").hide();
        }
    });
  });

  $(document).on("click", "#lookup-button", function() {
      $("#lookup-button").hide();
      $("#lookup-searching").show();
    var user = {
        firstName: document.getElementById("firstName").value, 
        lastName: document.getElementById("lastName").value
    };
      
    $.post("/lookupUser", user)
        .success(function(res) {
            console.log(res.rsvpData);
            var innerHtml = '<h2 style="color: inherit">Your invitation</h2>';
            if (res.rsvpData.length > 0) {
                innerHtml += "<p>You have already RSVP'd. Thanks!</p>";
                innerHtml += "<p>If you need to change your RSVP, please send us an <a href='mailto:c.bales@outlook.com'>email</a>.</p>";
            }
            //$(".invitee").show();
            
            res.party.forEach(guest => {
                innerHtml += '<div class="invitation-guest"><input type="text" hidden class="firstname" value='+guest[0]+'>';
                innerHtml += '<input type="text" hidden class="lastname" value='+guest[1]+'>';
                innerHtml += '<h3 class="guestname" style="text-align: left; font-size: 1.2rem;">' + guest[0] + ' ' + guest[1] + '</h3>';
                innerHtml += ' <label style="margin-right: 20px"><input class="uk-radio" type="radio" name="rsvp-'+guest[0]+'" id="rsvp-yes-'+guest[0]+'" value="yes"> I will be attending</label>  ';
                innerHtml += '<label><input class="uk-radio" type="radio" name="rsvp-'+guest[0]+'" id="rsvp-no-'+guest[0]+'" value="no"> I will not be attending</label>';
                innerHtml += '<p class="diet-link" id="diet-link-'+guest[0]+'" style="text-align: left; cursor: pointer">+ Dietary restrictions</p>'
                innerHtml += '<input class="uk-input diet-input" id="diet-'+guest[0]+'" type="text" style="margin-top: 10px; display: none" placeholder="Dietary restrictions" />';
                innerHtml += '</div>';
            });
            innerHtml += '<hr />';
            innerHtml += '<br/><br/><input class="uk-input" id="song-request" type="text" placeholder="Favorite dance song" />';
            $('.invitees').html(innerHtml);
            $("#lookup-searching").hide();
            $('#lookup-button').show();
            $('.invitees').slideDown('400');
            $("#send").show();

            if (res.rsvpData.length > 0) {
                var form = document.getElementById("rsvp-form");
                var elements = form.elements;
                for (var i = 0, len = elements.length; i < len; ++i) {
                    elements[i].readOnly = true;
                }
                document.getElementById("firstName").readOnly = false;
                document.getElementById("lastName").readOnly = false;
                $("#rsvp-form input[type=radio]").attr('disabled', true);
                $("#send").hide();

                res.rsvpData.forEach(guest => {
                    if (guest[2] == "yes") {
                        $("#rsvp-yes-"+guest[0]).prop("checked", true);
                    } else if (guest[2] == "no") {
                        $("#rsvp-no-"+guest[0]).prop("checked", true);
                    }
                });
                if (res.rsvpData[0][4]) {
                    $("#song-request").val(res.rsvpData[0][4]);
                }
            }
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