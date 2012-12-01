var api_key = '2fd66e20596e45d2baf6c926ae19ac67';
var api_secret = 'b794133d15614ff5aac7f288f641e841';

FaceDetector = new (function (module) {
    var isArray = Array.isArray;

    this.doMash = function (friend1, friend2) {
        var self = this;
        /*
        //Do face recognition request
        faceDataRequest = this.getFace([fullImageProfileUrl(friend1), fullImageProfileUrl(friend2)]);
        faceDataRequest.then(function (faceResponse) {
            if (faceResponse.status == 200) {
                var faceData = JSON.parse(faceResponse.responseText);
                console.log(JSON.stringify(faceData));
                if (faceData.photos) {
                    self.calculateMash(faceData.photos[0], faceData.photos[1]);
                }
            }
        });
        */

        //Run test
        this.calculateMash(testFace1, testFace2);
    };

    this.getFace = function(url_array) {
        var img_url = url_array.join(',');
        
        var base_url = 'http://api.skybiometry.com/fc/faces/detect.json?api_key='
            + (api_key)
            + '&api_secret=' + (api_secret)
            + '&urls=' + img_url;
        return WinJS.xhr({
            type: 'GET',
            url: base_url
        });
    };

    function vectorSubtract(a, b) {
        return {x: a.x - b.x, y: a.y - b.y};
    }

    function vectorRotate(v, angle) {
        return {x: Math.cos(angle) * v.x - Math.sin(angle) * v.y, y: Math.sin(angle) * v.x + Math.cos(angle) * v.y };
    }


    this.calculateMash = function (face1, face2) {
        if (!face1 || !face2) {
            return;
        }
        console.log(JSON.stringify(face1));
        console.log(JSON.stringify(face2));

        //Do for first face for each photo for now
        if (face1.tags && face1.tags[0] && face2.tags && face2.tags[0]) {
            var faceValueHelper = function(face) {
                data = {};
                data.leftEye = face.tags[0].eye_left;
                data.rightEye = face.tags[0].eye_right;
                data.mouth = face.tags[0].mouth_center;
                data.eyeLine = vectorSubtract(data.rightEye, data.leftEye);
                data.sigma = Math.atan2(data.eyeLine.y, data.eyeLine.x);
                data.leftEyeR = vectorRotate(data.leftEye, data.sigma);
                data.rightEyeR = vectorRotate(data.rightEye, data.sigma);
                data.mouthR = vectorRotate(data.mouth, data.sigma);
                data.eyewidth = data.rightEyeR.x - data.leftEyeR.x;
                data.faceHeight = data.mouthR.y - data.rightEyeR.y;
                return data;
            };
            var f = [faceValueHelper(face1), faceValueHelper(face2)];
            var dp = []; //delta position ;)
            var ds = []; //delta size
            for (var i = 0; i < 2; i++) {
                dp[i] = {
                    x: Math.min(f[0].mouthR.x, f[1].mouthR.x) - f[i].mouthR.x,
                    y: Math.min(f[0].mouthR.y, f[1].mouthR.y) - f[i].mouthR.y
                }
            }
            for (var i = 0; i < 2; i++) {
                ds[i] = {
                    x: (f[0].eyeWidth + f[1].eyeWidth) / 2 - f[i].eyeWidth,
                    y: (f[0].faceHeight + f[1].faceHeight) / 2 - f[i].faceHeight
                }
            }

            //DO DRAW

        }
        
    };

    var testFace1 = JSON.parse('{"url":"https://graph.facebook.com/508633758/picture?type=large","pid":"F@09d4a7e153d7abaf1783cf6b6f24f688_ae74227cad829","width":180,"height":180,"tags":[{"tid":"TEMP_F@09d4a7e153d7abaf1783cf6b1663f6b5_ae74227cad829_51.67_57.22_0_1","recognizable":true,"uids":[],"confirmed":false,"manual":false,"width":55,"height":55,"center":{"x":51.67,"y":57.22},"eye_left":{"x":67.78,"y":44.44},"eye_right":{"x":37.78,"y":43.89},"mouth_center":{"x":53.89,"y":76.11},"nose":{"x":53.89,"y":65},"yaw":-3,"roll":1,"pitch":0,"attributes":{"face":{"value":"true","confidence":76}}}]}');
    var testFace2 = JSON.parse('{"url":"https://graph.facebook.com/507252634/picture?type=large","pid":"F@057bf0f75f8f55fa341785a43aec4ad2_b9d07627da660","width":180,"height":119,"tags":[{"tid":"TEMP_F@057bf0f75f8f55fa341785a413296693_b9d07627da660_45.00_52.10_0_1","recognizable":true,"uids":[],"confirmed":false,"manual":false,"width":22.22,"height":33.61,"center":{"x":45,"y":52.1},"eye_left":{"x":51.11,"y":44.54},"eye_right":{"x":40,"y":43.7},"mouth_center":{"x":45,"y":62.18},"nose":{"x":46.11,"y":53.78},"yaw":-6,"roll":3,"pitch":0,"attributes":{"face":{"value":"true","confidence":74}}}]}');
})();
