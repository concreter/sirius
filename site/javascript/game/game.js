$(function(){
	
	var status = $('.status'),
		content = $('#content');
	
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
						// after logging in
						loggedToServer = true;
						
						status.addClass('online');
						status.removeClass('offline');
						status.text("online");
						
						// page loading but i need to freeze script until its loaded
						$.ajax({
							url: "/sirius/site/lobby.html",
							success: function(e){
								$("#content").html(e);
							},
							async: false,
							cache: false
						})
						
						groupListRequest();
						
						$('#submit_game').click(function(e){
						
							data = {
								type : 'group__init',
								data : {
									name : $('#game_name').val(),
									type : 'default'
								}
							};
							
							if(data.data.name){
								dataString = JSON.stringify(data);		
							}
							
							socket.send(dataString);
							
							e.preventDefault();
						
						});
									
					} else {
						
						socket.close();
						
						existingConnect = true;
						
						status.text("There is opened connection to server please close it");
						status.addClass('offline');
						status.removeClass('online');
					}
				}

				if(loggedToServer){
					// message handlers accessable after logging in
					switch(recievedData.type){
						case 'groups_list':
							$('#groups').empty();
							console.log(recievedData.message);
							for(var i = 0; i < recievedData.message.length; i++){
								var li = $('<li></li>');
								li.data("id", recievedData.message[i].id);
								li.html(
									recievedData.message[i].name + " | " +
									recievedData.message[i].clients + "&nbsp;&nbsp;&nbsp;"+
									'<a href="#" class="join">join</a>'
								)
								$('#groups').append(li);
							}
							$('.join').click(function(e){
							
								id = $(this).parent().data('id');
								data = {
									type : "group_join",
									data : {
										id : id	
									}
								};
								
								dataString = JSON.stringify(data);
								
								socket.send(dataString);
								
								e.preventDefault();
							
							});
							break;
						case 'group__init':
							if(recievedData.message == 'success'){
								alert('successfuly made group');	
							}
							break;
						case 'group_join':
							if(recievedData.message == 'success'){
								alert('u have been joined');
							}
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
					ConnectServer();
					status.addClass('offline');
					status.removeClass('online');
					status.text("offline");
				}
			}
			
			function groupListRequest(){
				
				var data = {
					type : "groups_list"
				};
				
				dataString = JSON.stringify(data);
				socket.send(dataString);
			}

		} else {
			alert('your "browser" doesnt support websocket');
		}
	}
	
	ConnectServer();

})