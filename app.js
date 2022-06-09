// Require express
const express = require("express");
// Require Https
const https = require("https");
// Require Body Parser
const bodyParser = require("body-parser");

// Initialize new express app
const app = express();

let dataParsed;

app.use(bodyParser.urlencoded({
    extended: true
}));

app.use(express.static("public"));

app.set("view engine", "ejs");

// Respond when a GET request is made to the home page
app.get("/", function (request, response) {
    let ts = Date.now();
    let date_ob = new Date(ts);
    let date = ("0" + date_ob.getDate()).slice(-2);
    let month = ("0" + (date_ob.getMonth() + 1)).slice(-2);
    let year = date_ob.getFullYear();
    const url = "https://tradestie.com/api/v1/apps/reddit?date=" + year + "-" + month + "-" + date;
    let commentData = "";

    https.get(url, function (res) {
        res.on("data", function (data) {
            commentData += data;
        });

        res.on("end", function () {
            dataParsed = JSON.parse(commentData);
        });
    });

    console.log(dataParsed);
    response.render("index", {
        wsb_data_list: dataParsed,
    });
});

// Listen on port
app.listen(3000, function () {
    console.log("Server is running on port 3000.");
});