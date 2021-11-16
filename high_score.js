function readScore(game, callback) {
    fetch(encodeURI("http://localhost:3000/high_scores/" + game))
    .then(res => res.json())
    .then(json => callback && callback(json));
}

function writeScore(game, name, score, callback) {
    fetch(encodeURI("http://localhost:3000/high_scores/" + game + "/update/" + name + "/score/" + score))
    .then(res => res.json())
    .then(json => callback && callback(json));
}

readScore("hornball", function (res) {
    console.log(res);
    document.getElementById("old_score").innerHTML = JSON.stringify(res);
    let oldScore = parseInt(res.score);
    writeScore("hornball", "New Person", oldScore + 1, function (res) {
        console.log(res);
        document.getElementById("new_score").innerHTML = JSON.stringify(res);
    });
});