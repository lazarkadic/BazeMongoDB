import {AuthenticationService} from './authservice.js';

$(function(){

    const service = new AuthenticationService();


    $("#btnSubmit").click(function(){     
        var user = $("#txtusername").val(); 
        var pass = $("#txtpass").val();   
        service.login(user, pass);        
    });
});

