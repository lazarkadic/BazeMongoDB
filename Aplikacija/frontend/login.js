import {AuthenticationService} from './authservice.js';

$(function(){

    const service = new AuthenticationService();


    $("#btnSubmit").click(function(){       // prvi put radite login sa vrednostima sa forme, ako je proslo redirektuje opet na  
        var user = $("#txtusername").val(); // index.html i vidi se authdata da ima vrednost, a posle se otkomentarise logout
        var pass = $("#txtpass").val();     // i samo pritisne isto dugme na formi bez ikakvih podataka, isto redirektuje i brise authdata
        service.login(user, pass);        
    });
});

