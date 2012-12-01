var api_key = '2fd66e20596e45d2baf6c926ae19ac67';
var api_secret = 'b794133d15614ff5aac7f288f641e841';

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
        var base_url = 'http://api.skybiometry.com/fc/faces/detect.json?api_key='
            + (api_key)
            + '&api_secret=' + (api_secret)
            + '&urls=' + img_url;
        return WinJS.xhr({
            type: 'GET',
            url: base_url
        });
    };
})();
