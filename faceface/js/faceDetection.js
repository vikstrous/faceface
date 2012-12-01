var api_key = 'cGpsb2duYzBqc2E2eWd2dXJ5dTBlcmhnZms2aDMyOmEyNTgzOTk3OGZiN2NjMjc2ZGQ4OWQ1OTIyOGE1MjVjNWE0Zjg4ODY=';

var FaceDetector = {};

(function () {
    var isArray = Array.isArray;

    FaceDetector.getFace = function(url_or_urls) {
        var img_url;
        if (isArray(url_or_urls)) {
            img_url = url_or_urls.join(',');
        } else {
            img_url = url_or_urls;
        }
        var base_url = 'https://lambda-face-detection-and-recognition.p.mashape.com/detect';
        return WinJS.xhr({
            url: img_url,
            headers {
                'X-MASHAPE-AUTHORIZATION': api_key
            },
            data: {
                images: img_url
            }
        });
    };
})();
