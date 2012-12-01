// For an introduction to the Blank template, see the following documentation:
// http://go.microsoft.com/fwlink/?LinkId=232509
(function () {
    "use strict";

    WinJS.Binding.optimizeBindingReferences = true;

    var app = WinJS.Application;
    var activation = Windows.ApplicationModel.Activation;

    var $ = function (selector) {
        return WinJS.Utilities.query(selector);
    };

    var selectedFriends = {};
    var numSelected = 0;

    app.onactivated = function (args) {
        if (args.detail.kind === activation.ActivationKind.launch) {
            if (args.detail.previousExecutionState !== activation.ApplicationExecutionState.terminated) {
                // TODO: This application has been newly launched. Initialize
                // your application here.
                args.setPromise(WinJS.UI.processAll());
                App.init().then(function (friends) {

                
                var imagesLoaded = function (friends_data) {
                    //var friends_data = App.friends_data;
                    var listView = $('#friends').get(0).winControl;
                    $('#friends').removeClass('hide');
                    var bindingList = new WinJS.Binding.List(friends_data);
                    listView.itemTemplate = $('#friend-template').get(0);
                    listView.itemDataSource = bindingList.dataSource;

                    listView.addEventListener("iteminvoked", function (event) {
                        var index = event.detail.itemIndex;
                        var friend = bindingList.getAt(index);
                        if (selectedFriends[friend.id]) {
                            delete selectedFriends[friend.id];
                            numSelected--;
                        } else {
                            if (numSelected < 2) {
                                selectedFriends[friend.id] = friend;
                                numSelected++;
                            }
                        }
                    });
                };

                });


            } else {
                // TODO: This application has been reactivated from suspension.
                // Restore application state here.
            }

        }
    };

    app.oncheckpoint = function (args) {
        // TODO: This application is about to be suspended. Save any state
        // that needs to persist across suspensions here. You might use the
        // WinJS.Application.sessionState object, which is automatically
        // saved and restored across suspension. If you need to complete an
        // asynchronous operation before your application is suspended, call
        // args.setPromise().
    };

    app.start();
})();

var ThumbnailConverter = WinJS.Binding.converter(
        function (item) {
            return "https://graph.facebook.com/" + item + "/picture";
        }
);
