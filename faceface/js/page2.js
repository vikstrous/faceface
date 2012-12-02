var upload;
(function () {
    "use strict";

    var $ = function (selector) {
        return WinJS.Utilities.query(selector);
    };

    upload = function (data) {
        //var buf = new Buffer($('.test').get(0).src.replace(/^data:image\/\w+;base64,/, ""), 'base64');
        var base64 = Canvas.getDataURL().replace(/^data:image\/\w+;base64,/, "");

        var oMyFormData = new FormData();

        var data = {
            key: "e07cb22d6fa0d570b7804d4510ce75d1",
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


        $('.upring').removeClass('hidden');
        $('#upload_button').addClass('hidden');
        setTimeout(function () {
            $('.upring').addClass('hidden');
            $('#upload_success').removeClass('hidden');
            $('#upload_button').addClass('hidden');
            setTimeout(function () {
                $('.upring').addClass('hidden');
                $('#upload_success').addClass('hidden');
                $('#upload_button').removeClass('hidden');
            }, 2000);
        }, 5000);
        WinJS.xhr({
            url: "http://api.imgur.com/2/upload.json",
            type: "post",
            data: oMyFormData
        }).then(function (xhr) {
            var imgr_url = JSON.parse(xhr.response).upload.links.original;
            var oMyFormData2 = new FormData();
            var data = {
                access_token: App.auth.token,
                url: imgr_url//,
                //message: 'This is a mashup of @[' + selectedFriends[0].id + ':' + selectedFriends[0].name + '] and @[' + selectedFriends[1].id + ':' + selectedFriends[1].name + ']'
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