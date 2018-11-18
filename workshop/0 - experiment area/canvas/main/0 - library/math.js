this.averageArray = arr => arr.reduce( ( p, c ) => p + c, 0 ) / arr.length;
this.distanceBetweenTwoPoints = function(a, b){ return Math.pow(Math.pow(a.x-b.x,2) + Math.pow(a.y-b.y,2),0.5) };
this.cartesian2polar = function(x,y){
    var dis = Math.pow(Math.pow(x,2)+Math.pow(y,2),0.5); var ang = 0;

    if(x === 0 ){
        if(y === 0){ang = 0;}
        else if(y > 0){ang = 0.5*Math.PI;}
        else{ang = 1.5*Math.PI;}
    }
    else if(y === 0 ){
        if(x >= 0){ang = 0;}else{ang = Math.PI;}
    }
    else if(x >= 0){ ang = Math.atan(y/x); }
    else{ /*if(x < 0)*/ ang = Math.atan(y/x) + Math.PI; }

    return {'dis':dis,'ang':ang};
};
this.polar2cartesian = function(angle,distance){
    return {'x':(distance*Math.cos(angle)), 'y':(distance*Math.sin(angle))};
};
this.cartesianAngleAdjust = function(x,y,angle){
    var polar = this.cartesian2polar( x, y );
    polar.ang += angle;
    return this.polar2cartesian( polar.ang, polar.dis );
};
this.boundingBoxFromPoints = function(points){
    if(points.length == 0){
        return { topLeft:{x:0,y:0}, bottomRight:{x:0,y:0} };
    }

    var left = points[0].x; var right = points[0].x;
    var top = points[0].y;  var bottom = points[0].y;

    for(var a = 1; a < points.length; a++){
        if( points[a].x < left ){ left = points[a].x; }
        else if(points[a].x > right){ right = points[a].x; }

        if( points[a].y < top ){ top = points[a].y; }
        else if(points[a].y > bottom){ bottom = points[a].y; }
    }

    return {
        topLeft:{x:left,y:top},
        bottomRight:{x:right,y:bottom}
    };
};
this.pointsOfRect = function(x,y,width,height,angle=0,anchor={x:0,y:0}){
    var corners = {};
    var offsetX = anchor.x*width;
    var offsetY = anchor.y*height;

    var polar = this.cartesian2polar( offsetX, offsetY );
    var point = this.polar2cartesian( polar.ang-angle, polar.dis );
    corners.tl = { x:(x - point.x), y:(y - point.y) };

    var polar = this.cartesian2polar( offsetX-width, offsetY );
    var point = this.polar2cartesian( polar.ang-angle, polar.dis );
    corners.tr = { x:(x - point.x), y:(y - point.y) };

    var polar = this.cartesian2polar( offsetX-width, offsetY-height );
    var point = this.polar2cartesian( polar.ang-angle, polar.dis );
    corners.br = { x:(x - point.x), y:(y - point.y) };

    var polar = this.cartesian2polar( offsetX, offsetY-height );
    var point = this.polar2cartesian( polar.ang-angle, polar.dis );
    corners.bl = { x:(x - point.x), y:(y - point.y) };

    return [
        corners.tl,
        corners.tr, 
        corners.br, 
        corners.bl, 
    ];
};
this.pointsOfCircle = function(x,y,r,pointCount=3){
    var output = [];
    for(var a = 0; a < pointCount; a++){
        output.push({
            x: x + r*Math.sin(2*Math.PI*(a/pointCount)),
            y: y + r*Math.cos(2*Math.PI*(a/pointCount)),
        });
    }
    return output;
};
this.pointsOfText = function(text, x, y, angle, size, font, alignment, baseline){
    //determine text width
        var width = 0;
        var canvas = document.createElement('canvas');
        var context = canvas.getContext('2d');

        context.font = font;
        context.textAlign = alignment;
        context.textBaseline = baseline;

        var d = context.measureText(text);
        width = d.width/size;

    //determine text height
        var height = 0;
        var div = document.createElement("div");
            div.innerHTML = text;
            div.style.position = 'absolute';
            div.style.top  = '-9999px';
            div.style.left = '-9999px';
            div.style.fontFamily = font;
        document.body.appendChild(div);
        height = div.offsetHeight*size;
        document.body.removeChild(div);

    //adjust for angle
        var points = [{x:x, y:y}, {x:x+width, y:y}, {x:x+width, y:y-height}, {x:x, y:y-height}];
        for(var a = 0; a < points.length; a++){
            points[a] = this.cartesianAngleAdjust(points[a].x-x,points[a].y-y,angle);
            points[a].x += x;
            points[a].y += y;
        }

    return points;
};
this.detectOverlap = new function(){
    this.boundingBoxes = function(a, b){
        return !(
            (a.bottomRight.y < b.topLeft.y) ||
            (a.topLeft.y > b.bottomRight.y) ||
            (a.bottomRight.x < b.topLeft.x) ||
            (a.topLeft.x > b.bottomRight.x)   
    );};
    this.pointWithinBoundingBox = function(point,box){
        return !(
            point.x < box.topLeft.x     ||  point.y < box.topLeft.y     ||
            point.x > box.bottomRight.x ||  point.y > box.bottomRight.y
        );
    };
    this.pointWithinPoly = function(point,points){
        var inside = false;
        for(var a = 0, b = points.length - 1; a < points.length; b = a++) {
            if(
                ((points[a].y > point.y) != (points[b].y > point.y)) && 
                (point.x < ((((points[b].x-points[a].x)*(point.y-points[a].y)) / (points[b].y-points[a].y)) + points[a].x))
            ){inside = !inside;}
        }
        return inside;
    };
};
