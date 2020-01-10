## 通用对战平台前端
### 前端逻辑过程
+ 选择棋种，进入大厅
+ 选择创建房间或者选择加入已经创建的房间
+ 选择创建房间，将房间信息传给后端，若创建成功进入房间
+ 加入已创建的房间，向后端发送请求，若请求成功进入房间
+ 进入房间页面，此时尚未开始游戏
+ 尚未开始游戏，对棋盘点击为无效操作
+ 等待双方均点击开始后，计时开始，进行比赛
+ 开始游戏，进行暂停、继续、重新开始、悔棋、导出棋谱、棋子移动等操作  
+ 点击空白区域/棋子，确定当前位置符合规范，进行操作
+ 点击暂停游戏，对棋盘点击为无效操作
+ 点击重新开始，清空信息，重新开始
+ 点击导出棋谱，导出棋谱信息

***

### Room逻辑过程
进入大厅，和服务端建立连接后，服务端返回数据room_list，根据room_list建立已存在的房间列表。用户选择添加房间或者进入房间操作。

#### 涉及的JS方法
| 方法 | 说明 |
| ---- | ---- |
| parseUrl、addScript | 对URL进行解析，引入需要的js（ChessGame） |
| AddRoomTable | 向表格添加房间信息 |
| join | 加入房间 |
| addroom | 获取参数值，添加房间 |
| ShowTable | 根据接收到的room_list，创建房间列表表格 |


#### 与后端的连接
##### 房间列表
|  键   | 值  | 说明 |
|  ----  | ----  | ---- |
| mesg  | room_list ||
| room_list  | [1,2,3,4] | 房间id数组|

##### 添加房间
|  键   | 值  | 说明 |
|  ----  | ----  | ---- |
| mesg  | add_room ||
| type  | amazons |amazons或surakarta|
| args | [10, 10] | 棋盘大小 |
| time | 900 | 时间 (s) |
| order | 1 | 1为先手，2为后手 |

##### 加入房间
|  键   | 值  | 说明 |
|  ----  | ----  | ---- |
| mesg  | join ||
| room_id  | 2 | 房间号 |
| order | 1 | 1为先手，2为后手 |

***

### 棋子移动的逻辑过程
#### 苏拉卡尔塔棋
+ 点击棋子进行选中
+ 点击其他棋子进行更换
+ 点击空白处对棋子进行移动
+ 点击对方棋子进行吃子操作
####亚马逊棋
+ 点击棋子进行选中
+ 点击其他棋子进行更换
+ 点击空白处对棋子进行移动
+ 点击空白处释放障碍

***

###游戏逻辑架构

几个重要的属性值：

    //设置棋子及棋局
        this.chess=[];
        this.Map=[];
        this.MapList = [];
        this.LastChess=null;//用户上次指定的棋子
        this.LocalPlayer=BLACKPLAYER;//记录下棋方
        this.Player=BLACKPLAYER;//所属棋方
        this.GameType=1;//1-人人对弈；2-人机对弈；3-AI对弈
        this.ObstacleFlag=false;
        this.IsStep=false;
        //棋谱导出
        this.history=[];
        this.historyList=[];
        this.step=[]
    }
    ChessGame.prototype.xnum=0;
    ChessGame.prototype.ynum=0;
    ChessGame.prototype.rect=0;
    ChessGame.prototype.border=0;

|  方法名   | 标注  | 描述 |
|  ----  | ----  | ---- |
| onclick  | 棋盘点击事件 | if 轮到己方 and 开始游戏 --> 执行stageClick |
| stageClick  | 坐标转换 | 将画布坐标转换为棋盘坐标，if 没有超出范围 --> 执行PlayGame |
| PlayGame | 对棋盘的操作 | 己方棋子的点击、空白区域的点击BlankOperation、敌方棋子的点击OpponentOperation，见伪代码 |
| OverStep | 判断是否执行完全部过程 | 更改状态值，发送数据，交换执棋方 |
| MoveChess | 移动棋子 | 执行Draw，将坐标存入history |
| Draw | 绘制棋盘和剩余棋子 | 绘制棋盘drawBoard，绘制剩余棋子AddDrawOperation |
| IsBorder | 判断是否越界 | 用于亚马逊棋移动过程画出可行域 |
| IsMyChess | 判断是否为己方棋子 | 用于PlayGame中，对棋子的点击事件进行判断 |
| reversePlayer | 调换下棋方 | 注意调换的值是LocalPlaye:表示当前执棋方，不表示己方 |
| initGame | 初始化棋局和棋子 | 对所有变量赋初值，清空棋谱和棋局历史 |
| drawChess | 绘制全部棋子 | 用于初始化棋局 |
| AIGame | 后端/算法接收数据 |


