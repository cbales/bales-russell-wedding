$(document).on("click", "#reception-map-button", function(){
    if ($("#reception-map").is(":visible") == false) {
        var parser = new UAParser();
        var result = parser.getResult();
        console.log(result);

        if (result.device.type == "mobile") {
            if (result.device.vendor == "Apple")
                window.open("maps://maps.google.com/maps?q=Chez%20Hay&amp;ll=");
            else 
                window.open("https://maps.google.com/maps?q=Chez%20Hay&amp;ll=");
        }
        else {
            $("#reception-map").show();
        }
    } else {
        $("#reception-map").hide();
    }
    
});