var tempContext = null, 	//全局Context对象
canvas = null,				/**画布**/
imageObj = null,   			//全局图片对象
imageRotate = null,         //旋转后的图片
oX=null,        			//矩形框X坐标
oY=null,        			//矩形框Y坐标
started=false,  			//标识鼠标移动时是否重绘
n = 0,  					//旋转步骤
width = 0, 					//矩形裁剪框宽度 
height = 0,					//矩形裁剪框高度
imgW = 400, 				//图片的宽
imgH = 550, 				//图片的高 
canvasW = 400, 				//画布的宽
canvasH = 550,				//画布的高 
moveSwitch = false;         //全局开关
var imgStroke = (function(){
	//构造函数   
	function ics(){
		canvas = null; 
		oX = 20; /**加载时矩形左上角的 x 坐标**/
		oY = 20; /**加载时矩形左上角的 y 坐标**/
		width = 320; /**加载时初始化矩形框的宽**/
		height = 400; /**加载时初始化矩形框的高**/
		imageRotate = null;
		moveSwitch = true;
	}  
	/** 
	 * 初始化
	 */
	ics.prototype.init = function(obj){
		/**如果画布有内容则清除**/ 
		if(tempContext){
			clearCanvas();
		} 
		canvas = document.getElementById(obj.canvasId); /**画布**/
		canvas.width = canvasW;
		canvas.height = canvasH; 
		tempContext = canvas.getContext("2d"); 
		var imageUrl = new Image();
		imageUrl.src = obj.url; 
		imageObj = imageUrl; /**图片**/
		if(obj.x)
			oX = obj.x; /**矩形左上角的 x 坐标**/
		if(obj.y)
			oY = obj.y; /**矩形左上角的 y 坐标**/
		if(obj.width) 
			width = obj.width; 
		if(obj.height) 
			height = obj.height; 
		$("#"+obj.canvasId).show();
		/**加载图片并绘制矩形框**/ 
		loadImgRect(oX,oY,"load"); 
		// 鼠标事件 
		canvas.addEventListener("mousedown", doMouseDown, false);  
		canvas.addEventListener('mousemove', doMouseMove, false);  
		canvas.addEventListener('mouseup',   doMouseUp, false); 
		// 触屏事件
		canvas.addEventListener("touchstart",doMouseDown,false);  
		canvas.addEventListener("touchmove",doMouseMove,false);  
		canvas.addEventListener("touchend",doMouseUp,false); 
	}
	/**
	 * 加载图片并绘制矩形框 
	 */
	function loadImgRect(x,y,type){ 
		if(!moveSwitch){
			return;
		}
		/**
		 * 判断移动是否超出画布
		 * 画布的宽度减去裁剪框的宽度得到x坐标在画布中的最大值
		 * 画布的高度减去裁剪框的高度得到y坐标在画布中的最大值 
		 */
		if(x>(canvasW-width)){ x= (canvasW-width); }
		if(y>(canvasH-height)){ y= (canvasH-height); } 
		if(x<0)x=0;if(y<0)y=0;
		
		if((!type||type!="load")&&imageRotate){ 
			  imageObj = imageRotate;
		}     
		oX = x; oY = y; 
		clearCanvas();    
		/**从新设置透明度为1**/
		tempContext.globalAlpha = 1; 
		tempContext.drawImage(imageObj, 0, 0, imgW, imgH);
		tempContext.globalAlpha=0.7;   
		tempContext.fillStyle='#F8F8F8';  
		tempContext.fillRect(x,y,width,height);   
	}            
	/**
	 * 坐标换算
	 * 相对页面来讲：上下为y轴 左右为x轴
	 * 用当前页面的x坐标减去画布与页面左边的距离从而得到当前鼠标在画布中的x坐标 
	 * 用当前页面的y坐标减去画布与页面头部的距离从而得到当前鼠标在画布中的y坐标 
	 * 乘以(canvas.width  / bbox.width)跟(canvas.height / bbox.height)是为了综合画布实际大小而做的一个误差填补计算。画宽高的误差值在2px左右
	 */ 
	function getPointOnCanvas(canvas, x, y) {   
		var bbox = canvas.getBoundingClientRect(); 
		return { x: x - bbox.left * (canvas.width  / bbox.width),  
				y: y - bbox.top  * (canvas.height / bbox.height) };  
	}     
	/**
	 * 清除画布
	 */  
	function clearCanvas() {
		tempContext.clearRect(0, 0, canvasW,canvasH);  
	}          

	/**
	 * 鼠标按下事件
	 */
	function doMouseDown(event) {  
		event.preventDefault();  
		event.stopPropagation(); 
		var x = null,y = null;
		/**获取鼠标相对于文档(页面)的位置**/ 
		if(event.changedTouches){
			x=event.changedTouches[0].pageX;  
			y=event.changedTouches[0].pageY;  
		}else{
			x=event.pageX;    
			y=event.pageY;    
		}  
		var canvas = event.target;  
		var loc = getPointOnCanvas(canvas, x, y);  
		/**加载图片并绘制矩形框**/
		loadImgRect(loc.x, loc.y);
		started = true;  
	}  
	/**   
	 * 鼠标移动事件
	 */
	function doMouseMove(event) {  
		event.preventDefault();  
		event.stopPropagation();
		var x = null,y = null;
		/**获取鼠标相对于文档(页面)的位置**/
		if(event.changedTouches){
			x=event.changedTouches[0].pageX;  
			y=event.changedTouches[0].pageY;  
		}else{
			x=event.pageX;     
			y=event.pageY;    
		}
		var canvas = event.target;  
		var loc = getPointOnCanvas(canvas, x, y);  
		if (started) {    
			/**加载图片并绘制矩形框**/ 
			loadImgRect(loc.x, loc.y);
		}  
	}  
	/**
	 * 鼠标按起事件
	 */
	function doMouseUp(event) {  
		event.preventDefault();  
		event.stopPropagation(); 
		if (started) {  
			doMouseMove(event);   
			started = false;  
		}   
	} 

	/**确认裁剪**/
	ics.prototype.getImageData=function(id){
		if(!moveSwitch){
			return; 
		}
		if(imageRotate){
			  imageObj = imageRotate;
		}    
		/**去掉裁剪框填充背景色**/
		clearCanvas();  
		/**恢复默认透明度为不透明**/
		tempContext.globalAlpha = 1; 
		tempContext.drawImage(imageObj, 0, 0, imgW, imgH);
		tempContext.strokeStyle="#FFFFFF";
		tempContext.strokeRect(oX,oY,width,height); 
		/**获取数据**/        
		var data = tempContext.getImageData(oX,oY,width,height);
		var canvasTow = document.getElementById("myCanvasTow");
		var ctxTow = canvasTow.getContext("2d");  
		ctxTow.putImageData(data,0,0);   
		var imgData = canvasTow.toDataURL();
		loadImgRect(oX,oY);       
		lrz(imgData, {     
			width:width, 
			height:height,    
			// 压缩开始 
			before: function() {
				console.log('压缩开始');
			},
			// 压缩失败 
			fail: function(err) {
				console.error(err);
			},
			// 压缩结束（不论成功失败）
			always: function() {
				console.log('压缩结束');
			},
			// 压缩成功
			done: function (results) {
				$("#"+id).show();
				$("#"+id).attr("src",results.base64);
				moveSwitch = false;
				$("#buttonId").hide();
				$("#resetId").show();
			}           
		}); 
	}  

	/**旋转**/ 
	ics.prototype.rotate=function(arr){
		if(!moveSwitch){
			alert('请点击重置按钮');
			return; 
		}
		imgRotate(arr); 
	} 

	/**
	 * 旋转图片并绘制矩形框 
	 */  
	function imgRotate(arr){ 
		clearCanvas();     
		if(n== null) n=0;
		if(arr=='left'){   
			(n==0)? n=3:n--;
		}else if(arr=='right'){
			(n==3)? n=0:n++;
		}
		switch(n) {  
		default :  
		case 0 : 
			canvas.width = canvasW;
			canvas.height = canvasH; 
			tempContext.rotate(0 * Math.PI / 180);
			tempContext.drawImage(imageObj, 0, 0,canvasW,canvasH);
			createCanvas(canvasW,canvasH);  
			break;  
		case 1 :
			canvas.width = canvasH;
			canvas.height = canvasW;  
			tempContext.rotate(90 * Math.PI / 180);
			tempContext.drawImage(imageObj, 0, -canvasH,canvasW,canvasH);
			createCanvas(canvasH,canvasW);     
			break;   
		case 2 :
			canvas.width = canvasW;
			canvas.height = canvasH;  
			tempContext.rotate(180 * Math.PI / 180);
			tempContext.drawImage(imageObj, -canvasW, -canvasH,canvasW,canvasH);
			createCanvas(canvasW,canvasH); 
			break;
		case 3 :
			canvas.width = canvasH;
			canvas.height = canvasW;  
			tempContext.rotate(270 * Math.PI / 180);
			tempContext.drawImage(imageObj, -canvasW, 0,canvasW,canvasH);
			createCanvas(canvasH,canvasW);
			break;        
		};     
	} 
	
	/**
	 * 将旋转过后的画布内容取出来并重新创建画布 
	 * @param {Object} w 画布的宽
	 * @param {Object} h 画布的高
	 */
	function createCanvas(w,h){
		/**得到旋转后的img对象 —— BUG 在获取到img后，旋转就错乱了**/ 
		var data = tempContext.getImageData(0,0,w,h);
		tempContext.clearRect(0, 0, w,h);   
		/**重设画布的宽高**/  
		canvasH = h;canvasW =w;    
		imgW = w, imgH = h;   
		/**将旋转后的得到的图片覆盖以前的画布**/ 
		canvas = document.getElementById("myCanvas");
		canvas.width = w; 
		canvas.height = h; 
		tempContext = canvas.getContext("2d");  
		tempContext.globalAlpha = 1; 
		tempContext.putImageData(data,0,0); 
		var img = new Image();    
		img.src = canvas.toDataURL();   
		imageRotate = img;  
		tempContext.globalAlpha=0.7;      
		tempContext.fillStyle='#F8F8F8';        
		tempContext.fillRect(oX, oY,width,height);
	}  


	/**缩放**/
	ics.prototype.scale=function(type){
		if(!moveSwitch){
			alert('请点击重置按钮');
			return; 
		}
		if(type=="BIG"){
			imgW = imgW + 10;
			imgH = imgH + 10/imgW*imgH;
		} else { 
			imgW = imgW - 10;  
			imgH = imgH - 10/imgW*imgH;  
		}  
		loadImgRect(oX,oY);  
	}        
	return ics;     
})();  

/*** 加载按钮  */
	    function demo_report() {
	        var li = document.createElement('li');
	        li.className = 'item';
	        li.innerHTML = $("#anniuDiv").html(); 
	        var ul = document.createElement('ul');
	        ul.appendChild(li);  
	        document.getElementById("canvasDivId").appendChild(ul); 
	        $("#buttonId").click(function(){ 
				ics.getImageData("cutImgId");  
			}); 
			$("#rotateLeft").click(function(){
				ics.rotate("left"); 
			}); 
			$("#rotateRight").click(function(){
				ics.rotate("right"); 
			});  
			$("#little").click(function(){
				ics.scale("BIG");     
			});
			$("#scale").click(function(){
				ics.scale("little");   
			});   
			$("#affirmId").click(function(){
				ics.getImageData("cutImgId");  
			});
			$("#resetId").click(function(){
				if(confirm("您确定要重置吗？")){
					window.location.reload();
				}
			});
	    } 
