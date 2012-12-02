var upload;
(function () {
    "use strict";

    var $ = function (selector) {
        return WinJS.Utilities.query(selector);
    };

    var dataArray = [
    { title: "Basic banana", text: "Low-fat frozen yogurt", picture: "images/60banana.png" },
    { title: "Banana blast", text: "Ice cream", picture: "images/60banana.png" },
    { title: "Brilliant banana", text: "Frozen custard", picture: "images/60banana.png" },
    { title: "Orange surprise", text: "Sherbet", picture: "images/60orange.png" },
    { title: "Original orange", text: "Sherbet", picture: "images/60orange.png" },
    { title: "Vanilla", text: "Ice cream", picture: "images/60vanilla.png" },
    { title: "Very vanilla", text: "Frozen custard", picture: "images/60vanilla.png" },
    { title: "Marvelous mint", text: "Gelato", picture: "images/60mint.png" },
    { title: "Succulent strawberry", text: "Sorbet", picture: "images/60strawberry.png" }
    ];

    var dataList = new WinJS.Binding.List(dataArray);

    upload = function (data) {
        //var buf = new Buffer($('.test').get(0).src.replace(/^data:image\/\w+;base64,/, ""), 'base64');
        var base64 = Canvas.getDataURL().replace(/^data:image\/\w+;base64,/, "");

        var oMyFormData = new FormData();

        var data = {
            key: "81a894859ee60f798e47c1a837713bc0",
            image: base64
        };
        for (var key in data) {
            oMyFormData.append(key, data[key]);
        }
        //var params = "key=" + data.key + "&image=" + data.image;
        // The file and uri variables are already set by this time. bt is a namespace shortcut 


        /* var bt = Windows.Networking.BackgroundTransfer; 
        var uploader = new bt.BackgroundUploader(); 
        var contentParts = [];  
        // Instead of sending multiple files (as in the original sample), we'll create those parts that 
        // match the POST example for Flickr on http://www.flickr.com/services/api/upload.example.html 
        var part;  
        part = new bt.BackgroundTransferContentPart(); 
        part.setHeader("Content-Disposition", "form-data; name=\"key\""); 
        part.setText("81a894859ee60f798e47c1a837713bc0"); 
        contentParts.push(part);
        part = new bt.BackgroundTransferContentPart(); 
        part.setHeader("Content-Disposition", "form-data; name=\"photo\"; filename=\"TwoFacing\""); 
        part.setHeader("Content-Type", "image/jpeg"); 
        part.setText(atob($('.test').get(0).src.replace(/^data:image\/\w+;base64,/, ""))); 
        contentParts.push(part);
        var upload;
        var promise;
        // Create a new upload operation specifying a boundary string. 
        uploader.createUploadAsync( Windows.Foundation.Uri("http://api.imgur.com/2/upload.json"),
            contentParts, "form-data", "-----------------------------7d44e178b0434")
            .then(function (uploadOperation) {
                // Start the upload and persist the promise          
                upload = uploadOperation;
                promise = uploadOperation.startAsync().then(function () {
                    console.log(JSON.stringify(arguments));
                }, function () {
                    console.log('fail');
                    console.log(JSON.stringify(arguments));
                }, function () {
                    console.log('progress')
                });
            });
        */


        WinJS.xhr({
            url: "http://api.imgur.com/2/upload.json",
            type: "post",
            data: oMyFormData
        }).then(function (xhr) {
            var imgr_url = JSON.parse(xhr.response).upload.links.original;
            var oMyFormData2 = new FormData();
            var data = {
                access_token: App.auth.token,
                url: imgr_url,
                message: 'This is a mashup of @[' + selectedFriends[0].id + ':' + selectedFriends[0].name + '] and @[' + selectedFriends[1].id + ':' + selectedFriends[1].name + ']'
            };
            for (var key in data) {
                oMyFormData2.append(key, data[key]);
            }
            WinJS.xhr({
                url: "https://graph.facebook.com/me/photos",
                type: "post",
                data: oMyFormData2
            }).then(function (test) {
                console.log(test.response);
            }, function (xhr) {
                console.log("failed to upload")
                console.log(xhr.response);
            }, function () {
                console.log("phase 2 spinner");
            });
        }, function (xhr) {
            console.log("failed to upload")
            console.log(xhr.response);
        }, function () {
            console.log("phase 1 spinner");
        });
    };

    // Create a namespace to make the data publicly
    // accessible. 
    var publicMembers =
        {
            itemList: dataList
        };
    WinJS.Namespace.define("DataExample", publicMembers);
    WinJS.UI.processAll().then(function () {
        $('.test').get(0).onclick = upload;
    });

    /*
    WinJS.UI.processAll().then(function () {
        var imageFile = null;
        function pickImageFile() {
            var picker = new Windows.Storage.Pickers.FileOpenPicker();
            picker.fileTypeFilter.replaceAll([".jpg", ".bmp", ".gif", ".png"]);
            picker.pickSingleFileAsync().done(function (file) {
                imageFile = file;
            });
        }

        function shareImageHandler(e) {
            var request = e.request;
            request.data.properties.title = "Share Image Example";
            request.data.properties.description = "Demonstrates how to share an image.";

            // In this example, we use the imageFile for the thumbnail as well.
            request.data.properties.thumbnail = Windows.Storage.Streams.RandomAccessStreamReference.createFromFile(imageFile);
            request.data.setBitmap(Windows.Storage.Streams.RandomAccessStreamReference.createFromFile(imageFile));
        }
        var dataTransferManager = Windows.ApplicationModel.DataTransfer.DataTransferManager.getForCurrentView();
        dataTransferManager.addEventListener("datarequested", shareImageHandler);
        pickImageFile();
    });*/

})();