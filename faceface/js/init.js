App = new (function () {
    var appID = "108007646034168";
    var secret = "178c5ab69785e52794ad00ba69b00d98";
    var friends_data = [];
    var auth = new FBAuth.AuthClient(
    {
        appID: appID,
        secret: secret
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
            auth.call("me/friends").then(function success(result) {
                try {
                    var res = JSON.parse(result.response);
                } catch (e) {
                    console.log("ahh? response: " + result.response);
                }
                for (var i = 0; i < res.data.length; i++) {
                    var user = res.data[i];
                    (function(user){
                        auth.call(user.id + "/photos").then(function success(result) {
                            try {
                                var res = JSON.parse(result.response);
                            }
                            catch (e) {
                                //return WinJS.Promise.wrapError(e);
                                console.error("ahhh");
                            }
                            var thumb = res.data.picture;
                            var full = res.data.source;
                            var user_obj = { "name": user.name, "id": user.id, "thumb": thumb, "image": full };
                            friends_data.push(user_obj);
                            console.log(user_obj);
                        });
                    })(user);
                }
            });
            
        },
        function error(e) {
            // login failed, user not logged in
        });
    };
    this.logout = function () {
        auth.logout();
    };
})()