const { Console } = require("console");
var express = require("express");
var fs = require("fs");
var app = express();
var bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json())
const PORT = process.env.PORT || 3000;

// Luodaan reitti "etusivulle". //
app.get("/", function (req, res) {
    res.sendFile(__dirname + "/public/index.html");
});

// Luodaan reitti, joka hakee JSON-tiedoston ja parsii sen taulukkoon. //
// Tein tämän kohdan alusta asti hieman väärin, joten visuaalinen muokkaaminen Bootstrapin avulla jäi pois, koska en tajunnut tehdä html-sivua, johon taulukko tulostuu. //
app.get("/guestbook", function (req, res) {
    var json = require(__dirname + "/public/guestbook.json");

    var results = "<table border='1'>";

    for (var i = 0; i < json.length; i++) {
        results +=
            "<tr>" +
            "<td>" + json[i].username + "</td>" +
            "<td>" + json[i].country + "</td>" +
            "<td>" + json[i].date + "</td>" +
            "<td>" + json[i].message + "</td>" +
            "</tr>";
    }
    res.send(results);
});
// Luodaa neitti "/newmessage" sivulle, jossa voi lähettää uuden viestin vieraskirjaan. // 
app.get("/newmessage", function (req, res) {
    res.sendFile(__dirname + "/public/newmessage.html");
});
// Tämä reitti hoitaa "/newmessage" sivun datan lähettämisen JSON-muodossa serverille, jossa se tallennetaan JSON-muotoon. // 
app.post("/adduser", function (req, res) {
    var data = require("./public/guestbook.json");
    // Tehdään if/else -lause, joka tarkistaa onko tyhjiä kenttiä. Jos yksikin kentistä on tyhjä, niin sivu latautuu uudelleen. //
    if (req.body.username == "" || req.body.country == "" || req.body.message == "") {
        res.redirect("/newmessage")
    } else {
        // Lähetetään lomakkeed tiedot JSON-muodossa serverille ja tallennetaan ne guestbook.json tiedostoon. //
        data.push({
            "username": req.body.username,
            "country": req.body.country,
            "date": new Date(),
            "message": req.body.message
        });

        var jsonStr = JSON.stringify(data);

        fs.writeFile(__dirname + "/public/guestbook.json", jsonStr, (err) => {
            if (err) throw err;
            console.log("Data saved!")
        });
        // Kun kaikki on valmista, ohjataan käyttäjä "/guestbook" sivulle. //
        res.redirect("/guestbook")
    }
});
// Luodaan reitti "/ajaxmessage", joka lataa saman nimisen html-sivun. //
app.get("/ajaxmessage", function (req, res) {
    res.sendFile(__dirname + "/public/ajaxmessage.html");
});

// Käytännössä sama toimenpide, kuin "/newmessage" sivulla, mutta ilman uudelleenohjausta, koska "/ajaxmessage" tulostaa taulukon näkyviin samalle sivulle. //
app.post("/ajaxmessage", function (req, res) {
    var data = require("./public/guestbook.json");

    data.push({
        "username": req.body.username,
        "country": req.body.country,
        "date": new Date(),
        "message": req.body.message
    });


    var jsonStr = JSON.stringify(data);

    fs.writeFileSync(__dirname + "/public/guestbook.json", jsonStr);



    res.sendFile(__dirname + "/public/guestbook.json")
})

app.get("*", function (req, res) {
    res.send("Can't find the requested page", 404)
});

// Käsketään ohjelma kuuntelemaan, joko Herokun määrittämää porttia tai porttia 3000. // 
app.listen(PORT, function () {
    console.log("Server is running!")
})

