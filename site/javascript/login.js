$(function(){
    var log = {
        name : $('#log_name'),
        pass : $('#log_pass'),
        submit : $('#log_submit')
    };
    
    log.submit.click(function(e){
    
        var data = {
            name : log.name.val(),
            pass : log.pass.val()
        };
        
        var state = true;
        
        if(!data.name) {
            log.name.addClass('wrong');
            state = false;
        }
        
        if(!data.pass) {
            log.pass.addClass('wrong');
            state = false;
        }
        
        if(state == true) {
            $.ajax({
                data: data,
                url: "/../sirius/site/php_scripts/login.php",
                type: "POST",
                success : function(e){
                    if(e == 'success') {
                        window.location.replace('/sirius/site/home.php');
                    } else {
                        alert('error: ' + e);
                        log.pass.val('');
                    }
                },
                error : function(e){
                    alert('total bad error ' + e);
                    log.pass.val('');
                }
            });
        }
        
        e.preventDefault();
    });
    

})