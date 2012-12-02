

Gestures = new (function () {

    this.lastPosition = {};
    this.movingImage = false;

    this.init = function () {
        var canvas = Canvas.getCanvas();
        canvas.addEventListener("MSPointerDown", MSPointerDown, false);
        canvas.addEventListener("MSPointerMove", MSPointerMove, false);
        canvas.addEventListener("MSPointerUp", MSPointerUp, false);
        //canvas.addEventListener("MSPointerOver", canvasHandler, false);
        //canvas.addEventListener("MSPointerOut", canvasHandler, false);
        //canvas.addEventListener("MSPointerCancel", canvasHandler, false);
        
    }

    function MSPointerDown(evt) {
        var currentPosition = { x: evt.currentPoint.rawPosition.x, y: evt.currentPoint.rawPosition.y };
        Gestures.lastPosition = currentPosition;
        Gestures.movingImage = true;
    }

    function MSPointerUp(evt) {
        Gestures.movingImage = false;
    }

    function MSPointerMove(evt) {
        if (!Gestures.movingImage) {
            return;
        }
        var canvas = Canvas.getCanvas();
        canvas.msSetPointerCapture(evt.pointerId);
        var currentPosition = { x: evt.currentPoint.rawPosition.x, y: evt.currentPoint.rawPosition.y };

        if (Gestures.lastPosition.x == undefined || Gestures.lastPosition.y == undefined) {
            Gestures.lasPostition = currentPosition;
            return;
        }
        var delta = { x: currentPosition.x - Gestures.lastPosition.x, y: currentPosition.y - Gestures.lastPosition.y };
        Gestures.lastPosition = currentPosition;

        FaceDetector.position[1].x += delta.x;
        FaceDetector.position[1].y += delta.y;
        FaceDetector.renderMash();
        /*
        if (!animationActive) {
            window.requestAnimationFrame(animationHandler);
            animationActive = true;
        }
        */
    };





})();