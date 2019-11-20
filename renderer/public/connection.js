//和服务端的连接
// noinspection JSAnnotator
const socket;
// socket = new WebSocket("ws://39.106.79.28:5434");
// socket.onopen = function(event){
//     console.log("success connect!");
// };
socket.onmessage = function (event) {
    var data=JSON.parse(event.data);
    if(data.mesg==='position'){//棋子

    }
}


function SendData(data) {
    var data = {
        data: data
    };
    console.log(data)
    // socket.send(JSON.stringify(data));
}
function SendStart() {
    var data = {
        mesg:'start'
    };
    StarGame();
    // socket.send(JSON.stringify(data));
}
// socket.addEventListener('SendStart',  getState(event));
function getState(event) {
    var msg=event.data;
    var state = JSON.parse(msg);
    console.log(msg);
    if(state==='ready'){
        startGame();
        var btnVal=document.getElementById("startbtn");
        btnVal.value = "  Stop Game  ";
    }
}

//和算法的连接

// noinspection JSAnnotator
const ws;
// ws = new WebSocket("ws://39.106.79.28:5434");
// ws.onopen = function(evt){
//     console.log("success connect server!");
// };

function sendMsg(data) {
    ws.send(JSON.stringify(data));

}
ws.onmessage = function (event) {
    var data= JSON.parse(event.data);
    game.AIGame(data);
}



//example
// // Create WebSocket connection.
// const socket = new WebSocket('ws://localhost:8080');
//
// // Connection opened
// socket.addEventListener('open', function (event) {
//     socket.send('Hello Server!');
// });
//
// // Listen for messages
// socket.addEventListener('message', function (event) {
//     console.log('Message from server ', event.data);
// });
