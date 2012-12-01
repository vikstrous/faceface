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
    //var lastSelectionItems = [];
    var lastSelectionIndicies = [];
    var numSelected = 0;
    var currentPage = 0;

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
                    setTimeout(function () {
                        $('.loading').addClass('hidden');
                    }, 300);
                    var bindingList = new WinJS.Binding.List(friends_data);
                    listView.itemTemplate = $('#friend-template').get(0);
                    listView.itemDataSource = bindingList.dataSource;
                    listView.selectionMode = WinJS.UI.SelectionMode.multi;

                    var forcingSelection = false;

                    listView.addEventListener("selectionchanged", function (event) {
                        if (forcingSelection) {
                            forcingSelection = false;
                            return;
                        }
                        //var newSelection = event.detail.newSelection;
                        var newSelection = listView.selection;
                        var newSelectionIndices = newSelection.getIndices();
                        var added = newSelectionIndices.length > lastSelectionIndicies.length
                        var changedIndex;
                        var larger = added ? newSelectionIndices : lastSelectionIndicies;
                        var smaller = added ? lastSelectionIndicies : newSelectionIndices;
                        for (var i = 0; i < larger.length; i++) {
                            var found = false;
                            for (var j = 0; j < smaller.length; j++) {
                                if (larger[i] == smaller[j]) {
                                    found = true;
                                    break;
                                }
                            }
                            if (!found) {
                                changedIndex = larger[i];
                                break;
                            }
                        }

                        if (changedIndex) {
                            if (added) {
                                if (typeof selectedFriends[0] === 'undefined' || typeof selectedFriends[1] === 'undefined') {
                                    numSelected++;
                                }
                                selectedFriends[1] = selectedFriends[0];
                                selectedFriends[0] = bindingList.getAt(changedIndex);
                                selectedFriends[0].dataIndex = changedIndex;
                            } else {
                                if (bindingList.getAt(changedIndex).id == selectedFriends[0].id) {
                                    // Delete numero uno, it's been zapped.
                                    selectedFriends[0] = selectedFriends[1];
                                }
                                delete selectedFriends[1];
                                selectedFriends[1] = undefined;
                                numSelected--;
                            }
                        }

                        var forcedSelectedIndicies = [];
                        if (selectedFriends[0] !== undefined) forcedSelectedIndicies.push(selectedFriends[0].dataIndex);
                        if (selectedFriends[1] !== undefined) forcedSelectedIndicies.push(selectedFriends[1].dataIndex);
                        forcingSelection = true;
                        listView.selection.set(forcedSelectedIndicies);


                        /*
                        var newSelectionCount = newSelection.count();
                        if (newSelectionCount > 2) {
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
                        */
                        //lastSelectionItems = newSelection.getItems();
                        lastSelectionIndicies = forcedSelectedIndicies;

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


                document.getElementById('next-button').addEventListener("click", function (evt) {
                    if (currentPage == 0 && numSelected == 2) {
                        currentPage++;
                        $('#page1').addClass("hidden");
                        $('#page2').removeClass("hidden");
                    //} else if (currentPage == 1) {
                        FaceDetector.doMash(selectedFriends[0], selectedFriends[1]);
                    }

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

function fullImageProfileUrl(friend) {
    return "https://graph.facebook.com/" + friend.id + "/picture?type=large&access_token=" + App.auth.token;
};

