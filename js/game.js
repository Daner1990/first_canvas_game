//添加画布
var canvas = document.createElement('canvas');
var ctx = canvas.getContext('2d');
canvas.width = 512;
canvas.height = 480;
document.body.appendChild(canvas);


//添加背景
//在图片加载未完成情况下进行绘制是会报错的
var bgReady = false;
var bgImage = new Image();
bgImage.onload = function(){
	bgReady = true;
};
bgImage.src = "images/background.png";


//添加hero
//在图片加载未完成情况下进行绘制是会报错的
var heroReady = false;
var heroImage = new Image();
heroImage.onload = function(){
	heroReady = true;
};
heroImage.src = "images/hero.png";


//添加怪兽
//在图片加载未完成情况下进行绘制是会报错的
var monsterReady = false;
var monsterImage = new Image();
monsterImage.onload = function(){
	monsterReady = true;
};
monsterImage.src = "images/monster.png";


//游戏对象hero，monster
//通过移动来控制hero捉取怪兽
//需要掌握hero的坐标点，monster的坐标点
//因为要移动所以还需要掌握hero的px/s每秒的移动像素
//以及monster被抓次数
var hero = {
	x:0,
	y:0,
	speed:200
};

var monster = {
	x:0,
	y:0
}

var monstersCaught = 0;


// 处理按键
//在前端开发中，
//一般是用户触发了点击事件然后才去执行动画或发起异步请求之类的，
//但这里我们希望游戏的逻辑能够更加紧凑同时又要及时响应输入。
//所以我们就把用户的输入先保存下来而不是立即响应。
//为此，我们用keysDown这个对象来保存用户按下的键值(keyCode)，
//如果按下的键值在这个对象里，那么我们就做相应处理
var keysDown = {};

addEventListener("keydown", function (e) {
    keysDown[e.keyCode] = true;
    console.log(keysDown);
}, false);

addEventListener("keyup", function (e) {
    delete keysDown[e.keyCode];
    console.log(keysDown);
}, false);

// 当用户抓住一只怪物后开始新一轮游戏
var reset = function () {
    hero.x = canvas.width / 2;
    hero.y = canvas.height / 2;

    // 将新的怪物随机放置到界面上
    monster.x = 32 + (Math.random() * (canvas.width - 64));
    monster.y = 32 + (Math.random() * (canvas.height - 64));
};

//更新游戏对象的属性
//有点费脑力的或许是这个传入的modifier 变量。
//你可以在main 方法里看到它的来源，
//但这里还是有必要详细解释一下。
//它是基于1开始且随时间变化的一个因子。
//例如1秒过去了，它的值就是1，英雄的速度将会乘以1，
//也就是每秒移动256像素；
//如果半秒钟则它的值为0.5，英雄的速度就乘以0.5
//也就是说这半秒内英雄以正常速度一半的速度移动。
//理论上说因为这个update 方法被调用的非常快且频繁，
//所以modifier的值会很小，
//但有了这一因子后，不管我们的代码跑得快慢，
//都能够保证英雄的移动速度是恒定的。
//现在英雄的移动已经是基于用户的输入了，
//接下来该检查移动过程中所触发的事件了，
//也就是英雄与怪物相遇。这就是本游戏的胜利点，
//monstersCaught +1然后重新开始新一轮。
//32是一边树丛的宽度 64是一边树丛和hero的宽度之和
var update = function (modifier) {
    if (38 in keysDown) { // 用户按的是↑
    	if(hero.y-hero.speed * modifier <= 32){
    		//触边处理
    		hero.y = 32;
    	}else{
    		hero.y -= hero.speed * modifier;
    	}
    }
    if (40 in keysDown) { // 用户按的是↓
    	if(hero.y+hero.speed * modifier >= canvas.height-64){
    		//触边处理
    		hero.y = canvas.height-64;
    	}else{
	        hero.y += hero.speed * modifier;
	    }
    }
    if (37 in keysDown) { // 用户按的是←
    	if(hero.x-hero.speed * modifier <= 32){
    		//触边处理
    		hero.x = 32;
    	}else{
    		hero.x -= hero.speed * modifier;
    	}
    }
    if (39 in keysDown) { // 用户按的是→
    	if(hero.x+hero.speed * modifier >= canvas.width-64){
    		//触边处理
    		hero.x = canvas.width-64;
    	}else{
	        hero.x += hero.speed * modifier;
	    }
    }

    // 英雄与怪物碰到了么？
    if (
        hero.x <= (monster.x + 32)
        && monster.x <= (hero.x + 32)
        && hero.y <= (monster.y + 32)
        && monster.y <= (hero.y + 32)
    ) {
        ++monstersCaught;
        reset();
    }
};

// 画出所有物体
var render = function () {
    if (bgReady) {
        ctx.drawImage(bgImage, 0, 0);
    }

    if (heroReady) {
        ctx.drawImage(heroImage, hero.x, hero.y);
    }

    if (monsterReady) {
        ctx.drawImage(monsterImage, monster.x, monster.y);
    }

    // 计分
    ctx.fillStyle = "rgb(250, 250, 250)";
    ctx.font = "24px Helvetica";
    ctx.textAlign = "left";
    ctx.textBaseline = "top";
    ctx.fillText("Monsterrs caught: " + monstersCaught, 32, 32);
};

// 游戏主函数
var main = function () {
    var now = Date.now();
    var delta = now - then;

    update(delta / 1000);
    render();

    then = now;

    // 立即调用主函数
    requestAnimationFrame(main);
};

// requestAnimationFrame 的浏览器兼容性处理
var w = window;
requestAnimationFrame = w.requestAnimationFrame 
	|| w.webkitRequestAnimationFrame 
	|| w.msRequestAnimationFrame 
	|| w.mozRequestAnimationFrame;

// 少年，开始游戏吧！
var then = Date.now();
reset();
main();

//http://www.cnblogs.com/Wayou/p/how-to-make-a-simple-html5-canvas-game.html
//http://www.paulirish.com/2011/requestanimationframe-for-smart-animating/
//http://www.zhangxinxu.com/wordpress/2013/09/css3-animation-requestanimationframe-tween-%E5%8A%A8%E7%94%BB%E7%AE%97%E6%B3%95/