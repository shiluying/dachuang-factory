//游戏逻辑类
function ChessGame(){
    this.STARTGAME = false;
    //设置时间
    this.time = 0;
    this.hour=0;
    this.minute=0;
    this.second=0;
    //设置棋子及棋局
    this.chess=new Array();
    this.Map=new Array();
    this.MapList = new Array();
    this.LastChess=null;//用户上次指定的棋子
    this.LocalPlayer=null;//记录下棋方
    this.GameType=1;//1-人人对弈；2-人机对弈；3-AI对弈
    this.ObstacleFlag=false;
    this.IsStep=false;
}
ChessGame.prototype.xnum=0;
ChessGame.prototype.ynum=0;
ChessGame.prototype.rect=0;
ChessGame.prototype.border=0;
//初始化棋局和棋子
ChessGame.prototype.initGame=function() {
    this.MapList = new Array();
    this.Map = new Array();
    this.chess = new Array();
    this.initMap();
    this.initChess();
    this.AddInitOperation();
    this.drawBoard();
    this.drawChess();
}
//绘制全部棋子
ChessGame.prototype.drawChess=function(){
    for(var i=0;i<this.chess.length;i++){
        this.chess[i].showChess(ctx);
    }
}
//绘制棋盘和剩余棋子
ChessGame.prototype.Draw=function(){
    ctx.clearRect(0,0,mycanvas.width,mycanvas.height);
    this.drawBoard();
    for(var i=0;i<this.xnum;i++)
        for(var j=0;j<this.ynum;j++)
            if(this.Map[i][j]>=0){
                this.chess[this.Map[i][j]].showChess(ctx);
            }
    this.AddDrawOperation();
}
//调换下棋方
ChessGame.prototype.reversePlayer=function () {
    if(this.LocalPlayer==WHITEPLAYER){
        this.LocalPlayer=BLACKPLAYER;
    }else{
        this.LocalPlayer=WHITEPLAYER;
    }
}
//判断是否为己方棋子
ChessGame.prototype.IsMyChess=function(c){
    if((this.LocalPlayer==WHITEPLAYER&&c.player==1)||(this.LocalPlayer==BLACKPLAYER&&c.player==0)){
        return true;
    }
    else{
        return false;
    }
}
//创建棋子布局数组Map
ChessGame.prototype.initMap=function(){
    this.Map=new Array();
    for(var x=0;x<this.xnum;x++) {
        var temp = new Array();
        for (var y = 0; y < this.ynum; y++) {
            temp.push(-1);
        }
        this.Map.push(deepClone(temp));
    }
}
//移动棋子
ChessGame.prototype.MoveChess=function(tempx,tempy){
    var id1,id2;//保存第一次和第二次被单击棋子的索引号
    var x1,y1;//第一次被单击棋子在棋盘上的原坐标
    x1=this.LastChess.pos.x;
    y1=this.LastChess.pos.y;
    var x2,y2;//第二次被单击空格在棋盘上的原坐标
    x2=tempx;
    y2=tempy;
    id1=this.Map[x1][y1];
    id2=this.Map[x2][y2];
    this.Map[x1][y1]=-1;
    this.Map[x2][y2]=id1;
    this.chess[id1].setPosition(x2,y2);
    this.Draw();
}
ChessGame.prototype.stageClick=function(event){
    //目标处没棋子点击棋子
    var tempx,tempy;
    tempx=parseInt(Math.floor((event.offsetX-this.border+this.rect/2)/this.rect));
    tempy=parseInt(Math.floor((event.offsetY-this.border+this.rect/2)/this.rect));
    //防止超出范围
    if(tempx>=this.xnum||tempy>=this.ynum||tempx<0||tempy<0){
        return;
    }
    //首次选择棋子
    if(this.LastChess==null){
        if(this.Map[tempx][tempy]>=0){//当前位置有棋子
            var c=this.chess[this.Map[tempx][tempy]];
            //判断是否为选择方棋子
            if(!this.IsMyChess(c)){
                alert("请选择自己的棋子");
            }else {
                this.LastChess=this.chess[this.Map[tempx][tempy]];
                this.LastChess.drawSelectedChess(ctx);
                this.ChessArea(this.LastChess);
                this.LastChess.showArea(ctx);
                this.ObstacleFlag=false;
            }
        }
    }else {//之前选择过棋子
        if (this.Map[tempx][tempy] >= 0) {//当前位置有棋子
            var c = this.chess[this.Map[tempx][tempy]];
            if (this.ObstacleFlag) {//棋子已完成走子过程，不能更改选中棋子
                alert("不能更改选中棋子");
            }
            else if (this.IsMyChess(c)) {//当前位置为己方棋子，重新选择棋子
                this.Draw();//重画棋子和棋盘
                this.LastChess = this.chess[this.Map[tempx][tempy]];
                this.LastChess.drawSelectedChess(ctx);
                this.ChessArea(this.LastChess);
                this.LastChess.showArea(ctx);
                this.ObstacleFlag = false;
            } else {//当前位置为对方棋子
                this.OpponentOperation(tempx,tempy);//若为吃子游戏，则重写该方法，若为置子游戏，不做操作
            }
        }
        else {//当前选择位置无棋子
            if(this.ObstacleFlag){//完成走子，置放障碍
                if(this.IsAbleToPut(tempx,tempy)){
                    this.PutObstacle(tempx,tempy);
                }
                else{
                    alert("当前位置不符合下棋规则");
                }
            }else{
                if(this.IsAbleToMove(tempx,tempy)){
                    this.MoveChess(tempx,tempy);
                    this.AddOperation();
                }
                else{
                    alert("当前位置不符合下棋规则");
                }
            }
        }
    }
    if(this.IsStep){
        this.IsStep=false;
        this.ObstacleFlag=false;
        this.MapList.push(deepClone(this.Map));
        this.reversePlayer();//改变玩家角色
        this.LastChess=null;
        if(this.GameOver()){
            alert("比赛结束");
        }
    }
    return;
}
//初始化
ChessGame.prototype.initChess=function(){
    //子类重写
}
ChessGame.prototype.drawBoard=function(){
    //子类重写
}
//判断是否符合走法
ChessGame.prototype. IsAbleToPut=function(firstchess,tempx,tempy){
    return false;
}
//判断游戏是否结束
ChessGame.prototype.GameOver=function(){
    //子类重写
}
//目标位置有敌方棋子
ChessGame.prototype.OpponentOperation=function (tempx,tempy) {
    alert("当前位置有对方棋子");
    //子类重写
}
//置放障碍
ChessGame.prototype.PutObstacle=function (tempx,tempy) {
    //子类重写
}
//判断是否越界
ChessGame.prototype.IsBorder=function(tempx,tempy){
    if(tempx>=this.xnum||tempy>=this.ynum||tempx<0||tempy<0){
        return true;
    }else{
        return false;
    }
}
ChessGame.prototype.AddOperation=function () {

}
ChessGame.prototype.AddInitOperation=function () {
}
ChessGame.prototype.AddDrawOperation=function () {

}
ChessGame.prototype.ChessArea=function () {
    
}
//设置画布
var mycanvas=document.getElementById("myCanvas");
var ctx=mycanvas.getContext("2d");
mycanvas.width=600;//设置画布大小
mycanvas.height=600;
//游戏结束停止计时
function StopTime(){
    clearTimeout(game.time);
}
//棋盘点击事件
mycanvas.onclick=function(event){
    if(game.STARTGAME){
        game.stageClick(event);
    }
    else{
        alert("游戏尚未开始");
    }
}
/*
深度拷贝的实现
*/
function deepClone(data){
    var type = getType(data);
    var obj;
    if(type === 'array'){
        obj = [];
    } else if(type === 'object'){
        obj = {};
    } else {
        //不再具有下一层次
        return data;
    }
    if(type === 'array'){
        for(var i = 0, len = data.length; i < len; i++){
            obj.push(deepClone(data[i]));
        }
    } else if(type === 'object'){
        for(var key in data){
            obj[key] = deepClone(data[key]);
        }
    }
    return obj;
}
function getType(obj) {
    var toString = Object.prototype.toString;
    var map = {
        '[object Boolean]': 'boolean',
        '[object Number]': 'number',
        '[object String]': 'string',
        '[object Function]': 'function',
        '[object Array]': 'array',
        '[object Date]': 'date',
        '[object RegExp]': 'regExp',
        '[object Undefined]': 'undefined',
        '[object Null]': 'null',
        '[object Object]': 'object'
    };
    if (obj instanceof Element) {
        return 'element';
    }
    return map[toString.call(obj)];
}