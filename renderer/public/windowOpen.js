// (function(){
// 	var $oMasking;
// 	var $oWindowContainer;
// 	//打开弹窗方法
// 	$.fn.openWindow = function(setTitle,setContents,setButton){
// 		//拼接弹窗内容，并且在调用打开弹窗方法时将内容塞进body
// 		var _html ='<div class="window-masking"></div>'+
// 		'<div class="window-container fix" id="addNew">'+
// 			'<h2></h2>'+
// 			'<div class="window-content">'+
// 				'<p class="window-text"></p>'+
// 			'</div>'+
// 			'<div class="window-btn fix">'+
// 				'<button class="cancel-button fl"></button>'+
// 				'<button class="confirm-button fr"></button>'+
// 			'</div>'+
// 		'</div>';
// 		//将拼接好的html塞进body里面
// 		$('body').append(_html);
// 		$oMasking = $('.window-masking');
// 		$oWindowContainer = $('.window-container');
// 		//点击按钮关闭弹窗
// 		$('.cancel-button,.confirm-button').on('click',function(){
//             let playerColor = this.textContent;
//             if(playerColor==='Black'){
//                 game.Player=BLACKPLAYER;
//
// 			}else{
//                 game.Player=WHITEPLAYER;
//             }
// 			closeWindow();
// 		});
// 		//设置蒙版展示
// 		modal = new Modal();
// 		modal.setTitle(setTitle);
// 		modal.setContents(setContents);
// 		modal.setButton(setButton);
// 		$oMasking.show();
// 		//设置弹窗面板展示
// 		$oWindowContainer.show();
// 	}
//
//
//     $.fn.chooseType = function(setTitle,setContents,setButton){
//         //拼接弹窗内容，并且在调用打开弹窗方法时将内容塞进body
//         var _html ='<div class="window-masking"></div>'+
//             '<div class="window-container fix" id="addNew">'+
//             '<h2></h2>'+
//             '<div class="window-content">'+
//             '<p class="window-text"></p>'+
//             '</div>'+
//             '<div class="window-btn fix">'+
//             '<button class="fl" style="width: 33.33%"></button>'+
//             '<button class="fc" style="width: 33.33%"></button>'+
//             '<button class="fr" style="width: 33.33%"></button>'+
//             '</div>'+
//             '</div>';
//         //将拼接好的html塞进body里面
//         $('body').append(_html);
//         $oMasking = $('.window-masking');
//         $oWindowContainer = $('.window-container');
//         //点击按钮关闭弹窗
//         $('.fl,.fc,.fr').on('click',function(){
//             let GameType = this.textContent;
//             if(GameType=='人人对弈'){
//                 game.GameType=1;
//             }else if (GameType=='人机对弈'){
//                 game.GameType=2;
//             }else{
//             	game.GameType=3;
// 			}
//             closeWindow();
//         });
//         //设置蒙版展示
//         modal = new TypeModal();
//         modal.setTitle(setTitle);
//         modal.setContents(setContents);
//         modal.setButton(setButton);
//         $oMasking.show();
//         //设置弹窗面板展示
//         $oWindowContainer.show();
//     }
//
//     $.fn.openLogin = function(setTitle,setButton){
//         //拼接弹窗内容，并且在调用打开弹窗方法时将内容塞进body
//         var _html ='<div class="window-masking"></div>'+
//             '<div class="window-container fix" id="addNew">'+
//             '<h2></h2>'+
//             '<div class="window-content">'+
//             '<p class="window-text">' +
//             '用户名：<input type="text" name="username" id="username" style="width:120px"><br></br>'+
//             '用户id：<input type="text" name="userid" id="userid" style="width:120px">'+
//             '</p>'+
//             '</div>'+
//             '<div class="window-btn fix">'+
//             '<button class="cancel-button fl"></button>'+
//             '<button class="confirm-button fr"></button>'+
//             '</div>'+
//             '</div>';
//         //将拼接好的html塞进body里面
//         $('body').append(_html);
//         $oMasking = $('.window-masking');
//         $oWindowContainer = $('.window-container');
//         //点击按钮关闭弹窗
//         $('.cancel-button,.confirm-button').on('click',function(){
//             let username = document.getElementById('username').value;
//             let userid = document.getElementById('userid').value;
//             var usermsg={
//                 username:username,
//                 userid:userid
//             };
//             socket.send(JSON.stringify(usermsg));
//             closeWindow();
//         });
//         //设置蒙版展示
//         modal = new Modal();
//         modal.setTitle(setTitle);
//         modal.setButton(setButton);
//         $oMasking.show();
//         //设置弹窗面板展示
//         $oWindowContainer.show();
//     }
//
//
// 	//关闭弹窗方法
// 	function closeWindow(){
// 		$oMasking = $('.window-masking');
// 		$oWindowContainer = $('.window-container');
// 		//关闭弹窗的时候将蒙版和html从页面中移除掉
// 		$oMasking.remove();
// 		$oWindowContainer.remove();
// 	}
// 	//初始化
// 	var Modal = function () {
// 	    thismodal = $('#addNew');
// 	};
//     var TypeModal = function () {
//         thismodal = $('#addNew');
//     };
// 	//修改内容方法
// 	Modal.prototype = {
// 		setContents:function(obj){
// 			//找到需要修改内容的标签p，获取调用中设置的提示语
// 	    	thismodal.find('p.window-text').html(obj);
// 		},
// 		setTitle:function(obj){
// 			//找到需要修改的弹窗标题，获取调用中设置的弹窗标题
// 			if(obj!=""){
// 				thismodal.find('h2').show().html(obj);
// 			}
// 		},
// 		setButton: function (obj){
// 		    //解析传过来的参数json
// 		    var json=eval(obj);
// 		    	thismodal.find('button.cancel-button').show().html(json[0]);
// 		    	thismodal.find('button.confirm-button').show().html(json[1]);
// 		    }
// 		};
//     TypeModal.prototype = {
//         setContents:function(obj){
//             //找到需要修改内容的标签p，获取调用中设置的提示语
//             thismodal.find('p.window-text').html(obj);
//         },
//         setTitle:function(obj){
//             //找到需要修改的弹窗标题，获取调用中设置的弹窗标题
//             if(obj!=""){
//                 thismodal.find('h2').show().html(obj);
//             }
//         },
//         setButton: function (obj){
//             //解析传过来的参数json
//             var json=eval(obj);
//             thismodal.find('button.fl').show().html(json[0]);
//             thismodal.find('button.fc').show().html(json[1]);
//             thismodal.find('button.fr').show().html(json[2]);
//         }
//     }
// 	})()


//实现弹窗功能，后续对接后端舍弃
