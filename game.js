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
var chatmsg = "";

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
    /*database.ref().set({
        add: $("#player-name").val().trim(),
        player: player,
        score: score,
        chatmsg: chatmsg
    });*/
});

database.ref().on("value", function(snapshot) {
    console.log("value");
    player = snapshot.val().player;
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
            database.ref().update({
                add: "",
                player: player
            });
        } else {
            if (!id == -1) {
                player[Math.abs(id - 1)] = snapshot.val().player[Math.abs(id - 1)];
            }
        }
    } else if (!id == -1) {
        if (!score == snapshot.val().score) {
            $("#score-wins").text(snapshot.val().score[id][0]);
            $("#score-losses").text(snapshot.val().score[id][1]);
            $("#score-ties").text(snapshot.val().score[id][2]);
        }
        if (!snapshot.val().chatmsg == "") {
            var chatrec = snapshot.val().chatrec[id];
            if (chatrec[id] == true) {
                var chatDiv = document.getElementById("chat-text");
                var newP = document.createElement('p');
                newP.innerHTML = "<p>" + snapshot.val().chatmsg + "</p>";
                chatDiv.appendChild(newP);
                chatDiv.scrollTop = chatDiv.scrollHeight;
                chatrec[id] = false;
                database.ref().update({chatrec: chatrec});
                if (chatrec[0] == false && chatrec[0] == false) {
                    database.ref().update({chatmsg: ""});
                }
            }
        }
    }
}, function(errorObject) {
  console.log("Errors handled: " + errorObject.code);
});