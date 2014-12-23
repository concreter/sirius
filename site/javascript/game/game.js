$(function(){
	var host = "ws://localhost:8877";
	var socket = new WebSocket(host);
	if(socket) {
		
		var user_name = $('#hdnSession').data('value');
		
		socket.onopen = function (e) {
			
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
		
	} else {
		alert('your "browser" doesnt support websocket');
	}
})