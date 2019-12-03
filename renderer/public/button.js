var order=null;
function setOrder(or) {
    order=or;
}
function InitGame(order){
    console.log("所属方："+order);
    var btnVal=document.getElementById("startbtn");
    if (btnVal.value == "  Start Game  ") {
        if(order==='1'){
            game.Player=BLACKPLAYER;
        }else{
            game.Player=WHITEPLAYER;
        }
        // setTitle = 'Please choose the color of the chess';
        // setContents = 'Black means first hand, the other side chooses the color opposite to your persistence';
        // setButton = '["Black","White"]';
        // $(this).openWindow(setTitle, setContents, setButton);
        SendStart(order);
        // btnVal.value = "  Stop Game  ";
    } else if (btnVal.value == "  Stop Game  ") {
        clearTimeout(game.time);
        btnVal.value = "Continue Game";
    }
    else if (btnVal.value == "Continue Game") {
        SetTime();
        btnVal.value = "  Stop Game  ";
    }
}
function InitType() {
    let setTitle;
    let setContents;
    let setButton;
    setTitle = '选择比赛类型';
    setContents = '请选择比赛类型';
    setButton = '["人人对弈","人机对弈","AI对弈"]';
    $(this).chooseType(setTitle, setContents, setButton);
}

//初始化游戏
function StarGame(){
    game.STARTGAME=true;
    StartTime();

}
function StartTime(){
    clearTimeout(game.time);
    game.hour=0;
    game.second=0;
    game.minute=0;
    game.blackhour=0;
    game.blacksecond=0;
    game.blackminute=0;
    document.getElementById('blackTime').innerHTML = checkTime(game.blackhour) + ":" + checkTime(game.blackminute) + ":" + checkTime(game.blacksecond);
    game.whitehour=0;
    game.whitesecond=0;
    game.whiteminute=0;
    document.getElementById('whiteTime').innerHTML = checkTime(game.whitehour) + ":" + checkTime(game.whiteminute) + ":" + checkTime(game.whitesecond);
    SetTime();

}

//重新开始
function ResetGame(){
    clearTimeout(game.time);
    var btnVal=document.getElementById("startbtn");
    btnVal.value="  Start Game  ";
	ctx.clearRect(0,0,mycanvas.width,mycanvas.height);
    game.initGame();
	InitGame();

}

function WithDraw(){
	if(game.MapList.length<2||game.STARTGAME==false){
        alert("can not withdraw");
        return;
    }
	//改变棋盘和棋子数据
    game.MapList.pop();
	game.Map=deepClone(game.MapList[game.MapList.length-1]);
	for(var i=0;i<game.xnum;i++){
		for(var j=0;j<game.ynum;j++){
			if(game.Map[i][j]>=0){
				game.chess[game.Map[i][j]].setPosition(i,j);
			}
		}
	}
	//改变棋局历史
    game.historyList.pop();
    RollBack();
	game.Draw();
	game.reversePlayer();
}
function GetBoards(){
    var data="";
    console.log(game.historyList.length);
    for(var i=0;i<game.historyList.length;i++){
        var s="";
        var history = game.historyList[i];
        for(var j=0;j<history.length;j++){
            s=s+history[j].x+","+history[j].y+">>"
        }
        console.log(s);
        data=data+s+"\r\n";

    }
    var file = new File([data], "borads.txt", { type: "text/plain;charset=utf-8" });
    saveAs(file);
}
function SetTime(){
    if(game.LocalPlayer==BLACKPLAYER) {
        document.getElementById('blackTime').innerHTML = checkTime(game.blackhour) + ":" + checkTime(game.blackminute) + ":" + checkTime(game.blacksecond);
        game.blacksecond=game.blacksecond+1;
        if(game.blacksecond>=60){
            game.blacksecond=0;
            game.blackminute+=1;
        }
        if(game.blackminute>=60){
            game.blackminute=0;
            game.blackhour+=1;
        }
    }else if(game.LocalPlayer==WHITEPLAYER){
        game.whitesecond=game.whitesecond+1;
        document.getElementById('whiteTime').innerHTML = checkTime(game.whitehour) + ":" + checkTime(game.whiteminute) + ":" + checkTime(game.whitesecond);
        if(game.whitesecond>=60){
            game.whitesecond=0;
            game.whiteminute+=1;
        }
        if(game.whiteminute>=60){
            game.whiteminute=0;
            game.whitehour+=1;
        }
    }
	document.getElementById('myTime').innerHTML=checkTime(game.hour)+":"+checkTime(game.minute)+":"+checkTime(game.second);
	game.second=game.second+1;
	if(game.second>=60){
		game.second=0;
		game.minute+=1;
	}
	if(game.minute>=60){
		game.minute=0;
		game.hour+=1;
	}
	game.time=setTimeout("SetTime()",1000);

}

function checkTime(i)
{
	if (i<10)
  		i="0" + i;
  	return i
}

