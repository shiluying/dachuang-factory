//公共棋子类
var WHITEPLAYER=1;
var BLACKPLAYER=0;
/*参数player指棋手角色选择类型
参数chessName指具体的棋子
参数chesspos指棋子的位置*/
function Point(x,y) {
    this.x=x;
    this.y=y;
}
function Chess(player,chessName,position){
    this.player=player;
    this.chessName=chessName;//黑0-11，红12-23
    this.pos=position;//棋子在棋盘中的位置
    this.x=this.pos.x*this.rect+this.border;
    this.y=this.pos.y*this.rect+this.border;
    this.area=new Array();//可行走范围
}
Chess.prototype.rect=0;//棋子半径
Chess.prototype.border=0;//棋子边界值
Chess.prototype.selctShape="circular"//设置选中时边框的样式(circular/Square)，默认为圆形
//棋子在棋盘中的具体位置
Chess.prototype.setPosition=function(x,y){
    this.pos.x=x;
    this.pos.y=y;
    //坐标换算
    this.x=Math.floor(this.pos.x*this.rect+this.border);
    this.y=Math.floor(this.pos.y*this.rect+this.border);
}
//显示棋子
Chess.prototype.showChess=function(ctx){
    ctx.shadowOffsetX=5;
    ctx.shadowOffsetY=5;
    ctx.shadowBlur=5;
    ctx.shadowColor="rgba(0,0,0,0.5)";
    if(this.player==WHITEPLAYER){
        ctx.beginPath();
        ctx.fillStyle = "white";
        ctx.arc(this.x,this.y,this.rect/2-3,0,Math.PI*2,true);
        ctx.fill();
        ctx.closePath();
    }
    else{
        ctx.beginPath();
        ctx.fillStyle = "black";
        ctx.arc(this.x,this.y,this.rect/2-3,0,Math.PI*2,true);
        ctx.fill();
        ctx.closePath();
    }
    ctx.shadowOffsetX=0;
    ctx.shadowOffsetY=0;
    ctx.shadowBlur=0;
}
//画选中棋子的示意边框线
Chess.prototype.drawSelectedChess=function(ctx){
    ctx.beginPath();
    ctx.lineWidth=3;
    ctx.strokeStyle="#3399FF";
    if(this.selctShape=="Square"){
        ctx.strokeRect(this.x,this.y,this.rect,this.rect);
    }
    else if(this.selctShape=="circular"){
        ctx.arc(this.x,this.y,this.rect/2-3,0,Math.PI*2,true);
    }
    ctx.stroke();
    ctx.closePath();
}
//显示棋子可移动范围
Chess.prototype.showArea = function(ctx){
    for(var i=0;i<this.area.length;i++){
        ctx.lineWidth = 3;
        ctx.strokeStyle="#3399FF";
        ctx.beginPath()
        ctx.strokeRect(this.area[i].x*this.rect,this.area[i].y*this.rect,this.rect,this.rect);
        ctx.stroke();
        ctx.closePath();
    }
}

