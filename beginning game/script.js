	var canvas = document.getElementById("mainCanvas");
	var context = canvas.getContext("2d");

	//keyCodes
	var wKey = 87;
	var aKey = 65;
	var sKey = 83;
	var dKey = 68;
	var upKey = 38;
	var downKey = 40;
	var leftKey = 37;
	var rightKey = 39;

	var keys = [];
	var bullets = [];
	var enemies = [];
	var awards = [];
	var bulletDelay = 0;
	var enemyDelay = 0;
	var gradeLevel = 3; // B - 4 : C - 3 : D - 2 : F - 1 : GameOver - 0
	var numawards = 0;
	var width = 500, height = 400, speed = 7, bulletSpeed = 10;
	var score = 0;

	var player = {
		x: 50,
		y: 50,
		width: 20,
		height: 20
	};

	var cube = {
		x: Math.random() * (width - 20),
		y: Math.random() * (height - 20),
		width: 20,
		height: 20
	};
	
	var playerSprite = new Image();
	playerSprite.src = "player.png";

	var bookSprite = new Image();
	bookSprite.src = "book.png";

	var letterASprite = new Image();
	letterASprite.src = "A.png";

	var enemySprite = new Image();
	changeGrade();

	var awardSprite = new Image();
	awardSprite.src = "degree.png";

	window.addEventListener("keydown", function(e){
		console.log(e.keyCode);
		keys[e.keyCode] = true;
	},false);

	window.addEventListener("keyup",function(e){
		delete keys[e.keyCode];
	},false);
	
	
	
	function game(){
		update();
		render();
	}
	function update(){
		if(bulletDelay>0){
			bulletDelay--;
		}
		if(enemyDelay>0){
			enemyDelay--;
		}
		if(keys[wKey] == true) player.y-=speed;
		if(keys[sKey] == true) player.y+=speed;
		if(keys[aKey] == true) player.x-=speed;
		if(keys[dKey] == true) player.x+=speed;
		if(keys[upKey] == true && bulletDelay == 0) pellet(upKey);
		if(keys[downKey] == true && bulletDelay == 0) pellet(downKey);
		if(keys[leftKey] == true && bulletDelay == 0) pellet(leftKey);
		if(keys[rightKey] == true && bulletDelay == 0) pellet(rightKey);

		if(enemyDelay == 0) makeEnemy();

		if(player.x < 0) player.x = 0;
		if(player.x >= width - player.width) player.x = width-player.width;
		if(player.y < 0) player.y = 0;
		if(player.y >= height - player.height) player.y = height - player.height;

		if(collision(player,cube)) processPoint();
	}
	function makeEnemy(){
		id = Math.random();
		rand = true;
		while(rand){
			var enemy = {
				x: Math.random() * (width-10),
				y: Math.random() * (height-10),
				width: 10,
				height: 10
			}
			if(collision(player,enemy))	rand = true;
			rand = false;
		}
		enemies[id] = enemy;
		enemyDelay = 20;
		
		for(var key in enemies){
			context.drawImage(enemySprite,enemies[key].x,enemies[key].y);
		}
	}
	function pellet(direction){
		id = Math.random();
		var bullet = {
			direct: direction,
			x: player.x + 5,
			y: player.y + 5,
			width: 10,
			height: 10
		};
		bullets[id] = bullet;
		bulletDelay = 5;
	}
	function render(){
		context.clearRect(0,0,width,height);
		//BULLETS
		for(var key in bullets){	
			if(bullets[key].direct == leftKey){
				bullets[key].x-=bulletSpeed;
			}if(bullets[key].direct == rightKey){
				bullets[key].x+=bulletSpeed;
			}if(bullets[key].direct == upKey){
				bullets[key].y-=bulletSpeed;
			}if(bullets[key].direct == downKey){
				bullets[key].y+=bulletSpeed;
			}			
			context.drawImage(letterASprite,bullets[key].x,bullets[key].y);
			if(bullets[key].x < 0) delete bullets[key];
			else if(bullets[key].x >= width - bullets[key].width) delete bullets[key];
			else if(bullets[key].y < 0) delete bullets[key];
			else if(bullets[key].y >= height - bullets[key].height) delete bullets[key];
		}
		//PLAYER
		context.drawImage(playerSprite,player.x,player.y);
		

		//Enemy
			

			//Killing enemies
			for(var key in enemies){
				var exists = true;
				for (var key1 in bullets) {
					if(collision(bullets[key1],enemies[key])){
						delete enemies[key];
						exists = false;
						break;
					} 
				}

				//Moving enemies
				if(exists){
					if(player.x > enemies[key].x){
						enemies[key].x+=2;
					}if(player.x < enemies[key].x){
						enemies[key].x-=2;
					}if(player.y > enemies[key].y){
						enemies[key].y+=2;
					}if(player.y < enemies[key].y){
						enemies[key].y-=2;
					}
					//console.log(enemies[key].x + " " + enemies[key].y);
					context.drawImage(enemySprite,enemies[key].x,enemies[key].y);
					//Killing player
					if(collision(enemies[key],player)){ enemies = []; processDamage(); break; };
				}
			}
				for(var key in awards){
					context.drawImage( awardSprite, 20 + awards[key].num * 30, 40);
				}


				//Book
				context.drawImage(bookSprite,cube.x, cube.y);
		//Score
		context.fillStyle = "black";
		context.font = "bold 30px helvetica";
		context.fillText("Knowledge: " + score,10 ,30);
	}
	function processPoint(){
		score+= Math.round(Math.random() * 1000);
		cube.x = Math.random() * (width - 20);
		cube.y = Math.random() * (height - 20);
		if(score > 500 && numawards <= 0){//elementaryschool
			giveAward();
		}if(score > 2000 && numawards <= 1){//middleschool
			giveAward();
		}if(score > 5000 && numawards <= 2){//highschool
			giveAward();
		}if(score > 10000 && numawards <= 3){//masters
			giveAward();
		}if(score > 20000 && numawards <= 4){//phd
			giveAward();
		}if(score > 40000 && numawards <= 5){
			giveAward();
		}
	}
	function processDamage(){
		gradeLevel--;
		changeGrade();
		if(gradeLevel<1){
			GameOver();
		}
	}
	function giveAward(){
		var award = {
			num: numawards
		}
		awards[numawards] = award;
		numawards++;
	}
	function changeGrade(){
		switch(gradeLevel){
			case 3: 
				enemySprite.src = "C.png";
				break;
			case 2:
				enemySprite.src = "D.png";
				break;
			case 1:
				enemySprite.src = "F.png";
				break;
			case 0:
				GameOver();
				break;
		}
	}
	function GameOver(){
		if(numawards > 0){
			var str = "Congratulations you earned your ";
			switch(numawards){
				case 1:		
					str += "Elementary School";
					break;
				case 2:
					str += "Middle School";
					break;
				case 3:
					str += "High School";
					break;
				case 4:
					str += "Bacholor's";
					break;
				default:
					str += "Masters/PHD";
					break;
			}
			str += " degree with the score of: "+score;
			alert(str);
		}else{
			alert("GameOver, you didn't learn much..");
		}
		reset();
	}
	function reset(){
		enemySprite.src = "B.png";
		gradeLevel = 4;
		score = 0;
		enemies = [];
		bullets = [];
		awards = [];
		numawards =0;
		var player = {
			x: 50,
			y: 50,
			width: 20,
			height: 20
		};

		var cube = {
			x: Math.random() * (width - 20),
			y: Math.random() * (height - 20),
			width: 20,
			height: 20
		};
	}
	function collision(first, second){
		return !(first.x > second.x + second.width || 
			second.x > first.x + first.width ||
			first.y > second.y + second.height ||
			second.y > first.y + first.height );
	}
	setInterval(function(){
		game();
	},1000/30)
	if(keys[38]) alert("hello");