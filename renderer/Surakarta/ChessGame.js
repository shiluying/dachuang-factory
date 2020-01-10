//苏拉卡尔塔棋游戏逻辑类

//chess寄生组合式继承
function F() {}
F.prototype=Chess.prototype;
function SurakartaChess(player,chessName,position){
    Chess.call(this,player,chessName,position);
}
SurakartaChess.prototype=new F();

//设置苏拉卡尔塔棋的棋子半径、边距、选中形状
SurakartaChess.prototype.border=150;
SurakartaChess.prototype.rect=60;
SurakartaChess.prototype.selctShape="circular";

//chessgame寄生组合式继承
function G() {}
G.prototype=ChessGame.prototype;
function SurakartaChessGame(player,chessName,position){
    ChessGame.call(this,player,chessName,position);
}
SurakartaChessGame.prototype=new G();

//设置SurakartaChessGame的原型属性
SurakartaChessGame.prototype.passArc=false;//是否经过圆弧
SurakartaChessGame.prototype.track=new Array();//存储两轨道坐标数据
SurakartaChessGame.prototype.arclist=new Array();//存储圆弧坐标数据

//设置ChessGame中的xum，ynum
SurakartaChessGame.prototype.xnum=6;
SurakartaChessGame.prototype.ynum=6;
SurakartaChessGame.prototype.rect=SurakartaChess.prototype.rect;
SurakartaChessGame.prototype.border=SurakartaChess.prototype.border;


// SurakartaChessGame.prototype.area=new Array();//棋子移动范围

//初始化棋子,重写父类方法
SurakartaChessGame.prototype.initChess=function(){
    var c;//棋子
    var cn;//棋子名称
    //黑棋chess[0]-chess[11]，标号0-11
    for(var i=0;i<12;i++){
        cn="白"+i.toString();
        if(i<6){
            c=new SurakartaChess(WHITEPLAYER,cn,new Point(i,0));
            this.chess.push(c);
            this.Map[i][0]=i;
        }else{
            c=new SurakartaChess(WHITEPLAYER,cn,new Point(i-6,1));
            this.chess.push(c);
            this.Map[i-6][1]=i;
        }
    }
    //白棋chess[12]-[23]，标号12-23
    for(var i=0;i<12;i++){
        cn="黑"+i.toString();
        if(i<6){
            c=new SurakartaChess(BLACKPLAYER,cn,new Point(i,4));
            this.chess.push(c);
            this.Map[i][4]=i+12;
        }else{
            c=new SurakartaChess(BLACKPLAYER,cn,new Point(i-6,5));
            this.chess.push(c);
            this.Map[i-6][5]=i+12;
        }
    }
    this.MapList.push(deepClone(this.Map));
}
SurakartaChessGame.prototype.AddInitOperation=function(){
    this.initArray();
}
//初始化轨道坐标
SurakartaChessGame.prototype.initArray=function(){
	var eatArray1=new DoublyList();//蓝色轨道上的棋子
	var eatArray2=new DoublyList();//绿色轨道上的棋子
	for(var i=0;i<6;i++){
		eatArray1.add(new Point(1,i));
		eatArray2.add(new Point(2,i));
	}
	for(var i=0;i<6;i++){
		eatArray1.add(new Point(i,4));
		eatArray2.add(new Point(i,3));
	}
	for(var i=5;i>=0;i--){
		eatArray1.add(new Point(4,i));
		eatArray2.add(new Point(3,i));
	}
	for(var i=5;i>=0;i--){
		eatArray1.add(new Point(i,1));
		eatArray2.add(new Point(i,2));
	}
	this.track.push(eatArray1);
	this.track.push(eatArray2);
	var arcArray1=new Array(new Array(new Point(1,0),new Point(0,1)),new Array(new Point(4,0),new Point(5,1)),new Array(new Point(0,4),new Point(1,5)),new Array(new Point(4,5),new Point(5,4)));
	var arcArray2=new Array(new Array(new Point(2,0),new Point(0,2)),new Array(new Point(3,0),new Point(5,2)),new Array(new Point(0,3),new Point(2,5)),new Array(new Point(3,5),new Point(5,3)));
	this.arclist.push(arcArray1);
	this.arclist.push(arcArray2);
}

