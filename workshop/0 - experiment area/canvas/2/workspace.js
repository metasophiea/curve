var __canvasElements = document.getElementsByTagName('canvas');
for(var __canvasElements_count = 0; __canvasElements_count < __canvasElements.length; __canvasElements_count++){
    if( __canvasElements[__canvasElements_count].hasAttribute('workspace') ){
        var canvas = __canvasElements[__canvasElements_count];
        canvas.system = new function(){};
        
        canvas.system.utility = new function(){
            this.averageArray = arr => arr.reduce( ( p, c ) => p + c, 0 ) / arr.length;
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
            this.functionListRunner = function(list){
                //function builder for working with the 'functionList' format
            
                return function(event){
                    //run through function list, and activate functions where necessary
                        for(var a = 0; a < list.length; a++){
                            var shouldRun = true;
            
                            //determine if all the requirements of this function are met
                                for(var b = 0; b < list[a].specialKeys.length; b++){
                                    shouldRun = shouldRun && event[list[a].specialKeys[b]];
                                    if(!shouldRun){break;} //(one is already not a match, so save time and just bail here)
                                }
            
                            //if all requirements were met, run the function
                            if(shouldRun){  
                                //if the function returns 'false', continue with the list; otherwise stop here
                                    if( list[a].function(event) ){ break; }
                            }
                        }
                }
            };
        };
        canvas.system.core = new function(){
                this.imageCache = {};
                this.count = 0;
            
            //viewport 
                this.viewport = {
                    location:{
                        position:{x:0,y:0},
                        scale:1,
                        angle:0,
                    },
                    corners:{ tl:{x:0,y:0}, tr:{x:0,y:0}, bl:{x:0,y:0}, br:{x:0,y:0} },
                    boundingBox:{ topLeft:{x:0,y:0}, bottomRight:{x:0,y:0} }
                };
                this.viewport.position = function(x,y){
                    if(x == undefined || y == undefined){return {x:this.location.position.x,y:this.location.position.y};}
                    this.location.position.x = x;
                    this.location.position.y = y;
                };
                this.viewport.scale = function(s){
                    if(s == undefined ){return this.location.scale;}
                    this.location.scale = s;
                };
                this.viewport.angle = function(a){
                    if(a == undefined ){return this.location.angle;}
                    this.location.angle = a;
                };
            
            
            //"workspace -> canvas" and "canvas -> workspace" adaptation
                this.adapter = {};
                this.adapter.angle = function(a=0){
                    return canvas.system.core.viewport.location.angle - a;
                };
                this.adapter.point_cache = [];
                this.adapter.point = function(x,y){
                    return this.workspacePoint2windowPoint(x,y);
                };
                this.adapter.length = function(l){
                    return l*canvas.system.core.viewport.location.scale;
                };
                this.adapter.windowPoint2workspacePoint = function(x,y){
                    x = (x/canvas.system.core.viewport.location.scale) - canvas.system.core.viewport.location.position.x;
                    y = (y/canvas.system.core.viewport.location.scale) - canvas.system.core.viewport.location.position.y;
            
                    return canvas.system.utility.cartesianAngleAdjust(x,y,-canvas.system.core.viewport.location.angle);
                };
                this.adapter.workspacePoint2windowPoint = function(x,y){
                    var point = canvas.system.utility.cartesianAngleAdjust(x,y,canvas.system.core.viewport.location.angle);
            
                    return {
                        x: (point.x+canvas.system.core.viewport.location.position.x) * canvas.system.core.viewport.location.scale,
                        y: (point.y+canvas.system.core.viewport.location.position.y) * canvas.system.core.viewport.location.scale
                    };
                };
            
            //element
                this.element = {};
                this.element.arrangement = [];
                this.element.draw = {
                    context:canvas.getContext('2d', { alpha: false }),
                    clear:function(){
                        // this.context.clearRect(0, 0, canvas.width, canvas.height);
            
                        var context = canvas.system.core.element.draw.context;
                        context.fillStyle = 'rgb(255,255,255)';
                        context.fillRect(0, 0, canvas.width, canvas.height);
                    },
                    dot:function(x,y,r=1,fillStyle='rgba(255,0,0,1)',static=false){
                        var context = this.context;
            
                        context.fillStyle = fillStyle;
                        context.strokeStyle = '';
                        context.lineWidth = '';
                    
                        context.save();
                        var p = canvas.system.core.adapter.point(x,y); context.translate(p.x,p.y);
                        context.beginPath();
                        context.arc(0, 0, canvas.system.core.adapter.length(r), 0, 2 * Math.PI, false);
                        context.fill();
                        context.restore();
                    },
                    rect:function(x,y,width,height,angle=0,anchor={x:0,y:0},fillStyle='rgba(255,100,255,1)',strokeStyle='rgba(0,0,0,0)',lineWidth=1,static=false){
                        var context = canvas.system.core.element.draw.context;
            
                        context.fillStyle = fillStyle;
                        context.strokeStyle = strokeStyle;
                        context.lineWidth = lineWidth;
            
                        var p = {p:{x:x,y:y}, angle:angle};
                        if(!static){
                            p.p = canvas.system.core.adapter.point(p.p.x,p.p.y);
                            p.p = canvas.system.utility.cartesianAngleAdjust(p.p.x,p.p.y,p.angle);
                            p.p.x += canvas.system.core.adapter.length(-anchor.x*width);
                            p.p.y += canvas.system.core.adapter.length(-anchor.y*height);
            
                            width = canvas.system.core.adapter.length(width);
                            height = canvas.system.core.adapter.length(height);
                        }
            
                        context.save();
                        context.rotate( p.angle );
                        context.fillRect( p.p.x, p.p.y, width, height );
                        context.strokeRect( p.p.x, p.p.y, width, height );
                        context.restore();
                    },
                    poly:function(points,fillStyle='rgba(255,100,255,1)',strokeStyle='rgba(0,0,0,0)',lineWidth=1,static=false){
                        var context = canvas.system.core.element.draw.context;
            
                        context.fillStyle = fillStyle;
                        context.strokeStyle = strokeStyle;
                        context.lineWidth = lineWidth;
                    
                        context.beginPath(); 
                        var p = canvas.system.core.adapter.point(points[0].x,points[0].y); context.moveTo(p.x,p.y);
                        for(var a = 1; a < points.length; a++){ 
                            var p = canvas.system.core.adapter.point(points[a].x,points[a].y); context.lineTo(p.x,p.y);
                        }
                    
                        context.closePath(); 
                        context.fill(); 
                        context.stroke();
                    },
                    image:function(x,y,width,height,angle=0,anchor={x:0,y:0},url,static=false){
                        //if the url is missing; draw the default shape
                            if(url == undefined){
                                canvas.system.core.element.draw.rect(x,y,width,height,angle,anchor,"rgb(50,50,50)","rgb(255,0,0)",3);
                                return;
                            }
            
                        //if this image url is not cached; cache it
                            if( !canvas.system.core.imageCache.hasOwnProperty(url) ){
                                canvas.system.core.imageCache[url] = new Image(); 
                                canvas.system.core.imageCache[url].src = url;
                            }
                    
                        //main render (using cached image)
                            var context = canvas.system.core.element.draw.context;
                            context.save();
                            var p = canvas.system.core.adapter.point(x,y); context.translate(p.x,p.y);
                            context.rotate( canvas.system.core.adapter.angle(angle) );
                            context.drawImage(canvas.system.core.imageCache[url], canvas.system.core.adapter.length(-anchor.x*width), canvas.system.core.adapter.length(-anchor.y*height), canvas.system.core.adapter.length(width), canvas.system.core.adapter.length(height));
                            context.restore();
                    },
                };
                this.element.computeExtremities = function(element){
                //computes points and bounding box for provided element, and updates the bounding boxes for all all parents
            
                    //get and compute parent offsets
                        //gather x, y, and angle data from this element up
                            var offsetList = [];
                            var temp = element;
                            while((temp=temp.parent) != undefined){
                                offsetList.unshift( {x:temp.data.x, y:temp.data.y, a:temp.data.angle} );
                            }
            
                        //calculate them together into on offset
                            var offset = { 
                                x: offsetList[0]!=undefined ? offsetList[0].x : 0,
                                y: offsetList[0]!=undefined ? offsetList[0].y : 0,
                                a: 0
                            };
                            for(var a = 1; a < offsetList.length; a++){
                                var point = canvas.system.utility.cartesianAngleAdjust(offsetList[a].x,offsetList[a].y,-(offset.a+offsetList[a-1].a));
                                offset.a += offsetList[a-1].a;
                                offset.x += point.x;
                                offset.y += point.y;
                            }
                            offset.a += offsetList[offsetList.length-1]!=undefined ? offsetList[offsetList.length-1].a : 0;
            
                    //create points and bounding box for this element
                        switch(element.type){
                            case 'group':
                                if(element.data == undefined){element.data = {x:0,y:0,angle:0};}
                                else{
                                    if(element.data.x == undefined){element.data.x = 0;}
                                    if(element.data.y == undefined){element.data.y = 0;}
                                    if(element.data.angle == undefined){element.data.angle = 0;}
                                }
                                if(element.children == undefined){element.children = [];}
            
                                element.points = [{x:element.data.x+offset.x, y:element.data.y+offset.y}];
                                element.boundingBox = canvas.system.utility.boundingBoxFromPoints( element.points );
                                for(var a = 0; a < element.children.length; a++){ this.computeExtremities(element.children[a]); }
                            break;
                            case 'dot': 
                                element.points = [ canvas.system.utility.cartesianAngleAdjust(element.data.x,element.data.y,-offset.a) ].map(a => ({x:a.x+offset.x,y:a.y+offset.y}));
                                element.boundingBox = canvas.system.utility.boundingBoxFromPoints( element.points );
                            break;
                            case 'poly': 
                                element.points = element.data.points.map(function(point){
                                    point = canvas.system.utility.cartesianAngleAdjust(point.x,point.y,-offset.a);
                                    point.x += offset.x;
                                    point.y += offset.y;
                                    return point;
                                });
                                element.boundingBox = canvas.system.utility.boundingBoxFromPoints( element.points );
                            break;
                            case 'rect': case 'image':
                                if(element.data.angle == undefined){element.data.angle = 0;}
            
                                element.points = canvas.system.utility.pointsOfRect(element.data.x, element.data.y, element.data.width, element.data.height, element.data.angle, element.data.anchor);
                                element.points = element.points.map(function(point){
                                    point = canvas.system.utility.cartesianAngleAdjust(point.x,point.y,-offset.a);
                                    point.x += offset.x;
                                    point.y += offset.y;
                                    return point;
                                });
                                
                                element.boundingBox = canvas.system.utility.boundingBoxFromPoints( element.points );
                            break;
                        }
            
                    //update all parents' bounding boxes (if there are no changes to a parent's bounding box; don't update and don't bother checking their parent (or higher))
                        var temp = element;
                        while((temp=temp.parent) != undefined){
                            //discover if this new object would effect the bounding box of it's parent
                                if( 
                                    temp.boundingBox.topLeft.x > element.boundingBox.topLeft.x ||
                                    temp.boundingBox.topLeft.y > element.boundingBox.topLeft.y ||
                                    temp.boundingBox.bottomRight.x < element.boundingBox.bottomRight.x ||
                                    temp.boundingBox.bottomRight.y < element.boundingBox.bottomRight.y 
                                ){
                                    //it does effect, thus combine the current bounding box with this element's bounding 
                                    //box to determine the new bounding box for the parent
                                        temp.boundingBox = canvas.system.utility.boundingBoxFromPoints([
                                            temp.boundingBox.topLeft, temp.boundingBox.bottomRight,
                                            element.boundingBox.topLeft, element.boundingBox.bottomRight 
                                        ]);
                                }else{
                                    //it doesn't effect it, so don't bother going any higher
                                        break;
                                }
                        }
                };
                this.element.add = function(element,name,parent,index){
                    //check for name
                        if(name == undefined){console.warn('element has no name'); return;}
            
                    //check that the name is not already taken in this grouping
                        element.parent = parent;
                        var destination = parent == undefined ? this.arrangement : parent.children;
                        for(var a = 0; a < destination.length; a++){
                            if( destination[a].name == name ){ console.warn('element with the name "'+name+'" already exists in the group "'+parent.name+'"'); return; }
                        }
                        element.name = name;
            
                    //add element to the group
                        if(index == undefined){ destination.push(element);             }
                        else{                   destination.splice(index, 0, element); }
            
                    this.computeExtremities(element);
                    return element;
                };
                this.element.remove = function(element){
                    if( element.parent == undefined ){
                        var index = this.arrangement.indexOf(element);
                        this.arrangement.splice(index, 1);
                        this.computeExtremities(this.arrangement);
                    }else{
                        var index = element.parent.children.indexOf(element);
                        element.parent.children.splice(index, 1);
                        this.computeExtremities(element.parent);
                    }
                };
                this.element.getArrangement = function(){ return this.arrangement; };
                this.element.getByNameInGroup = function(name,group){
                    var children = group == undefined ? this.arrangement : group.children;
                    for(var a = 0; a < children.length; a++){
                        if( children[a].name == name ){ return children[a]; }
                    }
                };
                this.element.getAddress = function(element){
                    var address = '';
                    var temp = element;
                    do{
                        address = temp.name + '/' + address;
                    }while((temp = temp.parent) != undefined)
            
                    return '/' + address.slice(0,address.length-1);
                };
                this.element.getByAddress = function(address){
                    address = address.split('/').slice(1);
            
                    var temp;
                    for(var a = 0; a < address.length; a++){
                        temp = this.getByNameInGroup(address[a],temp);
                    }
            
                    return temp;
                };
                this.element.getParent = function(element){ return element.parent; };
                this.element.getChildren = function(element){ return element.children; };
                this.element.getElementUnderPoint = function(x,y){
            
                    function recursiveTrawl(group,x,y){
                        //go through group in reverse;
                        //  if the item is group; check if the point is within its bounding box. If it is, use recursion
                        //  otherwise; compute whether the point is within the poly
                            for(var a = group.length-1; a >= 0; a--){
                                var item = group[a];
            
                                //if the item declares that it should be ignored by this function; skip over it
                                    if(item.ignoreMe){continue;}
                                
                                //if this is a static object, adjust the x and y values accordingly
                                    if( item.static ){
                                        var p = canvas.system.core.adapter.workspacePoint2windowPoint(x,y);
                                        x = p.x; 
                                        y = p.y;
                                    }
            
                                //determine if the point lies within the bounds of this item
                                    if(item.type == 'group'){
                                        if( canvas.system.utility.detectOverlap.pointWithinBoundingBox({x:x,y:y},item.boundingBox)){
                                            var temp = recursiveTrawl(item.children,x,y);
                                            if(temp){return temp;}
                                        }
                                    }else{
                                        if( !item.points ){continue;}//if this item doesn't have a bounding box; ignore all of this
                                        if( canvas.system.utility.detectOverlap.pointWithinPoly( {x:x,y:y}, item.points )){ return item; }
                                    }
                            }
                    }
                    
                    return recursiveTrawl(this.arrangement,x,y);
                };
            
            //rendering and animation
                this.render = {};
                this.render.adjustCanvasSize = function(){
                    var element = canvas.system.core.element;
            
                    var width = canvas.getAttribute('workspaceWidth');
                    if( element.width != width || element.windowWidth != window.innerWidth ){
                        element.width = width;
                        element.windowWidth = window.innerWidth;
            
                        if(width == undefined){
                            canvas.width = 640;
                        }else if( width.indexOf('%') == (width.length-1) ){
                            var parentSize = canvas.parentElement.offsetWidth
                            var percent = parseFloat(width.slice(0,(width.length-1))) / 100;
                            canvas.width = parentSize * percent;
                        }else{
                            canvas.width = width;
                        }
            
                        canvas.system.core.viewport.width = canvas.width;
                    }
            
                    var height = canvas.getAttribute('workspaceHeight');
                    if( element.height != height || element.windowHeight != window.innerHeight ){
                        element.height = height;
                        element.windowHeight = window.innerHeight;
            
                        if(height == undefined){
                            canvas.height = 480;
                        }else if( height.indexOf('%') == (height.length-1) ){
                            var parentSize = canvas.parentElement.offsetHeight
                            var percent = parseFloat(height.slice(0,(height.length-1))) / 100;
                            canvas.height = parentSize * percent;
                        }else{
                            canvas.height = height;
                        }
            
                        canvas.system.core.viewport.width = canvas.height;
                    }
                };
                this.render.element = function(element,offsetX=0,offsetY=0,offsetAngle=0,static=false){
                    //if element is static, adjust the element's bounding box accordingly
                        var tempBoundingBox = element.boundingBox;
                        if(static){
                            tempBoundingBox = Object.assign({}, element.boundingBox);
                            tempBoundingBox.topLeft = canvas.system.core.adapter.workspacePoint2windowPoint(tempBoundingBox.topLeft.x,tempBoundingBox.topLeft.y);
                            tempBoundingBox.bottomRight = canvas.system.core.adapter.workspacePoint2windowPoint(tempBoundingBox.bottomRight.x,tempBoundingBox.bottomRight.y);
                        }
                        console.log(JSON.stringify(canvas.system.core.viewport.boundingBox));
                        console.log(JSON.stringify(tempBoundingBox));
                        console.log('');
            
                    //use bounding box to determine whether this shape should be rendered
                        if( !canvas.system.utility.detectOverlap.boundingBoxes(canvas.system.core.viewport.boundingBox, tempBoundingBox) ){ return; }
            
            
                    //main rendering area
                        var data = element.data;
                        switch(element.type){
                            case 'rect':
                                //assuming the offset angle is not zero; calculate the correct position of the anchor point
                                    if(offsetAngle != 0){
                                        var point = canvas.system.utility.cartesianAngleAdjust(data.x,data.y,-offsetAngle);
                                        offsetX -= data.x-point.x;
                                        offsetY -= data.y-point.y;
                                    }
            
                                //account for missing values
                                    data.angle = data.angle ? data.angle : 0;
                                    data.anchor = data.anchor ? data.anchor : {x:0,y:0};
            
                                //render shape
                                    canvas.system.core.element.draw.rect( 
                                        data.x+offsetX, 
                                        data.y+offsetY, 
                                        data.width, 
                                        data.height, 
                                        data.angle+offsetAngle, 
                                        data.anchor, 
                                        data.fillStyle, 
                                        data.strokeStyle, 
                                        data.lineWidth,
                                        static
                                    );
                            break;
                            case 'poly':
                                //run through all points in the poly, and account for the offsets
                                    var points = data.points.map( function(a){
                                        //assuming the offset angle is not zero; calculate the correct position of the anchor point
                                            if(offsetAngle != 0){
                                                a = canvas.system.utility.cartesianAngleAdjust(a.x,a.y,-offsetAngle);
                                            }
                                        //add positional offset to point
                                            return {x:a.x+offsetX, y:a.y+offsetY};
                                    } );
            
                                //render shape
                                    canvas.system.core.element.draw.poly( 
                                        points, 
                                        data.fillStyle, 
                                        data.strokeStyle, 
                                        data.lineWidth,
                                        static
                                    );
                            break;
                            case 'image':
                                //assuming the offset angle is not zero; calculate the correct position of the anchor point
                                    if(offsetAngle != 0){
                                        var point = canvas.system.utility.cartesianAngleAdjust(data.x,data.y,-offsetAngle);
                                        offsetX -= data.x-point.x;
                                        offsetY -= data.y-point.y;
                                    }
            
                                //account for missing values
                                    data.angle = data.angle ? data.angle : 0;
                                    data.anchor = data.anchor ? data.anchor : {x:0,y:0};
            
                                //render shape
                                    canvas.system.core.element.draw.image( 
                                        data.x+offsetX, 
                                        data.y+offsetY, 
                                        data.width, 
                                        data.height, 
                                        data.angle+offsetAngle,
                                        data.anchor, 
                                        data.url,
                                        static
                                    );
                            break;
                            case 'dot':
                                //assuming the offset angle is not zero; calculate the correct position of the anchor point
                                    if(offsetAngle != 0){
                                        var point = canvas.system.utility.cartesianAngleAdjust(data.x,data.y,-offsetAngle);
                                        offsetX -= data.x-point.x;
                                        offsetY -= data.y-point.y;
                                    }
            
                                //render shape
                                    canvas.system.core.element.draw.dot( 
                                        data.x+offsetX, 
                                        data.y+offsetY, 
                                        data.r, 
                                        data.fillStyle,
                                        static
                                    );
                            break;
                            default: console.warn('unknown shape type "'+element.type+'"'); break;
                        }
            
                }; 
                this.render.scene = function(noClear=false){
                    //perform resize of canvas
                        canvas.system.core.render.adjustCanvasSize();
            
                    //clear the canvas
                        if(!noClear){ canvas.system.core.element.draw.clear(); }
            
                    //calculate viewport corner points, and bounding box
                        var corners = canvas.system.core.viewport.corners;
                        corners.tl = canvas.system.core.adapter.windowPoint2workspacePoint(0,0);
                        corners.tr = canvas.system.core.adapter.windowPoint2workspacePoint(canvas.width,0);
                        corners.bl = canvas.system.core.adapter.windowPoint2workspacePoint(0,canvas.height);
                        corners.br = canvas.system.core.adapter.windowPoint2workspacePoint(canvas.width,canvas.height);
                        canvas.system.core.viewport.boundingBox = canvas.system.utility.boundingBoxFromPoints([corners.tl, corners.tr, corners.br, corners.bl]);
            
                    //sequentially - and recursively - render everything on the elements list
                        function recursiveRender(group,offsetX=0,offsetY=0,offsetAngle=0,static=false){
                            for(var a = 0; a < group.length; a++){
                                var item = group[a];
            
                                if(item.type == 'group'){ 
                                    var angle = item.data.angle?item.data.angle:0;
            
                                    if(offsetAngle != 0){
                                        var point = canvas.system.utility.cartesianAngleAdjust(item.data.x,item.data.y,-offsetAngle);
                                        offsetX -= item.data.x-point.x;
                                        offsetY -= item.data.y-point.y;
                                    }
            
                                    recursiveRender( item.children, item.data.x+offsetX, item.data.y+offsetY, angle+offsetAngle, (static||item.static) );
                                }else{
                                    canvas.system.core.render.element( item, offsetX, offsetY, offsetAngle, (static||item.static) );
                                }
                            }
                        }
                        recursiveRender(canvas.system.core.element.arrangement);
                };
                this.render.animate = function(timestamp){
                    var requestId = requestAnimationFrame(canvas.system.core.render.animate);
                    try{
                        canvas.system.core.render.scene();
                    }catch(e){
                        cancelAnimationFrame(requestId);
                        console.error('major animation error');
                        console.error(e);
                    }
            
                    canvas.system.core.stats.collect.fps(timestamp);
                };
            
            //stat collection
                this.stats = {
                    active:false,
                    average:60,
                };
                this.stats.collect = new function(){
                    this.fps = function(timestamp){
                        if( canvas.system.core.stats.active ){
                            var stats = canvas.system.core.stats;
                            if( !stats.hasOwnProperty('fpsCounter') ){
                                stats.fpsCounter = {};
                                stats.fpsCounter.frameTimeArray = [];
                            }
                            stats.fpsCounter.frameTimeArray.push( 1000/(timestamp-stats.oldTime) );
                            if( stats.fpsCounter.frameTimeArray.length >= stats.average){
                                console.log( 'frames per second:', canvas.system.utility.averageArray( stats.fpsCounter.frameTimeArray) );
                                stats.fpsCounter.frameTimeArray = [];
                            }
                            stats.oldTime = timestamp;
                        }
                    };
                };
            
            //callback
                var callbacks = ['onmousedown', 'onmouseup', 'onmousemove', 'onmouseenter', 'onmouseleave', 'onwheel'];
                this.callback = {};
                for(var a = 0; a < callbacks.length; a++){
                    //interface
                        this.callback[callbacks[a]] = function(x,y,event){};
            
                    //attachment to canvas
                        canvas[callbacks[a]] = function(callback){
                            return function(event){
                                if( !canvas.system.core.callback[callback] ){return;}
                                var p = canvas.system.core.adapter.windowPoint2workspacePoint(event.x,event.y);
                                canvas.system.core.callback[callback](p.x,p.y,event);
                            }
                        }(callbacks[a]);
                }
        };
        canvas.system.mouse = new function(){
            canvas.system.core.callback.onmousedown = function(x,y,event){ 
                console.log( canvas.system.core.element.getElementUnderPoint(x,y) );
                // canvas.system.core.element.remove( canvas.system.core.element.getElementUnderPoint(x,y) );
            
                canvas.system.utility.functionListRunner(canvas.system.mouse.functionList.onmousedown)(event);
            };
            canvas.system.core.callback.onwheel = function(x,y,event){
                canvas.system.utility.functionListRunner(canvas.system.mouse.functionList.onwheel)(event);
            };
            
            
            
            this.tmp = {};
            this.functionList = {};
            
            
            this.functionList.onmousedown = [
                {
                    'specialKeys':[],
                    'function':function(event){
                        //save the old listener functions of the canvas
                            canvas.system.mouse.tmp.onmousemove_old = canvas.onmousemove;
                            canvas.system.mouse.tmp.onmouseleave_old = canvas.onmouseleave;
                            canvas.system.mouse.tmp.onmouseup_old = canvas.onmouseup;
            
                        //save the viewport position and click position
                            canvas.system.mouse.tmp.oldPosition = canvas.system.core.viewport.position();
                            canvas.system.mouse.tmp.clickPosition = {x:event.x, y:event.y};
            
                        //replace the canvas's listeners 
                            canvas.onmousemove = function(event){
                                //update the viewport position
                                    canvas.system.core.viewport.position(
                                        canvas.system.mouse.tmp.oldPosition.x - ((canvas.system.mouse.tmp.clickPosition.x-event.x) / canvas.system.core.viewport.scale()),
                                        canvas.system.mouse.tmp.oldPosition.y - ((canvas.system.mouse.tmp.clickPosition.y-event.y) / canvas.system.core.viewport.scale()),
                                    );
                            };
            
                            canvas.onmouseup = function(){
                                //put back the old listeners 
                                    this.onmousemove = canvas.system.mouse.tmp.onmousemove_old;
                                    this.onmouseleave = canvas.system.mouse.tmp.onmouseleave_old;
                                    this.onmouseup = canvas.system.mouse.tmp.onmouseup_old;
            
                                //delete all the tmp data
                                    canvas.system.mouse.tmp = {};
                            };
            
                            canvas.onmouseleave = canvas.onmouseup;
            
                        //request that the function list stop here
                            return true;
                    }
                }
            ];
            this.functionList.onmousemove = [];
            this.functionList.onmouseup = [];
            this.functionList.onmouseleave = [];
            this.functionList.onmouseenter = [];
            this.functionList.onwheel = [
                {
                    'specialKeys':[],
                    'function':function(event){
                        var scaleLimits = {'max':10, 'min':0.1};
            
                        //perform scale and associated pan
                            //discover point under mouse
                                var originalPoint = canvas.system.core.adapter.windowPoint2workspacePoint(event.x,event.y);
                            //perform actual scaling
                                var scale = canvas.system.core.viewport.scale();
                                scale -= scale*(event.deltaY/100);
                                if( scale > scaleLimits.max ){scale = scaleLimits.max;}
                                if( scale < scaleLimits.min ){scale = scaleLimits.min;}
                                canvas.system.core.viewport.scale(scale);
                            //discover point under mouse
                                var newPoint = canvas.system.core.adapter.windowPoint2workspacePoint(event.x,event.y);
                            //pan so we're back at the old point (accounting for angle)
                                var pan = canvas.system.utility.cartesianAngleAdjust(
                                    (newPoint.x - originalPoint.x),
                                    (newPoint.y - originalPoint.y),
                                    canvas.system.core.viewport.angle()
                                );
                                var temp = canvas.system.core.viewport.position();
                                canvas.system.core.viewport.position(temp.x+pan.x,temp.y+pan.y)
            
                        //request that the function list stop here
                            return true;
                    }
                }
            ];
        };
        
        canvas.system.core.render.animate();
        var staticBackground = canvas.system.core.element.add( {type:'group', ignoreMe:true, static:true}, 'staticBackground' );
            var test = canvas.system.core.element.add( {type:'rect', data:{x:15, y:0, width:30, height:30, fillStyle:'rgba(255,0,0,0.3)'}}, 'test 1', staticBackground );
        
        // var main = canvas.system.core.element.add( {type:'group'}, 'main' );
        //     var background = canvas.system.core.element.add( {type:'group', ignoreMe:true}, 'background', main );
        //         var test = canvas.system.core.element.add( {type:'rect', data:{x:30, y:30, width:30, height:30, fillStyle:'rgba(255,0,0,0.3)'}}, 'test 1', background );
        //     var middleground = canvas.system.core.element.add( {type:'group'}, 'middleground', main );
        //         var test = canvas.system.core.element.add( {type:'rect', data:{x:90, y:30, width:30, height:30}}, 'test 1', middleground );
        //     var foreground = canvas.system.core.element.add( {type:'group', ignoreMe:true}, 'foreground', main );
        //         var test = canvas.system.core.element.add( {type:'rect', data:{x:150, y:30, width:30, height:30, fillStyle:'rgba(255,0,0,0.3)'}}, 'test 1', foreground );
                
        // var control = canvas.system.core.element.add( {type:'group', static:true}, 'control' );
        //     var test = canvas.system.core.element.add( {type:'rect', data:{x:45, y:60, width:30, height:30}}, 'test 1', control );
        
        console.log(canvas.system.core.element.getArrangement());
    }
}
