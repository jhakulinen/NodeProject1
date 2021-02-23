src = "https://ajax.googleapis.com/ajax/libs/jquery/3.5.1/jquery.min.js"

var $name = $("#name")
var $country = $("#country")
var $message = $("#message")
var date = new Date();

$("#send").submit(function(){
    var sendingData = {
        username: $name.val(),
        country: $country.val(),
        date,
        message: $message.val()
    };
    $.ajax({
      type: 'POST',
      url: '/public/guestbook.json',
      data: sendingData,
      success: function(postData){
        $.ajax({
            url: '/public/guestbook.json',
            type: 'get',
            dataType: 'JSON',
            success: function(response){
                var length = response.length;
                for(var i=0; i<length; i++){
                    var uname = response[i].username;
                    var ctry = response[i].country
                    var msg = response[i].message

                    var tr_str = "<tr>" +
                        "<td align='center'>" + username + "</td>" +
                        "<td align='center'>" + country + "</td>" +
                        "<td align='center'>" + date + "</td>" +
                        "<td align='center'>" + message + "</td>" +
                        "</tr>"
                    $("#gbdata").append(tr_str);
                }
            }
        })
      }   
    })
})