

Gestures = new (function () {

    this.lastPosition = {};

    this.init = function () {
        var canvas = Canvas.getCanvas();
        /*canvas.addEventListener("MSPointerDown", canvasHandler, false);
        canvas.addEventListener("MSPointerMove", canvasHandler, false);
        canvas.addEventListener("MSPointerUp", canvasHandler, false);
        canvas.addEventListener("MSPointerOver", canvasHandler, false);
        canvas.addEventListener("MSPointerOut", canvasHandler, false);
        canvas.addEventListener("MSPointerCancel", canvasHandler, false);
        */
    }

    this.MSPointerDown = function (evt) {
        var canvas = Canvas.getCanvas();
        canvas.msSetPointerCapture(evt.pointerId);
        brush.currentX = evt.currentPoint.rawPosition.x;
        brush.currentY = evt.currentPoint.rawPosition.y;
        brush.prevX = brush.currentX;
        brush.prevY = brush.currentY;
        brush.started = true;
        brush.over = true;
        if (!animationActive) {
            window.requestAnimationFrame(animationHandler);
            animationActive = true;
        }
    };





})();