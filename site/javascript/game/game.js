$(function(){
	
	var status = $('.status');

	function ConnectServer(){
		
		var host = "ws://localhost:8877";
		var socket = new WebSocket(host);
		
		if(socket) {

			var user_name = $('#hdnSession').data('value');
			loggedToServer = false;
			existingConnect = false;

			socket.onopen = function(e) {

				var data = {
					type : "connection__init",
					data : {
						name : user_name	
					}
				};

				var dataString = JSON.stringify(data);

				socket.send(dataString);

				console.log('Connecting...');
			};

			socket.onmessage = function(e) {
				recievedData = JSON.parse(e.data)

				if(recievedData.type == 'connection__init') {
					console.log(recievedData.message);
					if(recievedData.message == 'success') {
						loggedToServer = true;
						status.addClass('online');
						status.removeClass('offline');
						status.text("online");
					} else {
						socket.close();
						existingConnect = true;
						status.text("There is opened connection to server please close it");
						status.addClass('offline');
						status.removeClass('online');
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
					}
					// here it ends
				}

			}
			
			socket.onclose = function(e) {
				if(existingConnect == false){
					var cs = new ConnectServer();
					status.addClass('offline');
					status.removeClass('online');
					status.text("offline");
				}
			}

		} else {
			alert('your "browser" doesnt support websocket');
		}
	}
	
	var cs = new ConnectServer();

	
})