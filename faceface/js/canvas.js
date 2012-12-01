
var Canvas = {};

Canvas.getContext = function(angle, callback) {
    var canvas = document.getElementById('canvas');
    var context = canvas.getContext('2d');
    if (angle === undefined) {
        angle = 0;
    }
    context.save();

    //Do moving stuff in here..
    context.rotate(angle);
    
    //End of moving stuff.

    callback.call(window, context);
    context.restore();
}

Canvas.imageCache = {};

Canvas.drawImage = function(url, opacity, x, y, angle, xWidth, yWidth) {
    if (Canvas.imageCache[url]) {
        var img = Canvas.imageCache[url];
        draw(img, opacity, x, y, angle, xWidth, yWidth);
        return;
    } else {
        opacity = (opacity === undefined) ? 1 : opacity;
        var img = new Image();
        img.onload = (function (url, opacity, x, y, angle, xWidth, yWidth, img) {
            return function() {
                Canvas.imageCache[url] = img;
                Canvas.draw(img, opacity, x, y, angle, xWidth, yWidth);
            };
        })(url, opacity, x, y, angle, xWidth, yWidth, img);
        img.src = url;
    }
}


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
/*
Canvas.drawImage(null, 0.5, 20, 20, Math.PI / 7);
Canvas.drawImage(null, 0.5, 0, 0, 0, 100, 200);
Canvas.drawImage(null, 0.5, -220, -50, Math.PI / 3);
*/


