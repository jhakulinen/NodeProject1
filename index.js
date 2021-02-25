const { Console } = require("console");
var express = require ("express");
var fs = require("fs");
var app = express();
var bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({extended: true}))
app.use(bodyParser.json())


app.get("/", function(req, res){
    res.sendFile(__dirname + "/public/index.html");
});

app.get("/guestbook", function(req, res){
    var json = require(__dirname + "/public/guestbook.json");

    var results = "<table border='1'>";

    for (var i=0; i<json.length; i++){
        results +=
        "<tr>"+
        "<td>" + json[i].username + "</td>" +
        "<td>" + json[i].country + "</td>" +
        "<td>" + json[i].date + "</td>" +
        "<td>" + json[i].message + "</td>" +
        "</tr>";
    }
    res.send(results);
});

app.get("/newmessage", function(req, res){
    res.sendFile(__dirname + "/public/newmessage.html");
});

app.post("/adduser", function(req, res){
    var data = require("./public/guestbook.json");

    data.push({
        "username": req.body.username,
        "country": req.body.country,
        "date": new Date(),
        "message": req.body.message
    });
    
    var jsonStr = JSON.stringify(data);

    fs.writeFile(__dirname + "/public/guestbook.json", jsonStr, (err)=> {
        if (err) throw err;
        console.log("Data saved!")
    });
    res.send("Data saved! Browse /guestbook to see the file.")
});
        
app.get("/ajaxmessage", function(req, res){
    res.sendFile(__dirname + "/public/ajaxmessage.html");
});

app.post("/ajaxmessage", function(req, res){
    var data = require("./public/guestbook.json");

    data.push({
        "username": req.body.username,
        "country": req.body.country,
        "date": new Date(),
        "message": req.body.message
    });
    console.log(data)
    console.log(req.body)
    
    var jsonStr = JSON.stringify(data);

    fs.writeFileSync(__dirname + "/public/guestbook.json", jsonStr);
        
        
    
    res.sendFile(__dirname + "/public/guestbook.json")
})

app.get("*", function(req,res){
    res.send("Can't find the requested page", 404)
});

app.listen(3000, function(){
    console.log("Server is running!")
})

