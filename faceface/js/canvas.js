
var Canvas = {};

Canvas.getContext = function(angle) {
    var canvas = document.getElementById('canvas');
    var context = canvas.getContext('2d');
    if (angle !== undefined) {
        context.rotate(angle);
    }
    return context;
}

Canvas.imageCache = {};

Canvas.drawImage = function(url, opacity, x, y, angle) {
    if (Canvas.imageCache[url]) {
        var img = Canvas.imageCache[url];
        draw(img, opacity, x, y, angle);
        return;
    } else {
        opacity = (opacity === undefined) ? 1 : opacity;
        var img = new Image();
        img.onload = (function(url, opacity, x, y, img) {
            return function() {
                Canvas.imageCache[url] = img;
                Canvas.draw(img, opacity, x, y, angle);
            };
        })(url, opacity, x, y, img);
        img.src = 'http://images.productspec.net/images.ashx?id=41824&amp;type=i&amp;size=m';
    }
}


//
// You should call Canvas.drawImage, not this.
//
Canvas.draw = function (img, opacity, x, y, angle) {
    var context = Canvas.getContext(angle);
    context.drawImage(img, x, y);
}
Canvas.drawImage(null, 1, 0, 0);