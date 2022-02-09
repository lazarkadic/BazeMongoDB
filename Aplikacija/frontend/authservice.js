export class AuthenticationService {

    setDefaultHeader() {
        $.ajaxSetup({
            headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'}
        });

    }

    BASE_URL = "http://localhost:8080";

    login(username, password) {
        $.ajax({
            type: "POST",
            url: this.BASE_URL + "/login",
            data: { username: username, password: password },
            success: function (data) {
                window.location.href = './profile.html';
                localStorage.setItem('authdata', window.btoa(username + ":" + password));
                localStorage.setItem('user', btoa(username));
            }
        }).done(function () {
        })
            .fail(function () {
                $("#wrongPass").html("Wrong username or password");
            });
    };

    logout() {
        localStorage.removeItem("authdata");
        localStorage.removeItem("user");        
    }
}