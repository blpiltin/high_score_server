
readScore("blpiltin@gmail.com", "hornball", function (res) {
    console.log(res);
    document.getElementById("old_score").innerHTML = JSON.stringify(res);
    let oldScore = parseInt(res.score) || 0;
    writeScore("blpiltin@gmail.com", "hornball", "New Person", oldScore + 1, function (res) {
        console.log(res);
        document.getElementById("new_score").innerHTML = JSON.stringify(res);
    });
});
