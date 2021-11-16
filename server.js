/*
* server.js
* 
* The high score server REST interface. 
* There are 2 URLS that both use get, one to query a high score and the other to post it.
*
* Author: Brian Piltin
* Copyright: Copyright (C) 2021 Brian Piltin. All Rights Reserved.
*/
require('dotenv').config();         // Get process.env.NODE_ENV

const fs = require("fs");
const cors = require("cors");
const http = require('http');
const https = require('https');
const express = require('express');
const app = express();

let port;

if (process.env.NODE_ENV === "production") {

    port = 443;

    // https://stackoverflow.com/a/7458587/2032154
    const httpApp = express();
    httpApp.get('*', function(req, res) {  
        res.redirect('https://' + req.headers.host + req.url);
    })
    const httpServer = http.createServer(httpApp).listen(80);
    console.log(`App listening at http://brianpiltin.com:80}`);

    fs.readdir("/etc/letsencrypt/live", (dir) => {
        dir = dir[0];
        fs.readFile(`/etc/letsencrypt/live/${certdir}/privkey.pem`, (key) => {
            fs.readFile(`/etc/letsencrypt/live/${certdir}/fullchain.pem`, (cert) => {
                const httpsServer = https.createServer({key, cert}, app).listen(port);
                console.log(`App listening at https://brianpiltin.com:${port}`);
            });
        });
    });

} else {

    port = 3000;

    app.listen(port, () => {
        console.log(`App listening at http://localhost:${port}`);
    });
    
}

app.use(cors());

app.use(express.static('public'));

app.get("/high_scores/:game", (req, res) => {
    console.log(req.hostname + req.url);

    fs.readFile(__dirname + "/scores.json", "utf8", (err, data) => {
        data = JSON.parse(data);
        let obj = data.find(obj => obj.game === req.params.game);
        if (obj) {
            res.send({ name: obj.name, score: obj.score });
        } else {
            res.send({ error: "Game \"" + req.params.game + "\" not found." } );
        }
    });
});

app.get("/high_scores/:game/update/:name/score/:score", (req, res) => {
    console.log(req.url);
    if (isNaN(req.params.score)) {
        res.send({ error: "Invalid request." });
        return;
    }
    fs.readFile(__dirname + "/scores.json", "utf8", (err, data) => {

        data = JSON.parse(data);
        let obj = data.find(obj => obj.game === req.params.game);

        if (!obj) {
            res.send({ error: "Game \"" + req.params.game + "\" not found." } );
        }

        let oldScore = parseInt(obj.score);
        let newScore = parseInt(req.params.score);

        if (newScore > oldScore) {
            obj.name = req.params.name;
            obj.score = newScore;
            fs.writeFile(__dirname + "/scores.json",
                JSON.stringify(data), () => res.send({ success: "Score updated." }));
        } else {
            res.send({ message: "Score not updated." });
        }
    });
});
