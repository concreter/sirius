$(function(){
    
    var reg_button = $('#register_btn');
    var reg_wraper = $('#register_wraper');
    
    var reg = {
      
        name : $('#reg_name'),
        mail : $('#reg_mail'),
        pass : $('#reg_pass'),
        pass_again : $('#reg_pass_again'),
        submit : $('#reg_submit')
        
    };
    
    reg_button.click(function(e){
    
        reg_wraper.fadeToggle();
        e.preventDefault();
    
    });
    
    $('input').click(function(){
        $(this).removeClass('wrong');
    });
    
    reg.submit.click(function(e){
    
        var state = true;
       
        var data = {
            name : reg.name.val(),
            pass : reg.pass.val(),
            mail : reg.mail.val()
        };
       
        if(!data.name) {
            state = false;
            reg.name.addClass('wrong');
        }
        
        if(!data.mail) {
            state = false;
            reg.mail.addClass('wrong');
        }
        
        if(!data.pass) {
            state = false;
            reg.pass.addClass('wrong');
        }
        
        if(!reg.pass_again.val()) {
            state = false;
            reg.pass_again.addClass('wrong');
        }
       
        if(data.pass != reg.pass_again.val()) {
            state = false;
            reg.pass.addClass('wrong');
            reg.pass_again.addClass('wrong');
        }
        
        if(!validateEmail(data.mail)) {
            state = false;
            reg.mail.addClass('wrong');
        }
        
        if(state == true){
            $.ajax({
                data: data,
                url: "/../sirius/site/php_scripts/register.php",
                type: "POST",
                success : function(e){
                    if(e == 'success') {
                        
                        alert('success!');
                        reg_wraper.hide();
                        reg.pass.val("");
                        reg.pass_again.val("");
                        reg.name.val("");
                        reg.mail.val("");
                        
                    } else {
                        
                        alert('error: ' + e);
                        
                    }
                },
                error : function(e){
                    alert('total bad error ' + e);
                }
            })   
        } else {
            reg.pass.val("");
            reg.pass_again.val("");
        }
       
        e.preventDefault();
    });
    
    
    function validateEmail(email) { 
    var re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(email);
    } 

})