

Gestures = new (function () {

    this.lastPosition = {};

    this.init = function () {
        var canvas = Canvas.getCanvas();
        canvas.addEventListener("MSPointerDown", MSPointerDown, false);
        canvas.addEventListener("MSPointerMove", MSPointerMove, false);
        //canvas.addEventListener("MSPointerUp", canvasHandler, false);
        //canvas.addEventListener("MSPointerOver", canvasHandler, false);
        //canvas.addEventListener("MSPointerOut", canvasHandler, false);
        //canvas.addEventListener("MSPointerCancel", canvasHandler, false);
        
    }

    function MSPointerDown(evt) {
        var currentPosition = { x: evt.currentPoint.rawPosition.x, y: evt.currentPoint.rawPosition.y };
        this.lastPosition = currentPosition;
    }

    function MSPointerMove (evt) {
        var canvas = Canvas.getCanvas();
        canvas.msSetPointerCapture(evt.pointerId);
        var currentPosition = { x: evt.currentPoint.rawPosition.x, y: evt.currentPoint.rawPosition.y };
        var delta = { x: currentPosition.x - this.lastPosition.x, y: currentPosition.y - this.lastPosition.y };

        FaceDetector.position[0].x += delta.x;
        FaceDetector.position[0].y += delta.y;
        FaceDetector.renderMash();
        /*
        if (!animationActive) {
            window.requestAnimationFrame(animationHandler);
            animationActive = true;
        }
        */
    };





})();