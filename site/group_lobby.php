<div id="group_clients-wraper">
	<h2>Game is about to begin in</h2>
	<h3 id="counter">30s</h3>
	<h4>Players are:</h4>
	<ul id="group_clients">

	</ul>
</div>
<script>
	
	setInterval(function(){ 
		var data = new Data('group_clients');
		sendData(data);
	}, 1000);
	
	$(function(){
	})
</script>