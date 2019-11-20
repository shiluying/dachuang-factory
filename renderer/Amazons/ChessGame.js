//亚马逊棋游戏逻辑类

//chess寄生组合式继承
function F() {}
F.prototype=Chess.prototype;
function AmazonsChess(player,chessName,position){
    Chess.call(this,player,chessName,position);
}
AmazonsChess.prototype=new F();

//设置亚马逊棋的棋子半径、边距、选中形状
AmazonsChess.prototype.border=30;
AmazonsChess.prototype.rect=60;
AmazonsChess.prototype.selctShape="circular";
AmazonsChess.prototype.obstacle=new Array();


//chessgame寄生组合式继承
function G() {}
G.prototype=ChessGame.prototype;
function AmazonsChessGame(player,chessName,position){
    ChessGame.call(this,player,chessName,position);
}
AmazonsChessGame.prototype=new G();

//设置AmazonsChessGame的原型属性
AmazonsChessGame.prototype.direction=new Array();//方向
AmazonsChessGame.prototype.area=new Array();//棋子移动范围
AmazonsChessGame.prototype.obstacle=new Point();

//更改ChessGame中的xum，ynum
AmazonsChessGame.prototype.xnum=10;
AmazonsChessGame.prototype.ynum=10;
AmazonsChessGame.prototype.rect=AmazonsChess.prototype.rect;
AmazonsChessGame.prototype.border=AmazonsChess.prototype.border;

//初始化棋子,重写父类方法
AmazonsChessGame.prototype.initChess=function(){
    var c;//棋子
    var cn;//棋子名称
    //黑棋chess[0]-chess[3]，标号0-3
    for(var i=0;i<4;i++){
        cn="白"+i.toString();
        if(i<2){
            c=new AmazonsChess(WHITEPLAYER,cn,new Point(i*3+3,0));
            this.chess.push(c);
            this.Map[i*3+3][0]=i;
        }else{
            c=new AmazonsChess(WHITEPLAYER,cn,new Point((i-2)*9,3));
            this.chess.push(c);
            this.Map[(i-2)*9][3]=i;
        }
    }
    //白棋chess[4]-[7]，标号4-7
    for(var i=0;i<4;i++){
        cn="黑"+i.toString();
        if(i<2){
            c=new AmazonsChess(BLACKPLAYER,cn,new Point(i*9,6));
            this.chess.push(c);
            this.Map[i*9][6]=i+4;
        }else{
            c=new AmazonsChess(BLACKPLAYER,cn,new Point((i-1)*3,9));
            this.chess.push(c);
            this.Map[(i-1)*3][9]=i+4;
        }
    }
    this.MapList.push(deepClone(this.Map));
}
AmazonsChessGame.prototype.AddInitOperation=function(){
    this.ObstacleFlag=false;
    this.IsStep=false;
    this.InitDirection();
}
AmazonsChessGame.prototype.InitDirection=function(){
    for(var i=-1;i<2;i++){
        for(var j=-1;j<2;j++){
            if(i==0&&j==0){
                continue;
            }
            this.direction.push(new Point(i,j));
        }
    }
}
//绘制棋盘
AmazonsChessGame.prototype.drawBoard=function(){
    var off=true;
    for (var i = 0;i <10;i++){
        for(var j = 0; j < 10;j++){
            if(off){
                off = !off;
                ctx.fillStyle = "rgb(236, 207, 152)";
                ctx.fillRect(i*this.rect,j*this.rect,this.rect,this.rect);
            }
            else if(!off){
                off = !off;
                ctx.fillStyle = "rgb(131, 67, 47)";
                ctx.fillRect(i*this.rect,j*this.rect,this.rect,this.rect);
            }
        }
        off = !off;
    }
}
AmazonsChessGame.prototype.AddOperation=function(){
    this.ObstacleFlag=true;
    this.ChessArea(this.LastChess);
    this.LastChess.showArea(ctx);
}
AmazonsChessGame.prototype.IsAbleToPut=function(tempx,tempy) {
    for(var i=0;i<this.LastChess.area.length;i++){
        if(tempx == this.LastChess.area[i].x&&tempy == this.LastChess.area[i].y)
            return true
    }
    return false
}
AmazonsChessGame.prototype.IsAbleToMove=function(tempx,tempy) {
    for(var i=0;i<this.LastChess.area.length;i++){
        if(tempx == this.LastChess.area[i].x&&tempy == this.LastChess.area[i].y)
            return true
    }
    return false
}
AmazonsChessGame.prototype.AddDrawOperation=function(){
    for(var i=0;i<this.xnum;i++)
        for(var j=0;j<this.ynum;j++)
            if(this.Map[i][j]==-2){
                ctx.fillStyle="#6699FF";
                ctx.beginPath();
                ctx.fillRect(i*this.rect,j*this.rect,this.rect,this.rect);
                ctx.stroke();
                ctx.closePath();
            }
}
//绘制障碍
AmazonsChessGame.prototype.PutObstacle=function(tempx,tempy) {
    this.Map[tempx][tempy]=-2;
    this.Draw();
    this.obstacle=new Point(tempx,tempy);
    this.IsStep=true;
}
//棋子的移动范围
AmazonsChessGame.prototype.ChessArea=function(chess){
    this.area=new Array();
    var x1,y1;
    x1 = parseInt(chess.pos.x);
    y1= parseInt(chess.pos.y);
    for(var i=0;i<this.direction.length;i++){
        var tempx=x1+this.direction[i].x;
        var tempy=y1+this.direction[i].y;
        while(true){
            if(this.IsBorder(tempx,tempy)){
                break;
            }else if(this.Map[tempx][tempy]!=-1){
                break;
            }
            else{
                this.area.push(new Point(tempx,tempy));
                tempx=tempx+this.direction[i].x;
                tempy=tempy+this.direction[i].y;
            }
        }
    }
    chess.area=deepClone(this.area);
}
AmazonsChessGame.prototype.AddHistory=function(){
    this.history.push(this.obstacle);
}
AmazonsChessGame.prototype.GameOver=function () {
    var whitedeadchess=0;
    var blackdeadchess=0;
    var chessnum=4;
    for(var i=0;i<this.chess.length;i++){
        this.ChessArea(this.chess[i]);
        if(this.chess[i].player==WHITEPLAYER&&this.chess[i].area.length==0){
            whitedeadchess+=1;
        }
        if(this.chess[i].player==BLACKPLAYER&&this.chess[i].area.length==0){
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
var game=new AmazonsChessGame();
//加载页面时初始化棋局
window.onload=function(){
    game.initGame();
}
