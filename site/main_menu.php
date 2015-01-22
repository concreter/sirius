<a href="#" id="play">Play</a>
<a href="#" id="creategame">Create a game</a>
<script>
$(function(){
	var play = $("#play");
	play.click(function(){
		var data = new Data('play_game', {name : ''});
		sendData(data);
	});

})
</script>