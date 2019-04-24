this.grapher_static = function(
    name='grapher_static',
    x, y, width=120, height=60, angle=0, resolution=5,

    foregroundStyles=[
        {stroke:'rgba(0,255,0,1)', lineWidth:0.5, lineJoin:'round'},
        {stroke:'rgba(255,255,0,1)', lineWidth:0.5, lineJoin:'round'},
        {stroke:'rgba(0,255,255,1)', lineWidth:0.5, lineJoin:'round'},
    ],
    foregroundTextStyles=[
        {fill:'rgba(100,255,100,1)', size:0.75, font:'Helvetica'},
        {fill:'rgba(255,255,100,1)', size:0.75, font:'Helvetica'},
        {fill:'rgba(100,255,255,1)', size:0.75, font:'Helvetica'},
    ],

    backgroundStyle_stroke='rgba(0,100,0,1)',
    backgroundStyle_lineWidth=0.25,
    backgroundTextStyle_fill='rgba(0,150,0,1)',
    backgroundTextStyle_font='7.5pt Helvetica',

    backingStyle='rgba(50,50,50,1)',
){
    var viewbox = {'bottom':-1,'top':1,'left':-1,'right':1};
    var horizontalMarkings = { points:[0.75,0.5,0.25,0,-0.25,-0.5,-0.75], printingValues:[], mappedPosition:0, textPositionOffset:{x:1,y:-0.5}, printText:true };
    var verticalMarkings =   { points:[0.75,0.5,0.25,0,-0.25,-0.5,-0.75], printingValues:[], mappedPosition:0, textPositionOffset:{x:1,y:-0.5}, printText:true };
    var foregroundElementsGroup = [];

    //elements 
        //main
            var object = interfacePart.builder('group',name,{x:x, y:y, angle:angle});
        //canvas
            var canvas = interfacePart.builder('canvas','backing',{ width:width, height:height, resolution:resolution });
            object.append(canvas);

    //graphics
        function clear(){
            canvas._.fillStyle = backingStyle;
            canvas._.fillRect(0,0,canvas.$(width),canvas.$(height));
        };
        function drawBackground(){
            //horizontal lines
                //calculate the x value for all parts of this section
                    var x = workspace.library.math.relativeDistance(width, viewbox.left,viewbox.right, horizontalMarkings.mappedPosition );

                //add all horizontal markings
                    for(var a = 0; a < horizontalMarkings.points.length; a++){
                        //check if we should draw this line at all
                            if( !(horizontalMarkings.points[a] < viewbox.top || horizontalMarkings.points[a] > viewbox.bottom) ){ continue; }
        
                        //calculate the y value for this section
                            var y = height - workspace.library.math.relativeDistance(height, viewbox.bottom,viewbox.top, horizontalMarkings.points[a]);

                        //add line and text to group
                            //lines
                                canvas._.fillStyle = backgroundStyle_stroke;
                                canvas._.fillRect(0,canvas.$(y),canvas.$(width),canvas.$(backgroundStyle_lineWidth));

                            //text
                                if( horizontalMarkings.printText ){
                                    canvas._.fillStyle = backgroundTextStyle_fill;
                                    canvas._.font = backgroundTextStyle_font;
                                    canvas._.fillText(
                                        (horizontalMarkings.printingValues && horizontalMarkings.printingValues[a] != undefined) ? horizontalMarkings.printingValues[a] : horizontalMarkings.points[a],
                                        canvas.$(x+horizontalMarkings.textPositionOffset.x),
                                        canvas.$(y+horizontalMarkings.textPositionOffset.y),
                                    );
                                }
                    }

            //vertical lines
                //calculate the y value for all parts of this section
                    var y = height - workspace.library.math.relativeDistance(height, viewbox.bottom,viewbox.top, verticalMarkings.mappedPosition );

                //add all vertical markings
                    for(var a = 0; a < verticalMarkings.points.length; a++){
                        //check if we should draw this line at all
                            if( verticalMarkings.points[a] < viewbox.left || verticalMarkings.points[a] > viewbox.right ){ continue; }

                        //calculate the x value for this section
                            var x = workspace.library.math.relativeDistance(width, viewbox.left,viewbox.right, verticalMarkings.points[a]);

                        //add line and text to group
                            //lines
                                canvas._.fillStyle = backgroundStyle_stroke;
                                canvas._.fillRect(canvas.$(x),0,canvas.$(backgroundStyle_lineWidth),canvas.$(height));
                        
                            //text
                                if( verticalMarkings.printText ){
                                    canvas._.fillStyle = backgroundTextStyle_fill;
                                    canvas._.font = backgroundTextStyle_font;
                                    canvas._.fillText(
                                        (verticalMarkings.printingValues && verticalMarkings.printingValues[a] != undefined) ? verticalMarkings.printingValues[a] : verticalMarkings.points[a],
                                        canvas.$(x+verticalMarkings.textPositionOffset.x),
                                        canvas.$(y+verticalMarkings.textPositionOffset.y),
                                    );
                                }
                    }

        }
        function drawForeground(y,x,layer=0){

            //if both data sets of a layer are being set to undefined; set the whole layer to undefined
            //otherwise, just update the layer's data sets
                if(y == undefined && x == undefined){ foregroundElementsGroup[layer] = undefined; }
                else{ foregroundElementsGroup[layer] = {x:x, y:y}; }

            //input check
                if( foregroundElementsGroup[layer] != undefined && foregroundElementsGroup[layer].y == undefined ){
                    console.warn('grapher_static error',name,'attempting to add line with no y component');
                    console.warn('x:',foregroundElementsGroup[layer].x);
                    console.warn('y:',foregroundElementsGroup[layer].y);
                    return;
                }

            //draw layers
                for(var L = 0; L < foregroundElementsGroup.length; L++){
                    if(foregroundElementsGroup[L] == undefined){continue;}

                    var layer = foregroundElementsGroup[L];

                    //draw path
                        canvas._.strokeStyle = foregroundStyles[L].stroke;
                        canvas._.lineWidth = canvas.$(foregroundStyles[L].lineWidth);
                        canvas._.lineJoin = foregroundStyles[L].lineJoin;
                        canvas._.lineCap = foregroundStyles[L].lineJoin;
                        canvas._.beginPath();

                        if( layer.y != undefined && layer.x == undefined ){ //auto x print
                            canvas._.moveTo( 0, canvas.$( height - workspace.library.math.relativeDistance(height, viewbox.bottom,viewbox.top, layer.y[0], true) ) );
                            for(var a = 1; a < layer.y.length; a++){ 
                                canvas._.lineTo(
                                    canvas.$(a*(width/(layer.y.length-1))),
                                    canvas.$(height - workspace.library.math.relativeDistance(height, viewbox.bottom,viewbox.top, layer.y[a], true)),
                                );
                            }
                        }else if( layer.y.length == layer.x.length ){ //straight print
                            for(var a = 0; a < layer.y.length; a++){ 
                                canvas._.moveTo( 
                                    canvas.$(          workspace.library.math.relativeDistance(width, viewbox.left,viewbox.right, layer.x[0], true) ),
                                    canvas.$( height - workspace.library.math.relativeDistance(height, viewbox.bottom,viewbox.top, layer.y[0], true) )
                                );
                                for(var a = 1; a < layer.y.length; a++){ 
                                    canvas._.lineTo(
                                        canvas.$(          workspace.library.math.relativeDistance(width, viewbox.left,viewbox.right, layer.x[a], true) ),
                                        canvas.$( height - workspace.library.math.relativeDistance(height, viewbox.bottom,viewbox.top, layer.y[a], true) ),
                                    );
                                }
                            }
                        }else{console.error('grapher_static::'+name,':layers are of different length:',layer.y,layer.x);}

                        canvas._.stroke();
                }
        }

    //controls
        object.resolution = function(a){return canvas.resolution(a);};
        object.viewbox = function(a){
            if(a==null){return viewbox;}
            if( a.bottom != undefined ){viewbox.bottom = a.bottom;}
            if( a.top != undefined ){viewbox.top = a.top;}
            if( a.left != undefined ){viewbox.left = a.left;}
            if( a.right != undefined ){viewbox.right = a.right;}
        };
        object.horizontalMarkings = function(a){
            if(a==null){return horizontalMarkings;}
            if( a.points != undefined ){horizontalMarkings.points = a.points;}
            if( a.printingValues != undefined ){horizontalMarkings.printingValues = a.printingValues;}
            if( a.textPositionOffset != undefined ){horizontalMarkings.textPositionOffset = a.textPositionOffset;}
            if( a.printText != undefined ){horizontalMarkings.printText = a.printText;}
        };
        object.verticalMarkings = function(a){
            if(a==null){return verticalMarkings;}
            if( a.points != undefined ){verticalMarkings.points = a.points;}
            if( a.printingValues != undefined ){verticalMarkings.printingValues = a.printingValues;}
            if( a.textPositionOffset != undefined ){verticalMarkings.textPositionOffset = a.textPositionOffset;}
            if( a.printText != undefined ){verticalMarkings.printText = a.printText;}
        };
        object.drawBackground = function(){ clear(); drawBackground(); };
        object.drawForeground = function(y,x,layer=0){ drawForeground(y,x,layer); };
        object.draw = function(y,x,layer=0){ clear(); drawBackground(); drawForeground(y,x,layer); };

    return object;
};