//绘制棋盘
SurakartaChessGame.prototype.drawBoard=function(){
	ctx.lineWidth=5;
	ctx.beginPath();
    ctx.strokeStyle="yellow";
    ctx.moveTo(this.border,this.border);
    ctx.lineTo(this.border,300+this.border);
    ctx.lineTo(300+this.border,300+this.border);
    ctx.lineTo(300+this.border,this.border);
    ctx.lineTo(this.border,this.border);
    ctx.stroke();
    ctx.closePath();
    for(var i=1;i<5;i++){
    	ctx.beginPath();
    	if(i==2||i==3)
    		ctx.strokeStyle="green";
    	else
    		ctx.strokeStyle="blue";
    	ctx.moveTo(this.border,this.border+this.rect*i);
        ctx.lineTo(300+this.border,this.border+this.rect*i);
        ctx.moveTo(this.border+this.rect*i,this.border);
        ctx.lineTo(this.border+this.rect*i,300+this.border);
        ctx.stroke();
    	ctx.closePath();
    }
    for(var i=3;i<5;i++){
    	ctx.beginPath();
    	if(i==3)
    		ctx.strokeStyle="green";
    	else
    		ctx.strokeStyle="blue";
		ctx.moveTo(this.border,this.border+this.rect*(5-i));
    	ctx.arc(this.border,this.border,this.rect*(5-i),Math.PI*0.5,Math.PI*2,false);
    	ctx.moveTo(this.border,this.border+this.rect*i);
        ctx.arc(this.border,this.border+this.rect*5,this.rect*(5-i),Math.PI*1.5,Math.PI*0,true);
		ctx.moveTo(this.border+this.rect*i,this.border);
        ctx.arc(this.border+this.rect*5,this.border,this.rect*(5-i),Math.PI*1,Math.PI*0.5,false);
        ctx.moveTo(this.border+this.rect*5,this.border+this.rect*i);
    	ctx.arc(this.border+this.rect*5,this.border+this.rect*5,this.rect*(5-i),Math.PI*1.5,Math.PI*1,false);
        ctx.stroke();
    	ctx.closePath();
    }
}
//目标位置有敌方棋子
SurakartaChessGame.prototype.OpponentOperation=function(tempx,tempy){
    if(this.IsAbleToEat(tempx,tempy)){
        //移动棋子
        this.MoveChess(tempx,tempy);
        this.IsStep=true;

    }else{//不可吃子
        alert("当前位置有对方棋子");
	}
    this.passArc=false;
}
//目标位置为空白
SurakartaChessGame.prototype.BlankOperation=function(tempx,tempy){
    if (this.IsAbleToMove(tempx, tempy)) {
        this.MoveChess(tempx, tempy);
        this.IsStep=true;
        // this.LastChess.showArea(ctx);
    }
    else {
        alert("当前位置不符合移动棋子的规则");
    }
};
//判断是否符合走法
SurakartaChessGame.prototype.IsAbleToMove=function(tempx,tempy){
	var x1,y1;//被单击棋子在棋盘上的原坐标
	x1=this.LastChess.pos.x;
	y1=this.LastChess.pos.y;
	var pointArray=new Array();
	var point;
	//判断逻辑上是否能走子
	for(var i=-1;i<2;i++){
		for(var j=-1;j<2;j++){
			point=new Point(x1+i,y1+j);
			pointArray.push(point);
		}
	}
	for(var i=0;i<9;i++){
		if(pointArray[i].x==tempx&&pointArray[i].y==tempy){
			return true;
		}
	}
	return false;
}

