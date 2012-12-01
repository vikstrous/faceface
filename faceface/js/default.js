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

    var selectedFriends = [];
    var lastSelectionItems = [];
    var lastSelectionIndicies = [];
    var numSelected = 0;

    app.onactivated = function (args) {
        if (args.detail.kind === activation.ActivationKind.launch) {
            if (args.detail.previousExecutionState !== activation.ApplicationExecutionState.terminated) {
                // TODO: This application has been newly launched. Initialize
                // your application here.
                args.setPromise(WinJS.UI.processAll());
                App.init().then(function (friends_data) {
                    console.log(JSON.stringify(friends_data));
                    var listView = $('#friends').get(0).winControl;
                    $('#friends').removeClass('hidden');
                    var bindingList = new WinJS.Binding.List(friends_data);
                    listView.itemTemplate = $('#friend-template').get(0);
                    listView.itemDataSource = bindingList.dataSource;
                    listView.selectionMode = WinJS.UI.SelectionMode.multi;

                    listView.addEventListener("selectionchanged", function (event) {
                        //var newSelection = event.detail.newSelection;
                        var newSelection = listView.selection;
                        var newSelectionCount = newSelection.count();
                        if (newSelectionCount > 2) {
                            //event.detail.preventTapBehavior();
                            newSelection.set(lastSelectionIndicies);
                        } else {
                            var wrappedSelectedFriends = newSelection.getItems()._value
                            selectedFriends = [];
                            for (var i = 0; i < wrappedSelectedFriends.length; i++) {
                                selectedFriends[i] = wrappedSelectedFriends[i].data;
                            }
                          
                            //newSelection.forEachIndex(function (i) {
                            //    selectedFriends.push(bindingList.getAt(index));
                            //});
                            numSelected = newSelectionCount;
                        }
                        lastSelectionItems = newSelection.getItems();
                        lastSelectionIndicies = newSelection.getIndices();

                        /*
                        var index = event.detail.itemIndex;
                        var friend = bindingList.getAt(index);
                        if (selectedFriends[friend.id]) {
                            delete selectedFriends[friend.id];
                            numSelected--;
                            //WinJS.Utilities.removeClass(listView.elementFromIndex(index), "selectedFriend");
                            $('#next-button').setAttribute("disabled", "disabled");
                        } else {
                            if (numSelected < 2) {
                                selectedFriends[friend.id] = friend;
                                numSelected++;
                                //WinJS.Utilities.addClass(listView.elementFromIndex(index), "selectedFriend");
                                if (numSelected == 2) {
                                    $('#next-button').setAttribute("disabled", "");
                                }
                            }
                        }
                        */
                    });

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
            return "https://graph.facebook.com/" + item + "/picture?type=normal&access_token=" + App.auth.token;
        }
);
