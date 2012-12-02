var api_key = '2fd66e20596e45d2baf6c926ae19ac67';
var api_secret = 'b794133d15614ff5aac7f288f641e841';

FaceDetector = new (function (module) {
    this.targetEyeWidth = 180; //150 //Pixels
    this.targetFaceHeight = 180; //250 //Pixels
    this.targetMouthPosition = function () {
        var canvasSize = Canvas.getCanvasSize();
        return { x: canvasSize.x / 2, y: canvasSize.y * 0.7 };
    };

    //Public variables - modify to modify how images are being drawn
    this.position = [];
    this.size = [];
    this.rotation = [];
    this.imageUrls = [];

    this.doMash = function (friend1, friend2) {
        var self = this;

        //Do face recognition request
        /*
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
        this.calculateMash(testFace2, testFace1);
    };

    this.getFace = function(url_array) {
        var base_url1 = 'http://api.skybiometry.com/fc/faces/detect.json?api_key='
            + (api_key)
            + '&api_secret=' + (api_secret)
            + '&urls=' + url_array[0];
        var base_url2 = 'http://api.skybiometry.com/fc/faces/detect.json?api_key='
            + (api_key)
            + '&api_secret=' + (api_secret)
            + '&urls=' + url_array[1];
        return WinJS.Promise.join([WinJS.xhr({
            type: 'GET',
            url: base_url1
        }), WinJS.xhr({
            type: 'GET',
            url: base_url2
        })]);
    };

    function vectorSubtract(a, b) {
        return {x: a.x - b.x, y: a.y - b.y};
    }

    function vPM(a, b) {
        return { x: a.x * b.x, y: a.y * b.y };
    }

    function vectorRotate(v, angle) {
        return {
            x: Math.cos(angle) * v.x - Math.sin(angle) * v.y,
            y: Math.sin(angle) * v.x + Math.cos(angle) * v.y
        };
    }

    function drawDude(position, color) {
        var ctx = document.getElementById('canvas').getContext("2d");
        ctx.beginPath();
        ctx.fillStyle = color;
        ctx.arc(position.x, position.y, 5, 0, Math.PI * 2, true);
        ctx.closePath();
        ctx.fill();
    }

    this.calculateMash = function (face1, face2) {
        console.log(JSON.stringify(face1));
        console.log(JSON.stringify(face2));
        if (!face1 || !face2) {
            return;
        }

        //Do for first face for each photo for now
        if (face1.tags && face1.tags[0] && face2.tags && face2.tags[0]) {
            var canvasSize = Canvas.getCanvasSize();
            var faceValueHelper = function (face) {
                var data = {};
                data.face = face;
                data.leftEye = face.tags[0].eye_left;
                data.rightEye = face.tags[0].eye_right;
                data.mouth = face.tags[0].mouth_center;

                //COORD FIX
                var origSize = { x: data.face.width, y: data.face.height };
                var percentFix = vPM(origSize, {x: 0.01, y: 0.01});
                data.leftEye = vPM(percentFix, data.leftEye);
                data.rightEye = vPM(percentFix, data.rightEye);
                data.mouth = vPM(percentFix, data.mouth);
                //COORD FLIP
                //data.leftEye.x = face.width - data.leftEye.x;
                //data.rightEye.x = face.width - data.rightEye.x;
                //data.mouth.x = face.width - data.mouth.x;

                data.eyeLine = vectorSubtract(data.rightEye, data.leftEye);
                data.sigma = - Math.atan2(data.eyeLine.y, data.eyeLine.x) - Math.PI; //MINUS IMPORTANT - TODO MAYBE FIX HALF OF QUADRANTS
                data.leftEyeR = vectorRotate(data.leftEye, data.sigma);
                data.rightEyeR = vectorRotate(data.rightEye, data.sigma);
                data.mouthR = vectorRotate(data.mouth, data.sigma);
                data.eyeWidth = data.leftEyeR.x - data.rightEyeR.x;
                data.faceHeight = data.mouthR.y - data.rightEyeR.y;
                return data;
            };
            var f = [faceValueHelper(face1), faceValueHelper(face2)];
            this.position = [];
            this.size = [];
            this.rotation = [f[0].sigma, f[1].sigma];
            var scale = [];

            //Scale
            for (var i = 0; i < 2; i++) {
                scale[i] = {
                    x: this.targetEyeWidth / f[i].eyeWidth,
                    y: this.targetFaceHeight / f[i].faceHeight
                };
            }
            //New size of image
            for (var i = 0; i < 2; i++) {
                this.size[i] = {
                    x: scale[i].x * f[i].face.width,
                    y: scale[i].y * f[i].face.height
                }
            }
            //New position of image
            var targetMouth = this.targetMouthPosition();
            for (var i = 0; i < 2; i++) {
                this.position[i] = {
                    x: targetMouth.x - f[i].mouthR.x * scale[i].x,
                    y: targetMouth.y - f[i].mouthR.y * scale[i].y
                }
            }

            this.imageUrls = [face1.url, face2.url];

            //DO DRAW
            var self = this;
            WinJS.Promise.join([Canvas.loadImage(face1.url), Canvas.loadImage(face2.url)]).done(function () {
                //setInterval(self.renderMash.bind(self));
                self.renderMash();
            }, 1000);
           
        }

    };

    this.renderMash = function () {
        Canvas.clear();
        //upload();
        var greatSuccess = Canvas.drawImage(this.imageUrls[0], 1, this.position[0].x, this.position[0].y, this.rotation[0], this.size[0].x, this.size[0].y);
        if (greatSuccess) Canvas.drawImage(this.imageUrls[1], 0.5, this.position[1].x, this.position[1].y, this.rotation[1], this.size[1].x, this.size[1].y);
        if (!greatSuccess) {
            //TODO
            //Navigate back or show error or something
        }

        //for (var i = 0; i < 1000; i++) {
        //    drawDude(vectorRotate({ x: 100, y: 100 }, i * 0.01), 'blue');
        //}
        //Canvas.drawImage(face1.url, 0.6, 0/*position[0].x*/, 0/*position[0].y*/, f[0].sigma + 0.1, f[0].face.width, f[0].face.height);//size[0].x, size[0].y);
        //Canvas.drawImage(face1.url, 0.6, 0/*position[0].x*/, 0/*position[0].y*/, f[0].sigma + 0.2, f[0].face.width, f[0].face.height);//size[0].x, size[0].y);

        //var colors = ['red', 'green'];
        //for (var i = 0; i < 2; i++) {
        //    drawDude(f[i].leftEyeR, colors[i]);
        //    drawDude(f[i].rightEyeR, colors[i]);
        //    drawDude(f[i].mouthR, colors[i]);
        //}
        //for (var i = 0; i < 2; i++) {
        //    drawDude(vPM(scale[i], f[i].leftEyeR), colors[i]);
        //    drawDude(vPM(scale[i], f[i].rightEyeR), colors[i]);
        //    drawDude(vPM(scale[i], f[i].mouthR), colors[i]);
        //}
    };

    var testFace1 = JSON.parse('{"url":"https://graph.facebook.com/508633758/picture?type=large","pid":"F@09d4a7e153d7abaf1783cf6b6f24f688_ae74227cad829","width":180,"height":180,"tags":[{"tid":"TEMP_F@09d4a7e153d7abaf1783cf6b1663f6b5_ae74227cad829_51.67_57.22_0_1","recognizable":true,"uids":[],"confirmed":false,"manual":false,"width":55,"height":55,"center":{"x":51.67,"y":57.22},"eye_left":{"x":67.78,"y":44.44},"eye_right":{"x":37.78,"y":43.89},"mouth_center":{"x":53.89,"y":76.11},"nose":{"x":53.89,"y":65},"yaw":-3,"roll":1,"pitch":0,"attributes":{"face":{"value":"true","confidence":76}}}]}');
    var testFace2 = JSON.parse('{"url":"https://graph.facebook.com/507252634/picture?type=large","pid":"F@057bf0f75f8f55fa341785a43aec4ad2_b9d07627da660","width":180,"height":119,"tags":[{"tid":"TEMP_F@057bf0f75f8f55fa341785a413296693_b9d07627da660_45.00_52.10_0_1","recognizable":true,"uids":[],"confirmed":false,"manual":false,"width":22.22,"height":33.61,"center":{"x":45,"y":52.1},"eye_left":{"x":51.11,"y":44.54},"eye_right":{"x":40,"y":43.7},"mouth_center":{"x":45,"y":62.18},"nose":{"x":46.11,"y":53.78},"yaw":-6,"roll":3,"pitch":0,"attributes":{"face":{"value":"true","confidence":74}}}]}');
    var testFace3 = JSON.parse('{"url":"https://graph.facebook.com/504666575/picture?type=large","pid":"F@061fbafb6a9696f1298fcc97377e8daf_f06acc62815f4","width":200,"height":300,"tags":[{"tid":"TEMP_F@061fbafb6a9696f1298fcc9727758217_f06acc62815f4_49.00_50.67_0_1","recognizable":true,"uids":[],"confirmed":false,"manual":false,"width":58.5,"height":39,"center":{"x":49,"y":50.67},"eye_left":{"x":69.5,"y":41.67},"eye_right":{"x":39,"y":39},"mouth_center":{"x":53,"y":65.67},"nose":{"x":56,"y":57.33},"yaw":-11,"roll":3,"pitch":0,"attributes":{"face":{"value":"true","confidence":74}}}]}');
    var testFace4 = JSON.parse('{"url":"https://graph.facebook.com/1659390089/picture?type=large","pid":"F@0c8c8fe67dca62860b8779f41067a7c5_641968dc60c13","width":200,"height":228,"tags":[{"tid":"TEMP_F@0c8c8fe67dca62860b8779f4b492ee2b_641968dc60c13_61.00_38.60_0_1","recognizable":true,"uids":[],"confirmed":false,"manual":false,"width":38.5,"height":33.77,"center":{"x":61,"y":38.6},"eye_left":{"x":62,"y":32.02},"eye_right":{"x":42,"y":36.4},"mouth_center":{"x":60.5,"y":50.88},"nose":{"x":54.5,"y":43.86},"yaw":26,"roll":-23,"pitch":0,"attributes":{"face":{"value":"true","confidence":58}}}]}');
    var testFace5 = JSON.parse('{"url":"https://graph.facebook.com/1658190166/picture?type=large","pid":"F@06690ad63decac9c191725bc7956c037_13701a090acf6","width":180,"height":180,"tags":[{"tid":"TEMP_F@06690ad63decac9c191725bcf5288ced_13701a090acf6_51.67_60.56_0_1","recognizable":true,"uids":[],"confirmed":false,"manual":false,"width":46.11,"height":46.11,"center":{"x":51.67,"y":60.56},"eye_left":{"x":65,"y":51.67},"eye_right":{"x":41.11,"y":47.78},"mouth_center":{"x":50.56,"y":77.22},"nose":{"x":51.11,"y":67.22},"yaw":2,"roll":8,"pitch":0,"attributes":{"face":{"value":"true","confidence":67}}}]}');
})();