/*
先判断是否两棋子在同一轨道上
再判断是否可达且是否经过圆弧
*/
//判断是否能执行吃子操作
SurakartaChessGame.prototype.IsAbleToEat=function(tempx,tempy){
	this.passArc=false;
 	var chessx=this.LastChess.pos.x;
	var chessy=this.LastChess.pos.y;
	for(var i=0;i<this.track.length;i++){
		var temp=this.track[i].searchNodeAt(1);
		var pos1 = this.searchChess(temp,chessx,chessy);
 		var pos2 = this.searchChess(temp,tempx,tempy);
 		if(pos1.length!=0&&pos2.length!=0){
 		    for(var j=0;j<pos1.length;j++){
                if((this.checkChess(this.track[i].searchNodeAt(pos1[j]),tempx,tempy)))
                    return true;
            }
 		}
	}
	return false;
}
//判断棋子是否在轨道中
SurakartaChessGame.prototype.searchChess=function(temp,x,y){
    var num=new Array();
    for(var i=1;i<=24;i++){
        if(temp.data.x==x&&temp.data.y==y) {
            num.push(i);
        }
        temp = temp.next;
    }
    return num;
}
/*
temp为开始棋子的位置
tempx,tempy为结束棋子的坐标
*/
SurakartaChessGame.prototype.checkChess=function(temp,tempx,tempy){
    this.passArc=false;
    if(this.searchChessNext(temp,tempx,tempy)&&this.passArc){
        return true;
    }
    else{
        this.passArc=false;
    }
    if(this.searchChessPrevious(temp,tempx,tempy)&&this.passArc){
        return true;
    }
    else{
        this.passArc=false;
    }
    return false;
}
//顺查找判断两棋子间是否有其他棋子
SurakartaChessGame.prototype.searchChessNext=function(temp,tempx,tempy){
	var x=temp.next.data.x;
	var y=temp.next.data.y;
	if(!this.passArc){
		this.searchCircle(x,y,temp.data.x,temp.data.y);
	}
	if(x==tempx&&y==tempy){
		return true;
	}
	else if(this.Map[x][y]==-1){
		return this.searchChessNext(temp.next,tempx,tempy);
	}
	else{
		return false;
	}
}
//逆查找判断两棋子间是否有其他棋子
SurakartaChessGame.prototype.searchChessPrevious=function(temp,tempx,tempy){
	var x=temp.previous.data.x;
	var y=temp.previous.data.y;
	if(!this.passArc){
		this.searchCircle(x,y,temp.data.x,temp.data.y);
	}
	if(x==tempx&&y==tempy){
		return true;
	}
	else if(this.Map[x][y]==-1){
		return this.searchChessPrevious(temp.previous,tempx,tempy);
	}
	else{
		return false;
	}
}
//判断吃子时是否经过圆弧
SurakartaChessGame.prototype.searchCircle=function(x1,y1,x2,y2){
	for(var j=0;j<this.arclist.length;j++){
		var array=this.arclist[j];//蓝轨和绿轨
		for(var i=0;i<this.arclist[j].length;i++){
			var arr=array[i];//获取轨道上的四个节点对
			if((arr[0].x==x1||arr[1].x==x1)&&(arr[0].y==y1||arr[1].y==y1)){//(x1,y1)在当前节点对中
				if((arr[0].x==x2||arr[1].x==x2)&&(arr[0].y==y2||arr[1].y==y2)){//(x2,y2)在当前节点对中
					this.passArc=true;
					return true;
				}
			}
		}
	}
	return false;
}

SurakartaChessGame.prototype.GameOver=function(){
    var whitedeadchess=0;
    var blackdeadchess=0;
    var chessnum=12;
    for(var i=0;i<this.chess.length;i++){
        var x=this.chess[i].pos.x;
        var y=this.chess[i].pos.y;
        if(this.chess[i].player==WHITEPLAYER&&this.Map[x][y]!=i){
            whitedeadchess+=1;
        }
        if(this.chess[i].player==BLACKPLAYER&&this.Map[x][y]!=i){
            blackdeadchess+=1;
        }
    }
    if(whitedeadchess==chessnum||blackdeadchess==chessnum){
        StopTime();
        return true;
    }
    return false;
}

//创建游戏对象
var game=new SurakartaChessGame();
game.GameType=1;
//加载页面时初始化棋局
window.onload=function(){
    game.initGame();
}
