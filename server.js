/*
* server.js
* 
* The high score server REST interface. 
* There are 2 URLS that both use get, one to query a high score and the other to post it.
*
* Author: Brian Piltin
* Copyright: Copyright (C) 2021 Brian Piltin. All Rights Reserved.
*/

const express = require("express");
const cors = require("cors");
const app = express();
const port = 4111;
const fs = require("fs");

app.use(cors());

app.get("/", (req, res) => {
    res.end("Welcome to server02x.");
});

app.get("/high_scores/:game", (req, res) => {
    fs.readFile(__dirname + "/scores.json", "utf8", (err, data) => {
        data = JSON.parse(data);
        let obj = data.find(obj => obj.game === req.params.game);
        if (obj) {
            res.send({ name: obj.name, score: obj.score });
        } else {
            res.send({ error: "Game \"" + req.params.game + "\" not found." } );
        }
    });
})

app.get("/high_scores/:game/update/:name/score/:score", (req, res) => {
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

app.listen(port, () => {
    console.log(`app listening at http://localhost:${port}`);
});
