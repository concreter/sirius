var host = "ws://localhost:8877",
	socket,
	user_name,
	login_success = false;

function init_socket(){
	
	session = document.getElementById('hdnSession');
	user_name = session.getAttribute('data-value');
	
	socket = new WebSocket(host);
	
	set_lobby_handlers();

}

var set_lobby_handlers = function(){

	socket.onopen = lobbyHandlers.onopen;
	socket.onmessage = lobbyHandlers.onmessage;
	socket.onclose = lobbyHandlers.onclose;

};

var set_game_handlers = function(){
	
};


var lobbyHandlers = {
	
	onopen : function(e){
		var data = new Data('connection__init', {name : user_name});
		sendData(data);
	},
	onmessage : function(e){
		var message = JSON.parse(e.data);
		if(message.type == 'connection__init'){
			connection__init(message.message);
		} else if(message.type == 'game_join'){
			game_join();
		}
	},
	onclose : function(e){
		if(login_success != false) {
			init_socket();
		}
	}
	
};

function connection__init(e){
	if(e == 'success'){
		login_success = true;
		console.log("successfully connected");
		lobby();
	} else {
		socket.close();
	}
};

function game_join(e){
	
};

function Data(type, message){

	this.type = type;
	this.data = message;
	
};

function sendData(data){
	
	var JSONdata = JSON.stringify(data);
	socket.send(JSONdata);
	
};
