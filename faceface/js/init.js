App = new (function () {
    var appID = "108007646034168";
    var auth = new FBAuth.AuthClient(
    {
        appID: appID
    });

    this.init = function () {

        auth.checksavedtoken().then(
        function success(data) {
            // user has a valid token in auth.token
            document.getElementById("user").innerText = auth.user.name;
        },
        function error(e) {
            // no valid token saved, user not logged in
        });

        auth.login().then(
        function success(data) {
            document.getElementById("user").innerText = auth.user.name;
            document.getElementById("expires").innerText = auth.expires.toString();
        },
        function error(e) {
            // login failed, user not logged in
        });
    };
    this.logout = function () {
        auth.logout();
    };
})()