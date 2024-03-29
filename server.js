/*
* server.js
* 
* The high score server REST interface. 
* There are 2 URLS that both use get, one to query a high score and the other to post it.
*
* Author: Brian Piltin
* Copyright: Copyright (C) 2021 Brian Piltin. All Rights Reserved.
*/
const env = require("./config/config").env
console.log("Environment:", env);

const fs = require("fs");
const cors = require("cors");
const http = require('http');
const https = require('https');
const express = require('express');
const app = express();

let host = process.env.HOST || "localhost";
let port = process.env.PORT || 3000;

if (env === "production") {

    // https://stackoverflow.com/a/7458587/2032154
    const httpApp = express();
    httpApp.get('*', function(req, res) {  
        res.redirect('https://' + req.headers.host + req.url);
    })
    const httpServer = http.createServer(httpApp).listen(80);
    console.log(`App listening at http://${host}:80`);

    fs.readFile(`/etc/letsencrypt/live/brianpiltin.com/privkey.pem`, (err, key) => {
        console.log(key);
        fs.readFile(`/etc/letsencrypt/live/brianpiltin.com/fullchain.pem`, (err, cert) => {
            console.log(cert);
            const httpsServer = https.createServer({key, cert}, app).listen(port);
            console.log(`App listening at https://${host}:${port}`);
        });
    });

} else {

    app.listen(port, () => {
        console.log(`App listening at http://${host}:${port}`);
    });

}

app.use(cors());

app.use(express.json());

app.use(express.static('public'));


//======================================================
// Read a score
//======================================================
app.get("/high_scores/:hash", (req, res) => {
    console.log("GET: " + req.hostname + req.url);

    fs.readFile(__dirname + "/scores.json", "utf8", (err, data) => {
        data = JSON.parse(data);
        let obj = data.find(obj => obj.hash === req.params.hash);
        if (obj) {
            res.send({ name: obj.name, score: obj.score });
        } else {
            res.send({ error: "Hash \"" + req.params.hash + "\" not found." } );
        }
    });
});

//======================================================
// Write a score
//======================================================
app.post("/high_scores/:hash", (req, res) => {
    console.log("POST: " + req.hostname + req.url);
    console.log(req.body);

    if (!req.body || isNaN(req.body.score)) {
        res.send({ error: "Invalid request." });
        return;
    }
    fs.readFile(__dirname + "/scores.json", "utf8", (err, data) => {

        data = JSON.parse(data);
        let obj = data.find(obj => obj && obj.hash === req.params.hash);

        if (!obj) {
            obj = { hash: req.params.hash, name: "", score: 0 };
            data.push(obj);
        }

        let oldScore = parseInt(obj.score);
        let newScore = parseInt(req.body.score);

        if (newScore > oldScore) {
            obj.name = req.body.name;
            obj.score = newScore;
            fs.writeFile(__dirname + "/scores.json",
                JSON.stringify(data), () => res.send({ success: "Score updated." }));
        } else {
            res.send({ message: "Score not updated." });
        }
    });
});
