var config = {
    apiKey: "AIzaSyCT0yimK-hQ6eT64WKhvNlN4SyQ0ULiElA",
    authDomain: "rpsgame-9fa95.firebaseapp.com",
    databaseURL: "https://rpsgame-9fa95.firebaseio.com",
    projectId: "rpsgame-9fa95",
    storageBucket: "rpsgame-9fa95.appspot.com",
    messagingSenderId: "492496123301"
};
firebase.initializeApp(config);

var database = firebase.database();

var id = -1;
var player = [];
var score = [];

for (i = 0; i <= 1; i++){
    player.push("");
    score.push([0, 0, 0]);
}

database.ref().set({
    add: "",
    player: ["", ""],
    score: [[0, 0, 0], [0, 0, 0]],
    chatmsg: "",
    chatrec: [false, false]
});

$("#play-btn").on("click", function(event) {
    event.preventDefault();
    database.ref().update({
        add: $("#player-name").val().trim()
    });
});

$("#send-btn").on("click", function(event) {
    event.preventDefault();
    if (!(id == -1)) {
        var chatrec = [true, true];
        database.ref().update({
            chatmsg: player[id] + ": " + $("#chat-msg").val().trim(),
            chatrec: chatrec
        });
    }
});

database.ref().on("value", function(snapshot) {
    player = snapshot.val().player;
    if (!(id == -1)) {
        if (!player[Math.abs(id - 1)] == "") {
            document.getElementById("opponent").innerHTML = '<strong>Opponent:</strong> ' + player[Math.abs(id - 1)];
        }

        if (!score == snapshot.val().score) {
            $("#score-wins").text('<strong>Wins:</strong> ' + snapshot.val().score[id][0]);
            $("#score-losses").text('<strong>Losses:</strong> ' + snapshot.val().score[id][1]);
            $("#score-ties").text('<strong>Ties:</strong> ' + snapshot.val().score[id][2]);
        }
        if (!snapshot.val().chatmsg == "") {
            var chatrec = snapshot.val().chatrec;
            if (chatrec[id] == true) {
                if (chatrec[0] == false && chatrec[1] == false) {
                    database.ref().update({chatrec: chatrec, chatmsg: ""});
                } else {
                    database.ref().update({chatrec: chatrec});
                }
                var chatDiv = document.getElementById("chat-text");
                var newP = document.createElement('p');
                newP.innerHTML = snapshot.val().chatmsg;
                chatDiv.appendChild(newP);
                chatDiv.scrollTop = chatDiv.scrollHeight;
                chatrec[id] = false;
            }
        }
    }
    if (!snapshot.val().add == "") {
        if (snapshot.val().add == $("#player-name").val().trim()) {
            if (id == -1) {
                if (snapshot.val().player[0] == "") {
                    id = 0;
                } else {
                    id = 1;
                }
            }
            player[id] = $("#player-name").val().trim();
            document.getElementById("player").innerHTML = '<strong>Player:</strong> ' + player[id];
            database.ref().update({
                add: "",
                player: player
            });
        }
    }
}, function(errorObject) {
    console.log("Errors handled: " + errorObject.code);
});