棋盘点击事件的伪代码如下： 

    PlayGame{
        if首次选择棋子-->判断棋子所属方,选中棋子  
        else if 之前选择过棋子-->  
            if 当前位置有棋子-->
                if 棋子完成走子-->不能更改选中棋子
                else 当前位置为己方棋子-->更换选中棋子
                else 当前位置为敌方棋子-->执行OpponentOperation()
            else 当前位置为空白-->BlankOperation()
        判断是否完成全部操作
    }

判断是否执行完全部过程的伪代码如下：

    OverStep{
        if 完成全部操作（isStep===true）-->
            设置isStep为false
            将棋盘存入棋局历史
            向后端发送坐标变化记录
            将坐标变化记录存入棋谱
            判断比赛是否结束
            改变玩家角色
    }

AIGame源代码：

    AIGame{
        var kw = data.kw;
        if(kw===0){//置放棋子
            var pos1 = new Point();
            pos1.x=data.move.from[1];
            pos1.y=data.move.from[0];
            var pos2 = new Point();
            pos2.x=data.move.to[1];
            pos2.y = data.move.to[0];
            this.PlayGame(pos1.x,pos1.y);
            this.PlayGame(pos2.x,pos2.y);
        }
        else if(kw===1){//置放障碍
            var pos3 = new Point();
            pos3.x=data.move.to[1];
            pos3.y = data.move.to[0];
            this.PlayGame(pos3.x,pos3.y);
        }
    }

***

###棋子逻辑架构

|  参数   | 标注  |
|  ----  | ----  |
| player | 所属棋方：WHITEPLAYER/BLACKPLAYER |
| chessName | 棋子名称 |
| pos | 棋子在棋盘中的位置 |
| x,y | 棋子在画布上的位置 |
| area | 可行走范围 |
| rect | 棋子半径 |
| border | 棋子边界值 |
| selctShape | 设置选中时边框的样式(circular/Square)，默认为圆形 |

注：由于画布(0,0)对应位置并非是棋盘的(0,0)，对于苏拉卡尔塔棋，由于存在轨道因此边距值为最大的轨道半径，对于亚马逊棋，由于棋子的位置在放歌内，棋子圆心位置并非对应棋盘的(0,0)，因此需要添加边距值。

|  方法名   | 标注  | 描述 |
|  ----  | ----  | ---- |
| setPosition | 棋子在棋盘中的具体位置 | 传入参数为对应的棋盘坐标。setPosition添加两类坐标一类为棋盘坐标，一类为对应的画布坐标 |
| showChess | 显示棋子 | 根据棋子在画布中的坐标绘制棋子 |
| drawSelectedChess | 画选中棋子的示意边框线 | 根据棋子形状selctShape不同，绘制出不同的示意边框线 |
| showArea | 显示棋子可移动范围 | 针对亚马逊棋可行范围设定 |

***

###苏拉卡尔塔棋的编写
寄生组合式继承chess
设置苏拉卡尔塔棋的棋子半径rect、边距border、选中形状selctShape,不再添加的属性
寄生组合式继承chessgame
设置苏拉卡尔塔棋的游戏逻辑xnum，ynum，rect，border，添加原型属性：

+ passArc：是否经过圆弧
+ track：存储两轨道坐标数据
+ arclist：存储圆弧坐标数据

注：苏拉卡尔塔棋规则由双向链表DoublyList实现

