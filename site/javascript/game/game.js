$(function(){
	var host = "ws://localhost:8877";
	var socket = new WebSocket(host);
	if(socket) {
		
		var user_name = $('#hdnSession').data('value');
		loggedToServer = false;
		
		socket.onopen = function(e) {
			
			var data = {
				type : "connection__init",
				data : {
					name : user_name	
				}
			};
			
			var dataString = JSON.stringify(data);
			
			socket.send(dataString);
			
			console.log('Connected');
		};
		
		socket.onmessage = function(e) {
			recievedData = JSON.parse(e.data)
			
			if(recievedData.type == 'connection__init') {
				console.log(recievedData.message);
				if(recievedData.message == 'success') {
					loggedToServer = true;
					alert('U\'ve been successfuly connected to server');
				} else {
					alert('u have a not ended connection to server please disconnect it and try again');
				}
			}
			
			if(loggedToServer){
				// when u are successfully logged to server and u are indexed there
				// everything after indexing is here
				switch(recievedData.type){
					case 'clients_list':
						console.log(recievedData.message);
						break;
					case 'connection__init':
						break;
					default:
						console.log(
							'I\'ve got some unknow type of message from server : ' + recievedData.message
						);
						socket.close();
				}
				// here it ends
			}
			
		}
		
	} else {
		alert('your "browser" doesnt support websocket');
	}
})