$(document).on("click", "#reception-map-button", function(){
    if ($("#reception-map").is(":visible") == false) {
        var parser = new UAParser();
        var result = parser.getResult();
        console.log(result);

        if (result.device.type == "mobile") {
            if (result.device.vendor == "Apple")
                window.open("maps://maps.google.com/maps?q=Roca%20Ridge&amp;ll=");
            else 
                window.open("https://maps.google.com/maps?q=Roca%20Ridge&amp;ll=");
        }
        else {
            $("#reception-map").show();
        }
    } else {
        $("#reception-map").hide();
    }
    
});

$(document).on("click", "#residence-inn-map-button", function(){
    if ($("#residence-inn-map").is(":visible") == false) {
        var parser = new UAParser();
        var result = parser.getResult();
        console.log(result);

        if (result.device.type == "mobile") {
            if (result.device.vendor == "Apple")
                window.open("maps://maps.google.com/maps?q=Residence%20Inn%20Lincoln%20South&amp;ll=");
            else 
                window.open("https://maps.google.com/maps?q=Residence%20Inn%20Lincoln%20South&amp;ll=");
        }
        else {
            $("#residence-inn-map").show();
        }
    } else {
        $("#residence-inn-map").hide();
    }
    
});

$(document).on("click", "#holiday-inn-map-button", function(){
    if ($("#holiday-inn-map").is(":visible") == false) {
        var parser = new UAParser();
        var result = parser.getResult();
        console.log(result);

        if (result.device.type == "mobile") {
            if (result.device.vendor == "Apple")
                window.open("maps://maps.google.com/maps?q=Holiday%20Inn%20Lincoln%20Southwest&amp;ll=");
            else 
                window.open("https://maps.google.com/maps?q=Holiday%20Inn%20Lincoln%20Southwest&amp;ll=");
        }
        else {
            $("#holiday-inn-map").show();
        }
    } else {
        $("#holiday-inn-map").hide();
    }
    
});