|  方法名   | 标注  |
|  ----  | ----  |
| initChess | 初始化棋子，并将其添加到棋盘数据Map中 |
| AddInitOperation | 添加初始化操作，初始化轨道坐标initArray（与苏拉卡尔塔棋的走法有关）|
| drawBoard | 绘制棋盘 |
| OpponentOperation | 目标位置有敌方棋子，判断是否能进行吃子操作IsAbleToEat，如果可以移动棋子MoveChess，设置IsStep=true |
| BlankOperation | 目标位置为空白， 判断是否能进行走子操作IsAbleToMove，如果可以移动棋子MoveChess，设置IsStep=true |
| GameOver | 判断游戏是否结束 |


####与规则有关的编写
|  方法名   | 标注  |
|  ----  | ----  |
| initArray | 初始化轨道坐标 |
| IsAbleToEat | 判断是否能执行吃子操作，先判断是否两棋子在同一轨道上，再判断是否可达且是否经过圆弧 |
| IsAbleToMove | 判断逻辑上是否能走子，建立可行域pointArray，判断目标坐标是否在可行域内 |
| searchChess | 判断棋子是否在轨道中，在IsAbleToEat中调用 |
| checkChess | 判断是否可达是否经过圆弧，在IsAbleToEat中调用 |
| searchChessNext | 顺查找判断两棋子间是否有其他棋子是否经过圆弧，在checkChess中调用 |
| searchChessPrevious | 顺查找判断两棋子间是否有其他棋子是否经过圆弧，在checkChess中调用 |
| searchCircle | 判断是否经过圆弧，在searchChessNext和searchChessPrevious中调用 |

***

###亚马逊棋的编写
寄生组合式继承chess
设置亚马逊棋的棋子半径rect、边距border、选中形状selctShape,添加原型属性：

+ obstacle：障碍列表
寄生组合式继承chessgame
设置亚马逊棋的游戏逻辑xnum，ynum，rect，border，添加原型属性：

+ direction：方向
+ area：棋子移动范围
+ obstacle：当前释放的障碍坐标

|  方法名   | 标注  |
|  ----  | ----  |
| initChess | 初始化棋子，并将其添加到棋盘数据Map中 |
| AddInitOperation | 添加初始化操作，初始化八个走子方向InitDirection（与亚马逊棋塔棋的走法有关）|
| drawBoard | 绘制棋盘 |
| BlankOperation | 目标位置为空白， 判断进行走子操作还是置换操作，见伪代码 |
| GameOver | 判断游戏是否结束 |

