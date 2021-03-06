
var Canvas = {};

Canvas.clear = function() {
    Canvas.getContext(0, function(context) {
        size = Canvas.getCanvasSize();
        context.clearRect(0, 0, size.x, size.y);
    });
}

Canvas.getContext = function(angle, callback) {
    var canvas = document.getElementById('canvas');
    var context = canvas.getContext('2d');
    if (angle === undefined) {
        angle = 0;
    }
    context.save();

    //context.translate(-canvas.width/2, -canvas.height/2);
    //Do moving stuff in here..
    context.rotate(angle);
    //context.translate(canvas.width/2, canvas.height/2);

    //End of moving stuff.

    callback.call(window, context);
    context.restore();
}

Canvas.imageCache = {};

Canvas.loadImage = function (url) {
    var promise = new WinJS.Promise(function (success, fail, progress) {
        var img = new Image();
        img.onload = function () {
            Canvas.imageCache[url] = img;
            success(url);
        };
        img.src = url;
    });
    return promise;
}
Canvas.drawImage = function (url, opacity, x, y, angle, xWidth, yWidth) {
    var opacity = (opacity === undefined) ? 1 : opacity;
    if (Canvas.imageCache[url]) {
        var img = Canvas.imageCache[url];
        Canvas.draw(img, opacity, x, y, angle, xWidth, yWidth);
        return true;
    } else {
        return false;
    }
}

Canvas.getCanvas = function () {
    return document.getElementById('canvas');
}

Canvas.getCanvasSize = function () {
    var c = Canvas.getCanvas();
    return {
        x: c.width,
        y: c.height
    }
};

//
// You should call Canvas.drawImage, not this.
//
Canvas.draw = function (img, opacity, x, y, angle, xWidth, yWidth) {
    var context = Canvas.getContext(angle, function (context) {
        if (opacity !== undefined) {
            context.globalAlpha = opacity;
        } else {
            context.globalAlpha = 1;
        }
        if (xWidth !== undefined && yWidth !== undefined) {
            context.drawImage(img, x, y, xWidth, yWidth);
        } else {
            context.drawImage(img, x, y);
        }
    });
}

Canvas.getDataURL = function () {
    var canvas = document.getElementById('canvas');
    var context = canvas.getContext('2d');
    return canvas.toDataURL("image/png");
};
/*
Canvas.drawImage(null, 0.5, 20, 20, Math.PI / 7);
Canvas.drawImage(null, 0.5, 0, 0, 0, 100, 200);
Canvas.drawImage(null, 0.5, -220, -50, Math.PI / 3);
*/


