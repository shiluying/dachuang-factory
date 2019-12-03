//和服务端的连接


var socket = new WebSocket("ws://39.106.79.28:5434");
console.log(socket);
socket.onopen = function(event){
    console.log("success connect!");
};

socket.onmessage = function (event) {
    var data;
    let reader = new FileReader();
    reader.onload= () =>{
        data=reader.result;
        data=JSON.parse(data);
        console.log(data.mesg);
        if(data.mesg==='move'){//移动
            game.AIGame(data);
        }
        else if(data.mesg==='add_room'){//进入房间
            console.log(data);
            // var order=data.order;
            var type=data.type;
            console.log(type);
            //逻辑结构
            setOrder(data.order);
            $('.room').removeClass('active').removeClass('show').addClass('hide');
            $('.game-room').removeClass('hide').addClass('active').addClass('show');
        }
        else if(data.mesg==='join'){//加入房间
            console.log(data);
            // var room_id=data;
            // var order=data.order;
            var type=data.type;
            console.log(type);
            //逻辑结构
            setOrder(data.order);
            $('.room').removeClass('active').removeClass('show').addClass('hide');
            $('.game-room').removeClass('hide').addClass('active').addClass('show');

        }
        else if(data.mesg==='room_list'){//连接成功返回房间列表
            var room_list=data.room_list;
            console.log(room_list);
            ShowTable(room_list);
        }
        else if(data.mesg==='start'){
            StarGame();
            var btnVal=document.getElementById("startbtn");
            btnVal.value = "  Stop Game  ";
        }
        //..
    };
    reader.readAsText(event.data);

}

//添加房间
function AddRoom(type,args,time,order) {
    var data={
        mesg:'add_room',
        type:type,
        args:args,
        time:time,
        order:order
    };
    socket.send(JSON.stringify(data));
}

//加入房间
function JoinRoom(room_id,order) {
    var data={
        mesg:'join',
        room_id:room_id,
        order:order
    };
    socket.send(JSON.stringify(data));
}
//点击开始
function SendStart(order) {
    var data = {
        mesg:'start',
        order:order
    };
    socket.send(JSON.stringify(data));
}
//发送棋子数据
function SendData(data) {
    var sendData = {
        mesg:'move',
        location:{
            'from':[data[0].y,data[0].x],
            'to':[data[1].y,data[1].x]
        },
        kw:0
    };
    socket.send(JSON.stringify(sendData));
    console.log(sendData);
    var sendData = {
        mesg:'move',
        location:{
            'from':[data[1].y,data[1].x],
            'to':[data[2].y,data[2].x]
        },
        kw:1
    }
    console.log(sendData);
    socket.send(JSON.stringify(sendData));
}

function RollBack(data){
    var data = {
        mesg:'rollback'
    };
    socket.send(JSON.stringify(data));
}



//和算法的连接


// var ws;
// ws = new WebSocket("ws://39.106.79.28:5434");
// ws.onopen = function(evt){
//     console.log("success connect server!");
// };
//
// function sendMsg(data) {
//     ws.send(JSON.stringify(data));
//
// }
// ws.onmessage = function (event) {
//     var data;
//     let reader = new FileReader();
//     reader.onload= () =>{
//         data=reader.result;
//         data=JSON.parse(data);
//         console.log(data.mesg);
//         if(data.mesg==='move'){//移动
//             game.AIGame(data);
//         }
//     };
//     reader.readAsText(event.data);
//     game.AIGame(data);
// }