目标移动位置为空白的操作：

    BlankOperation{
        if 棋子完成走子-->
            if 当前位置符合置放障碍的规则-->置放障碍，往坐标移动记录中添加障碍坐标记录
            else-->给出提示信息“当前位置不符合释放障碍的规则”  
        else 棋子未完成走子-->
            if 当前位置符合走子的规则-->移动棋子、设置并显示可置放障碍的范围
            else-->给出提示信息“当前位置不符合移动棋子的规则”


####与规则有关的编写
|  方法名   | 标注  |
|  ----  | ----  |
| IsAbleToPut | 判断是否可以置放障碍 |
| IsAbleToMove | 判断棋子是否可以移动 |
| PutObstacle | 置放障碍 |
| ChessArea | 棋子的移动/释放障碍范围 |

***

###与后端程序的对接
|  方法名   | 标注  |
|  ----  | ----  |
| onopen | 建立连接 ，向后端发送建立连接请求 |
| SendData | 发送坐标变化数据 |
| AddRoom | 添加房间 |
| JoinRoom | 加入房间 |
| SendStart | 点击开始 |
| RollBack | 悔棋 |
| onmessage | 接收信息 |

onmessage代码给出：

    socket.onmessage = function (event) {
    var data;
    let reader = new FileReader();
    reader.onload = () => {
        data = reader.result;
        data = JSON.parse(data);
        if (data.mesg === 'move') {//移动
            game.AIGame(data);
            data.playerId = player;
            notifyClient(JSON.stringify(data));
        }
        else if (data.mesg === 'add_room') {//进入房间
            var type = data.type;
            player = data.playerId;
            setOrder(data.order);
            $('.room').removeClass('active').removeClass('show').addClass('hide');
            $('.game-room').removeClass('hide').addClass('active').addClass('show');
        }
        else if (data.mesg === 'join') {//加入房间
            var type = data.type;
            player = data.playerId;
            setOrder(data.order);
            $('.room').removeClass('active').removeClass('show').addClass('hide');
            $('.game-room').removeClass('hide').addClass('active').addClass('show');
        }
        else if (data.mesg === 'room_list') {//连接成功返回房间列表
            var room_list = data.room_list;
            ShowTable(room_list);
        }
        else if (data.mesg === 'start') {
            StarGame();
            var btnVal = document.getElementById("startbtn");
            btnVal.value = "  Stop Game  ";
            notifyClient('start');
        }
    };
    reader.readAsText(event.data);
    };


####api文档

##### 开始

|  键   | 值  | 说明 |
|  ----  | ----  | ---- |
| mesg  | start ||

###### 返回值
|  键   | 值  | 说明 |
|  ----  | ----  | ---- |
| state  | ready | 如果对方没有开始则返回ready,否则返回start |

##### 移动
|  键   | 值  | 说明 |
|  ----  | ----  | ---- |
| mesg  | move |  |
| location  | {'from': [0, 0], 'to': [1, 1]} | 移动坐标 |
| kw  | 0 | 如果棋种是亚马逊棋, 0为移动棋子, 1为移动障碍; 苏拉卡尔塔棋可空 |

##### 悔棋
|  键   | 值  | 说明 |
|  ----  | ----  | ---- |
| mesg  | rollback |  |

###### 返回值
|  键   | 值  | 说明 |
|  ----  | ----  | ---- |
| board | [[]] | 棋盘 |

##### 房间列表

|  键   | 值  | 说明 |
|  ----  | ----  | ---- |
| mesg  | room_list ||
| room_list  | [1,2,3,4] | 房间id数组|

##### 添加房间

|  键   | 值  | 说明 |
|  ----  | ----  | ---- |
| mesg  | add_room ||
| type  | amazons |amazons或surakarta|
| args | [10, 10] | 棋盘大小 |
| time | 900 | 时间 (s) |
| order | 1 | 1为先手，2为后手 |

##### 加入房间

|  键   | 值  | 说明 |
|  ----  | ----  | ---- |
| mesg  | join ||
| room_id  | 2 | 房间号 |
| order | 1 | 1为先手，2为后手 |

###### 添加和加入房间的返回值

|  键   | 值  | 说明 |
|  ----  | ----  | ---- |
| playerId | 'A' | 玩家ID |

###与博弈程序的对接

    var webSocketServer = require('ws');
    var port = 6666;
    var wss = null;
    window.onerror = function err(msg, url, line) {
        if(msg === 'Uncaught Error: listen EADDRINUSE :::6666')
            wss = new webSocketServer.Server({ 'port': port + 1 });
            wss.on('connection', function connection(ws) {
                ws.send(player);
                ws.on('message', function incoming(mesg) {
                    mesg = JSON.parse(mesg);
                    game.AIGame(mesg);
                })
            })
    }
    wss = new webSocketServer.Server({ 'port': port });
    wss.on('connection', function connection(ws) {
        ws.send(player);
        ws.on('message', function incoming(data) {
            data = JSON.parse(data);
            game.AIGame(data);
        })
    })
    function notifyClient(data) {
        wss.clients.forEach(function each(client) {
            if (client.readyState === WebSocket.OPEN) {
                client.send(data);
            }
        });
    }

### Button

|  方法名   | 标注  | 描述 |
|  ----  | ----  | ---- |
| InitGame | 对开始/继续按钮的操作 | 根据按钮值，对程序进行开始、继续、暂停操作。开始：调用SendStart（后端缺少对继续暂停操作的API，只在前端实现）|
| StarGame | 开始游戏 | 接收到后端返回的state进行调用 |
| StartTime | 开始计时 | 在StartGame中进行调用 |
| ResetGame | 重新开始 | 后端未给出API，仅在前端实现 |
| WithDraw | 悔棋 | 后端未给出API，仅在前端实现 |
| GetBoards | 输出棋谱 | 调用saveAs输出棋谱（该方法在file.js中实现） |
| SetTime | 计算黑方和白方时间 | |




