var host = "ws://localhost:8873",
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
		} else if(message.type == 'group_join'){
			if(message.message == 'success'){
				game_join();
			}
		} else if(message.type == 'group_clients'){
			groupClients(message.message);
		} else if(message.type == 'game_start'){
			game();
		}
	},
	onclose : function(e){
		if(login_success != false) {
			init_socket();
		}
	}
	
};

function connection__init(e){
	if(e.success == 'true'){
		if(e.game_started == 0){
			console.log("successfully connected");
			lobby();
		}else{
			game();	
		}
	} else {
		socket.close();
	}
};
function game_join(){
	$(function(){
        var content = $('#content');
        content.load("/sirius/site/group_lobby.php");
	});
};

function game(){
	$(function(){
        var content = $('#content');
        content.load("/sirius/site/game.php");
	});
}

function lobby(){
	$(function(){
        var content = $('#content');
        content.load("/sirius/site/main_menu.php");
	});
};

function groupClients(e){
	$(function(){
		var groupClients = $('#group_clients');
		groupClients.html("");
		for(var i = 0; i < e.length; i++){
			groupClients.append('<li>'+e[i]+'</li>');
		}
	});	
};

function Data(type, message){

	this.type = type;
	this.data = message;
	
};

function sendData(data){
	
	var JSONdata = JSON.stringify(data);
	socket.send(JSONdata);
	
};
