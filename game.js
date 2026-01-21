scr="menu.html"
var canvas, ctx, objbom, objruim, objespecial, player;
window.onload = function () {
		
	// referencia do teclado e posicoes iniciais do player
	document.onkeydown = readKeyboard;
	var x = 575;
	var y = 500;
	var left = 39;
	var right = 37;
	
	//nivel do jogo
	var qs = GetString();

		if(qs["nivel"]=="facil"){
			level = 1;
		}

		if(qs["nivel"]=="medio"){
			level = 2;
		}

		if(qs["nivel"]=="dificil"){
			level = 3;
		}
			
	// seleciona um tipo aleatorio de objeto
	var t;

	// referência do canvas
	var canvas=document.getElementById("canvas");
	var ctx=canvas.getContext("2d");
	
	// referência das imagens de objeto
	var objbom=document.getElementById('imgObjbom');
	var objruim=document.getElementById('imgObjruim');
	var objespecial=document.getElementById('imgObjespecial');
		
	// desenha um novo objeto em Y = -5
	var spawnLineY=-5;

	// desenha um novo objeto a cada X tempo
	var initial = 500;
	var special = 100;
	var spawnRate=initial/level;
			
	// tipo de spawn
	var spawnType="aleatorio";

	// velocidade de queda do objeto
	var spawnRateOfDescent=1*level;
	
	// ultimo objeto gerado
	var lastSpawn=-1;
	
	// guarda os objetos gerados
	var objects=[];

	// salva o tempo (usado para calcular o tempo gasto)
	var startTime=Date.now();

	// inicia a animação
	animate();
			
	// variavel da pontuacao
	var score=0;
			
	// variavel de tempo
	var timer = setInterval(updateTime, 1000, -1);
	var counter = 60;
			
	// sorteia o tipo do objeto e cria objetos de cor X
	function spawnRandomObject(){
		if (spawnType == "aleatorio"){
			if (Math.random()<0.35) {
				t="red";
			}
			else if (Math.random()>=0.35 && Math.random() < 0.85){
				t="blue";
			}
			else if (Math.random() >= 0.85){
				t="green";
			}
		}
		else {
			t=spawnType;
		}
	
		// cria um novo objeto
		var object={
		
			// define o tipo de objeto
			type:t, 
			
			// define o valor de x ao menos 15x distante das bordas
			x:Math.random()*(canvas.width-30)+15,
			
			// define o Y inicial na linha onde foi definido o objeto
			y:spawnLineY,
		}

		// adiciona o novo objeto ao array objects[]
		objects.push(object);
	}

	function animate(){

		// pega o tempo
		var time=Date.now();

		// checa se é tempo de gerar um novo objeto
		if(time>(lastSpawn+spawnRate)){
			lastSpawn=time;
			spawnRandomObject();
		}

		// pede uma nova animacao
		requestAnimationFrame(animate);

		// limpa o canvas
		ctx.clearRect(0,0,canvas.width,canvas.height);

		// desenha a linha onde os objetos serao gerados
		ctx.beginPath();
		ctx.moveTo(0,spawnLineY);
		ctx.lineTo(canvas.width,spawnLineY);
		ctx.stroke();
	
		// move os objetos no eixo Y do canvas
		for(var i=0;i<objects.length;i++){
			var object=objects[i];
			object.y+=spawnRateOfDescent;
			ctx.beginPath();
			ctx.arc(object.x,object.y,8,0,Math.PI*2);
			ctx.closePath();
			ctx.fillStyle=object.type;
			ctx.fill();
			
			//desenha a imagem sobre o objeto
			if (object.type=="blue"){
				ctx.drawImage(objbom, object.x-20, object.y-20, 40, 40);
			}
			else if (object.type=="red"){
				ctx.drawImage(objruim, object.x-20, object.y-20, 40, 40);
			}
			else {
				ctx.drawImage(objespecial, object.x-20, object.y-20, 40, 40);
			}
					
			//coleta dos objetos
			if (object.x > x && object.x < x+100){
				if (object.y > y && object.y < y+100){
							
					//pontuacao
					if (object.type == "blue"){
						score=score+10;
						
					}
					else if (object.type == "red"){
						score=score-5;
					}
					else {
						greenFunction("blue");
						setTimeout (greenFunction, 10000, "red");
						setTimeout (greenFunctionOff,20000);
					}
							
					//some o objeto
					objects.splice(i,1);
				}
			}
					
		}	
		
		// chama a funcao do player
		player ();
	}
	
	function player (pl){
		// desenha o player na posicao inicial
		var player=document.getElementById('imgPlayer');
		ctx.drawImage(player, x, y, 100, 100);
		scoreFunction();
	}
	
	// move o player
	function readKeyboard (event){
			
		if (event.keyCode==left){
			x=x+10;
		}
				
		else if (event.keyCode==right){
			x=x-10;
		}
				
		// impede o personagem de sair do canvas
		if (x > 1100){
			x=1100;
		}
					
		else if (x < 0){
			x=0;
		}
	}
	
			
	// funcao objeto bonus
	function greenFunction (tipo){
			
		spawnRate=special/level;
		spawnRateOfDescent=7*level;
		spawnType = tipo;
				
		for (var i=0;i<objects.length;i++){
			objects[i].type = tipo;
		}
	}
	
	
	//	desativa a funcao bonus		
	function greenFunctionOff (){
		
		// retorna para os niveis iniciais do jogo
		spawnRate=initial/level;
		spawnRateOfDescent=1*level;
		spawnType = "aleatorio";
			
		for (var i=0;i<objects.length;i++){
			if (Math.random()<0.35) {
				objects[i].type="red";
			}
			else if (Math.random()>=0.35 && Math.random() < 0.85){
				objects[i].type="blue";
			}
			else {
				objects[i].type="green";
			}
		}
	}
	
	// escreve a pontuacao		
	function scoreFunction (){
		ctx.fillStyle="white";
		ctx.font = "15pt Helvetica";
		ctx.fillText("Pontuação: "+score, 15,30);
		ctx.fillText("Tempo: "+counter, 15, 60);
		
		if (score < 0 || counter <= 0){
			endgame ();
		}
		
		// define o valor do score para ser usado no arquivo endgame.html
		localStorage.setItem("score", score);
	}
	
	//controla o contador	
	function updateTime (segs){
		counter = counter + segs;
	}
	
	function endgame (){
		window.location = "endgame.html";		
	}
	
	//le o nivel de jogo selecionado pelo player
	function GetString(value){
		value = value || window.location.search.substr(1).split('&').concat(window.location.hash.substr(1).split("&"));

		if (typeof value === "string")
			value = value.split("#").join("&").split("&");

		// se não há valores, retorna um objeto vazio
		if (!value) return {};

		var check = {};
		for (var i = 0; i < value.length; ++i) {
			
			// obtem array com valor
			var p = value[i].split('=');

			// se não houver valor, ignora o parametro
			if (p.length != 2) continue;

			check[p[0]] = decodeURIComponent(p[1].replace(/\+/g, " "));
		}
		// retorna o objeto criado
		return check;
	}
}		
