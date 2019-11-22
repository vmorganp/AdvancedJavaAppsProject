
var urlParams = new URLSearchParams(window.location.search);
var gameState = null;
var cardURL = 'https://raw.githubusercontent.com/TheHumanGiraffe/AdvancedJavaAppsProject/master/web/gameBoard/cards/';

$(document).ready(function() {
	$("#echoText").val('');
});

if(urlParams.has('roomNumber')){
	var roomNumber = urlParams.get('roomNumber')
}else{
	var roomNumber = "TheWrongRoom"
}
if(urlParams.has('game')){
	var game = urlParams.get('game');
}else{
	var game = 'loser'
}

var webSocket = new WebSocket("ws://localhost:8080/AdvancedJavaAppsProject/vcasino/"+game+"/"+roomNumber);
//var webSocket = new WebSocket("ws://ec2-3-89-73-209.compute-1.amazonaws.com:8080/webSocketTest4/websocketendpoint");

// var echoText = document.getElementById("echoText");
// echoText.value = "";

// var message = document.getElementById("message");
webSocket.onopen = function(message){ wsOpen(message);};
webSocket.onmessage = function(message){ wsGetMessage(message);};
webSocket.onclose = function(message){ wsClose(message);};
webSocket.onerror = function(message){ wsError(message);};

function placeBet(){
	var betInput = document.getElementById("betValue").value
	if(!isNaN(betInput)){
		var jsonText ='{ "action":"bet", "arg0":' + betInput + '}'
	}

	wsSendMessage(jsonText);
}

function fold(){
	var jsonText = '{"action":"fold"}';
	wsSendMessage(jsonText);
}

function drawCard(){
	var jsonText ='{ "action":"draw"}'
	wsSendMessage(jsonText);
}

function playCard(card){
	var jsonText ='{ "action":"draw", "arg0": "'+card+'"}'
	wsSendMessage(jsonText);
}

function getWinner(){
	var jsonText ='{ "action":"winner"}'
	wsSendMessage(jsonText);
}

function renderGamestate(gamestate) {
	var player1div = document.getElementById('player1Div');
	var player2div = document.getElementById('player2Div');
	var player3div = document.getElementById('player3Div');
	var player4div = document.getElementById('player4Div');

	var player1info = document.getElementById('player1info');
	var player2info = document.getElementById('player2info');
	var player3info = document.getElementById('player3info');
	var player4info = document.getElementById('player4info');
	
	if(gamestate==null)
		return;
	
	player1div.innerHTML = "";
	player2div.innerHTML = "";
	player3div.innerHTML = "";
	player4div.innerHTML = "";
	
	player1info.innerHTML = "";
	player2info.innerHTML = "";
	player3info.innerHTML = "";
	player4info.innerHTML = "";
	
	gameState = gamestate; //save it for lates
	
	var currentPlayer = gamestate.players[gamestate.visible];
	console.dir(gamestate);
	console.dir(currentPlayer);
	console.dir(currentPlayer.hand);
	
	

	
	if(currentPlayer.hand.length>0) {
		console.dir(currentPlayer.hand[0]);
		console.log(currentPlayer.hand[0].cardID);
	} else {
		echoText.value += "Waiting for players...\n";
	}

	var playerCount = gamestate.length;
	var players = gamestate.players;

	document.getElementById("discard").src = cardURL + gamestate.deck.discards[0].cardID + '.jpg';
	document.getElementById("pot").innerHTML="<h1>Pot Size: " + gamestate.potSize + "</h1>";
	
	players.forEach(function(player){
		if(player.isTurn){
			document.getElementById("currentPlayer").innerHTML = "<h1>Current Player: " + player.name + "</h1>";
		}
	});

	currentPlayer.hand.forEach(function(card) {
		var img = document.createElement("img");
		img.src = cardURL + card.cardID + ".jpg";
		img.className = "p1";
		player1div.appendChild(img);
	})
	
	var text = document.createElement("h3");
	text.innerHTML = "Player: " + currentPlayer.name + "  Chips: " + currentPlayer.chips;
	player1info.appendChild(text);

	players.splice(gamestate.visible, 1);

	var iterator = 2;
	players.forEach(function(player) {
		console.log(player);

		var workingDiv = document.getElementById('player' + iterator + 'Div');
		var workingInfo = document.getElementById('player' + iterator + 'info');
		
		player.hand.forEach(function(card){
			var img = document.createElement("img");
			img.src = cardURL + card.cardID + ".jpg";
			img.className = "p" + iterator;
			workingDiv.appendChild(img);
		});
		
		if(iterator == 3){
			var text = document.createElement("h3");
			text.innerHTML = "Player: " + player.name + "  Chips: " + player.chips;
			workingInfo.appendChild(text);
		} else {
			var playerName = document.createElement("h3");
			playerName.innerHTML = "Player: " + player.name;
			
			var playerChips = document.createElement("h3");
			playerChips.innerHTML = "Chips: " + player.chips;
			
			workingInfo.appendChild(playerName);
			workingInfo.appendChild(playerChips);
		}
		
		iterator++;
	});


	/*var player2Cards = document.getElementById("player2Table");


    	for(i = numberOfCardsInBlindHands[0]; i > 0; i --){
    		player2Cards.deleteRow(i-1);
        	var cardRow = player2Cards.insertRow(i-1);
    		var x=cardRow.insertCell(-1);
            x.innerHTML ="<img class=\"p2\" src=\"cards/0.jpg\"/>";

    	}
    	player2Cards.insertRow(numberOfCardsInBlindHands[0]);*/

	// echoText.value += "Message received from the server : " + message.data + "\n";
}

function wsOpen(message){
	// echoText.value += "Connecting ... \n";
}
function wsSendMessage(jsonText){
	// webSocket.send(message.value);
	// webSocket.send(json);
	webSocket.send(jsonText);
	// echoText.value += "Message sent to the server : " + message.value + "\n";
	// message.value = "";
}
function wsCloseConnection(){
	webSocket.close();
}
function wsGetMessage(message){

	console.dir(message);
	console.dir(message.data);

	var json = JSON.parse(message.data);

	console.dir(json);

	if(json["message"] != null) {
		
		//alert(json.message.text);
		echoText.value += "ALERT: "+json.message.text+"\n";
	} else if(json["chat"] != null) {
		echoText.value += json.chat.Player+": "+json.chat.text+"\n";
	} else {
	
		renderGamestate(json.gamestate);
	}
}
function wsClose(message){
	// echoText.value += "Disconnect ... \n";
}

function wsError(message){
	//echoText.value += "Error ... \n";
}