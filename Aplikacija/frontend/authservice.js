export class AuthenticationService {

    setDefaultHeader() {
        $.ajaxSetup({
            headers: { 'Authorization': 'Basic ' + localStorage.getItem('authdata'), 
            'Accept': 'application/json',
            'Content-Type': 'application/json'}
        });

    }

    UNsetDefaultHeader() {
        $.ajaxSetup({
            headers: { 'Authorization': ''  }
        });

    }

    BASE_URL = "http://localhost:8080";

    login(username, password) {
        $.ajax({
            type: "POST",
            url: this.BASE_URL + "/login",
            data: { username: username, password: password },
            success: function (data) {
                //console.log(data);
                window.location.href = './profile.html';
                localStorage.setItem('authdata', window.btoa(username + ":" + password));
                localStorage.setItem('user', btoa(username));
            }
        }).done(function () {
            //alert( "second success" );
        })
            .fail(function () {
                //window.location.href = './index.html';
                //alert("FAILLLLLLL");

                $("#wrongPass").html("Wrong username or password");
            });
    };

    logout() {
        localStorage.removeItem("authdata");
        localStorage.removeItem("user");        
    }
}