function InitGame(){
    var btnVal=document.getElementById("startbtn");
    if(btnVal.value=="开始游戏"){
        setTitle = '请选择执子颜色';
        setContents = '黑子意味着先手，对方选择将与你所执子相反的颜色';
        setButton = '["黑子","白子"]';
        $(this).openWindow(setTitle,setContents,setButton);
        StarGame();
        btnVal.value="暂停游戏";
    }else if(btnVal.value=="暂停游戏"){
        clearTimeout(game.time);
        btnVal.value="继续游戏";
    }
    else if(btnVal.value=="继续游戏"){
        SetTime();
        btnVal.value="暂停游戏";
    }
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
    SetTime();
}

//重新开始
function ResetGame(){
    clearTimeout(game.time);
    var btnVal=document.getElementById("startbtn");
    btnVal.value="开始游戏";
	ctx.clearRect(0,0,mycanvas.width,mycanvas.height);
    game.initGame();
	InitGame();

}

function WithDraw(){
	if(game.MapList.length<2||game.STARTGAME==false){
        alert("无法悔棋");
        return;
    }
	//改变棋盘和棋子数据
    game.MapList.pop();
	game.Map=deepClone(game.MapList[game.MapList.length-1]);
	console.log(game.Map);
	for(var i=0;i<game.xnum;i++){
		for(var j=0;j<game.ynum;j++){
			if(game.Map[i][j]>=0){
				game.chess[game.Map[i][j]].setPosition(i,j);
			}
		}
	}
	game.Draw();
	game.reversePlayer();
}
function SetTime(){
	document.getElementById('myTime').innerHTML=checkTime(game.hour)+":"+checkTime(game.minute)+":"+checkTime(game.second);
	game.second=game.second+1;
	if(game.second>=60){
		game.second=0;
		game.minute+=1;
	}
	if(game.minute>=60){
		game.minute=0;
	}
	game.time=setTimeout("SetTime()",1000);
}
function checkTime(i)
{
	if (i<10)
  		i="0" + i;
  	return i
}
function WriteBoard(){
	console.log(game.MapList);
}