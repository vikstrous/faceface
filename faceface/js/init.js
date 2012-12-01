App = new (function () {
    var appID = "108007646034168";
    var secret = "178c5ab69785e52794ad00ba69b00d98";
    var friends_data = [];
    this.friends_data = friends_data;
    var auth = new FBAuth.AuthClient(
    {
        appID: appID,
        secret: secret
    });
    this.auth = auth;

    this.init = function () {

        var promise = new WinJS.Promise(function (comp, err, prog) {

            auth.checksavedtoken().then(
            function success(data) {
                // user has a valid token in auth.token
                document.getElementById("user").innerText = auth.user.name;
                friends_data = JSON.parse(localStorage.getItem('friends_data'));
                return comp(friends_data);
            },
            function error(e) {
                // no valid token saved, user not logged in

                console.log('start');
                auth.login().then(function success(data) {
                    document.getElementById("user").innerText = auth.user.name;
                    document.getElementById("expires").innerText = auth.expires.toString();
                
                    auth.call("me/friends").then(function success(result) {
                        try {
                            var friends_json = JSON.parse(result.response);
                        } catch (e) {
                            console.log("ahh? response: " + result.response);
                            err(e);
                        }
                        localStorage.setItem('friends_data', JSON.stringify(friends_json.data));
                        comp(friends_json.data);
                        /*for (var i = 0; i < friends_json.data.length; i++) {
                            var user = friends_json.data[i];
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
                                    console.log(thumb);
                                    var full = res.data.source;
                                    console.log(full);
                                    var user_obj = { "name": user.name, "id": user.id, "thumb": thumb, "image": full };
                                    friends_data.push(user_obj);
                                    if (friends_data.length == friends_json.data.length) {
                                        localStorage.setItem('friends_data', JSON.stringify(friends_data));
                                        comp(friends_data);
                                    }
                                });
                            })(user);
                        }*/
                    });
                },
                function error(e) {
                    // login failed, user not logged in
                    err(e);
                });
            });
        });
        return promise;
    };
    this.logout = function () {
        auth.logout();
    };
})()