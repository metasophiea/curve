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
            
                return function(event,data){
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
                                    if( list[a].function(event,data) ){ break; }
                            }
                        }
                }
            };
        };
        
        canvas.system.core = new function(){
            var core = this;
            var adapter = new function(){
                this.length = function(l){
                    return l*core.viewport.scale();
                };
                this.windowPoint2workspacePoint = function(x,y){
                    var position = core.viewport.position();
                    var scale = core.viewport.scale();
                    var angle = core.viewport.angle();
            
                    x = (x/scale) - position.x;
                    y = (y/scale) - position.y;
            
                    return canvas.system.utility.cartesianAngleAdjust(x,y,-angle);
                };
                this.workspacePoint2windowPoint = function(x,y){
                    var position = core.viewport.position();
                    var scale = core.viewport.scale();
                    var angle = core.viewport.angle();
            
                    var point = canvas.system.utility.cartesianAngleAdjust(x,y,angle);
            
                    return {
                        x: (point.x+position.x) * scale,
                        y: (point.y+position.y) * scale
                    };
                };
            };
            
            this.element = new function(){
                this.create = function(type){
                    var generic = {type:type, name:undefined, ignored:false, static: false};
            
                    switch(type){
                        case 'group':
                            generic.x = 0;
                            generic.y = 0;
                            generic.angle = 0;
                            generic.parent = undefined;
                            generic.children = [];
                            return generic;
                        case 'dot':
                            generic.x = 0;
                            generic.y = 0;
                            generic.r = 1;
                            generic.fillStyle = 'rgba(255,0,0,1)';
                            return generic;
                        case 'rectangle':
                            generic.x = 0;
                            generic.y = 0;
                            generic.anchor = {x:0,y:0};
                            generic.angle = 0;
                            generic.width = 0;
                            generic.height = 0;
                            generic.fillStyle = 'rgba(255,100,255,1)';
                            generic.strokeStyle = 'rgba(0,0,0,0)';
                            generic.lineWidth = 1;
                            return generic;
                        case 'image':
                            generic.x = 0;
                            generic.y = 0;
                            generic.anchor = {x:0,y:0};
                            generic.angle = 0;
                            generic.width = 0;
                            generic.height = 0;
                            generic.url = '';
                            return generic;
                        case 'polygon':
                            generic.points = [];
                            generic.fillStyle = 'rgba(100,255,255,1)';
                            generic.strokeStyle = 'rgba(0,0,0,1)';
                            generic.lineWidth = 1;
                            return generic;
                    }
            
                };
            };
            
            this.arrangement = new function(){
                var design = [];
            
                function computeExtremities(element){
                    //compute points and bounding box for provided element, and update the bounding boxes for all parents
                
                        //get and compute parent offsets
                            //gather x, y, and angle data from this element up
                                var offsetList = [];
                                var temp = element;
                                while((temp=temp.parent) != undefined){
                                    offsetList.unshift( {x:temp.x, y:temp.y, a:temp.angle} );
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
                                    if(element == undefined){element = {x:0,y:0,angle:0};}
                                    else{
                                        if(element.x == undefined){element.x = 0;}
                                        if(element.y == undefined){element.y = 0;}
                                        if(element.angle == undefined){element.angle = 0;}
                                    }
                                    if(element.children == undefined){element.children = [];}
                
                                    element.points = [{x:element.x+offset.x, y:element.y+offset.y}];
                                    element.boundingBox = canvas.system.utility.boundingBoxFromPoints( element.points );
                                    for(var a = 0; a < element.children.length; a++){ computeExtremities(element.children[a]); }
                                break;
                                case 'dot': 
                                    element.points = [ canvas.system.utility.cartesianAngleAdjust(element.x,element.y,-offset.a) ].map(a => ({x:a.x+offset.x,y:a.y+offset.y}));
                                    element.boundingBox = canvas.system.utility.boundingBoxFromPoints( element.points );
                                break;
                                case 'polygon': 
                                    element.points = element.points.map(function(point){
                                        point = canvas.system.utility.cartesianAngleAdjust(point.x,point.y,-offset.a);
                                        point.x += offset.x;
                                        point.y += offset.y;
                                        return point;
                                    });
                                    element.boundingBox = canvas.system.utility.boundingBoxFromPoints( element.points );
                                break;
                                case 'rectangle': case 'image':
                                    if(element.angle == undefined){element.angle = 0;}
                
                                    element.points = canvas.system.utility.pointsOfRect(element.x, element.y, element.width, element.height, element.angle, element.anchor);
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
                }
                function validateElement(element){
                    //check for name
                        if(element.name == undefined){return 'element has no name'}
            
                    return;
                }
            
                this.add = function(parent,element,index){
                    //check that the element is valid
                        var temp = validateElement(element);
                        if(temp != undefined){console.error('element invalid:',temp); return;}
            
                    //if no parent was given; use the root as a destination
                        var destination = parent == undefined ? design : parent.children;
            
                    //check that the name is not already taken in this grouping
                        for(var a = 0; a < destination.length; a++){
                            if( destination[a].name == element.name ){ 
                                console.error('element with the name "'+element.name+'" already exists in the '+(parent==undefined?'design root':'group "'+parent.name+'"')+''); 
                                return;
                            }
                        }
                    
                    //set the parent of the new element
                        element.parent = parent;
                    
                    //add element to the group
                        switch(index){
                            case undefined: 
                            case 'front':
                                destination.push(element);
                            break;
                            case 'back':
                                destination.unshift(element);
                            break;
                            default:
                                destinationn.splice(index, 0, element);
                            break;
                    }
            
                    //perform extremity calculation on this element
                        computeExtremities(element);
            
                    return element;
                };
                this.remove = function(element){
                    if(element == undefined){return;}
            
                    if( element.parent == undefined ){
                        var index = design.indexOf(element);
                        design.splice(index, 1);
                        computeExtremities(design);
                    }else{
                        var index = element.parent.children.indexOf(element);
                        element.parent.children.splice(index, 1);
                        computeExtremities(element.parent);
                    }
                };
                this.refresh = function(element){computeExtremities(element);};
            
                this.getElementIndex = function(element){
                    //if no parent was given; use the root as a destination
                        var destination = element.parent == undefined ? design : element.parent.children;
            
                    //run through elements to find the one that matches
                        for(var a = 0; a < destination.length; a++){
                            if( destination[a] == element ){ return a; }
                        }
            
                    return -1;
                };
                this.setElementIndex = function(parent,element,index){
                    var from = this.getElementIndex(element);
                    this.shiftElementIndex(parent,from,index);
                };
                this.shiftElementIndex = function(parent,from,to){
                    //if no parent was given; use the root as a destination
                        var destination = parent == undefined ? design : parent.children;
            
                    //make the shift
                        var temp = destination.splice(from,1)[0];
                        destination.splice(to,0,temp);
                };
            
                this.getArrangement = function(element){return design;};
                this.getParent = function(element){return element.parent == undefined ? design : element.parent;};
                this.getChildren = function(element){ return element.children;};
            
                this.getElementUnderPoint = function(x,y,group=design){
                    //go through group in reverse;
                    //  if the item is a group; check if the point is within its bounding box. If it is, use recursion
                    //  otherwise; compute whether the point is within the items extremity points
                        for(var a = group.length-1; a >= 0; a--){
                            var item = group[a];
                            var tempX = x;
                            var tempY = y;
            
                            //if the item declares that it should be ignored by this function; skip over it
                                if(item.ignored){continue;}
                            
                            //if this is a static object, adjust the x and y values accordingly
                                if( item.static ){
                                    var p = adapter.workspacePoint2windowPoint(x,y);
                                    tempX = p.x; 
                                    tempY = p.y;
                                }
            
                            //determine if the point lies within the bounds of this item
                                if(item.type == 'group'){
                                    if( canvas.system.utility.detectOverlap.pointWithinBoundingBox({x:tempX,y:tempY},item.boundingBox)){
                                        var temp = this.getElementUnderPoint(tempX,tempY,item.children);
                                        if(temp){return temp;}
                                    }
                                }else{
                                    if( !item.points ){continue;}//if this item doesn't have a bounding box; ignore all of this
                                    if( canvas.system.utility.detectOverlap.pointWithinPoly( {x:tempX,y:tempY}, item.points )){ return item; }
                                }
                        }
                };
            
                this.getElementName = function(element){ return element.name; };
                this.setElementName = function(element,name){
                    //if no parent was given; use the root as a destination
                        var destination = element.parent == undefined ? design : element.parent;
            
                    //check that the name is not already taken in this grouping
                        for(var a = 0; a < destination.length; a++){
                            if( destination[a].name == element.name ){ 
                                console.warn('element with the name "'+element.name+'" already exists in the '+(element.parent == undefined?'design root':'group "'+element.parent.name+'"')+''); 
                                return;
                            }
                        }
            
                    element.name = name;
                };
                this.getElementByName = function(parent,name){
                    //if no parent was given; use the root as a destination
                        var destination = parent == undefined ? design : parent.children;
            
                    //run through elements to find the one that matches
                        for(var a = 0; a < destination.length; a++){
                            if( destination[a].name == name ){ return destination[a]; }
                        }
                };
            
                this.getElementAddress = function(element){
                    var address = '';
                    var temp = element;
                    do{
                        address = temp.name + '/' + address;
                    }while((temp = temp.parent) != undefined)
            
                    return '/' + address.slice(0,address.length-1);
                };
                this.getElementByAddress = function(address){
                    address = address.split('/').slice(1);
            
                    var temp;
                    for(var a = 0; a < address.length; a++){
                        temp = this.getElementByName(temp,address[a]);
                    }
            
                    return temp;
                };
            };
            
            this.viewport = new function(){
                var canvasData = {
                    width:0, height:0,
                    windowWidth:0, windowHeight:0,
                };
                var location = {
                    position:{x:0,y:0},
                    scale:1,
                    angle:0,
                };
                var mouse = { x:undefined, y:undefined };
                var corners = { tl:{x:0,y:0}, tr:{x:0,y:0}, bl:{x:0,y:0}, br:{x:0,y:0} };
                var boundingBox = { topLeft:{x:0,y:0}, bottomRight:{x:0,y:0} };
            
                function adjustCanvasSize(){
                    var changesMade = false;
                    var defaultSize = {width:640, height:480};
            
                    function dimentionAdjust(direction){
                        var Direction = direction.charAt(0).toUpperCase() + direction.slice(1)
            
                        var attribute = canvas.getAttribute('workspace'+Direction);
                        if( canvasData[direction] != attribute || canvasData['window'+Direction] != window['inner'+Direction] ){
                            //save values for future reference
                                canvasData[direction] = attribute;
                                canvasData['window'+Direction] = window['inner'+Direction];
            
                            //adjust canvas dimention based on the size requirement set out in the workspace attribute
                                if(attribute == undefined){
                                    canvas[direction] = defaultSize[direction];
                                }else if( attribute.indexOf('%') == (attribute.length-1) ){
                                    var parentSize = canvas.parentElement['offset'+Direction]
                                    var percent = parseFloat(attribute.slice(0,(attribute.length-1))) / 100;
                                    canvas[direction] = parentSize * percent;
                                }else{
                                    canvas[direction] = attribute;
                                }
            
                            changesMade = true;
                        }
                    }
            
                    dimentionAdjust('width');
                    dimentionAdjust('height');
            
                    //if changes were made; recalculate the viewport extremities
                        if(changesMade == true){ recalculateViewportExtremities(); }
                }
                function recalculateViewportExtremities(){
                    //for each corner of the viewprt; find out where they lie on the workspace
                        corners.tl = adapter.windowPoint2workspacePoint(0,0);
                        corners.tr = adapter.windowPoint2workspacePoint(canvas.width,0);
                        corners.bl = adapter.windowPoint2workspacePoint(0,canvas.height);
                        corners.br = adapter.windowPoint2workspacePoint(canvas.width,canvas.height);
                    
                    //calculate a bounding box for the viewport from these points
                        boundingBox = canvas.system.utility.boundingBoxFromPoints([corners.tl, corners.tr, corners.br, corners.bl]);
                }
            
                this.mousePosition = function(x,y){
                    if(x == undefined || y == undefined){return {x:mouse.x, y:mouse.y};}
                    mouse.x = x;
                    mouse.y = y;
                };
            
                this.getBoundingBox = function(){return boundingBox;};
                this.position = function(x,y){
                    if(x == undefined || y == undefined){return {x:location.position.x,y:location.position.y};}
                    location.position.x = x;
                    location.position.y = y;
                    recalculateViewportExtremities();
                };
                this.scale = function(s){
                    if(s == undefined){return location.scale;}
                    location.scale = s;
                    recalculateViewportExtremities();
                };
                this.angle = function(a){
                    if(a == undefined){return location.angle;}
                    location.angle = a;
                    recalculateViewportExtremities();
                };
                this.refresh = function(){
                    adjustCanvasSize();
                    recalculateViewportExtremities();
                    canvas.setAttribute('tabIndex',1); //enables keyboard input
                };
            
                this.windowPoint2workspacePoint = function(x,y){return adapter.windowPoint2workspacePoint(x,y);};
                this.workspacePoint2windowPoint = function(x,y){return adapter.workspacePoint2windowPoint(x,y);};
            };
            
            this.render = new function(){
                var imageCache = {};
                var context = canvas.getContext('2d', { alpha: false });
                var draw = new function(){
                    this.clear = function(){
                        context.fillStyle = 'rgb(255,255,255)';
                        context.fillRect(0, 0, canvas.width, canvas.height);
                    };
                    this.dot = function(x,y,r=1,fillStyle='rgba(255,0,0,1)',static=false){
                        //collect element position into a neat package
                            var position = {x:x,y:y};
                    
                        //if the element isn't static; adjust it's position to account for viewport position
                            if(!static){
                                position = adapter.workspacePoint2windowPoint(position.x,position.y); 
                            }
            
                        //actual render
                            context.fillStyle = fillStyle;
                            context.strokeStyle = '';
                            context.lineWidth = '';
                            context.save();
                            context.translate(position.x,position.y);
                            context.beginPath();
                            context.arc(0, 0, adapter.length(r), 0, 2 * Math.PI, false);
                            context.closePath(); 
                            context.fill();
                            context.restore();
                    };
                    this.rectangle = function(x,y,width,height,angle=0,anchor={x:0,y:0},fillStyle='rgba(255,100,255,1)',strokeStyle='rgba(0,0,0,0)',lineWidth=1,static=false){
                        //collect element position into a neat package
                            var position = {location:{x:x,y:y}, angle:angle};
                            var lineWidth_temp = lineWidth;
            
                        //if the element isn't static; adjust it's position and line thickness to account for viewport position
                            if(!static){
                                position.location = adapter.workspacePoint2windowPoint(position.location.x,position.location.y);
                                position.location = canvas.system.utility.cartesianAngleAdjust(position.location.x,position.location.y,-position.angle);
                                position.location.x += adapter.length(-anchor.x*width);
                                position.location.y += adapter.length(-anchor.y*height);
            
                                width = adapter.length(width);
                                height = adapter.length(height);
            
                                lineWidth_temp = adapter.length(lineWidth);
                            }
            
                        //actual render
                            context.fillStyle = fillStyle;
                            context.strokeStyle = strokeStyle;
                            context.lineWidth = lineWidth_temp;
                            context.save();
                            context.rotate( position.angle );
                            context.fillRect( position.location.x, position.location.y, width, height );
                            context.strokeRect( position.location.x, position.location.y, width, height );
                            context.restore();
                    };
                    this.polygon = function(points,fillStyle='rgba(255,100,255,1)',strokeStyle='rgba(0,0,0,0)',lineWidth=1,static=false){
                        //draw polygon path
                            //get initial point and line thickness - if this element isn't static; adjust it's position and line thickness to account for viewport position
                            //otherwise just use the value as is
                                var point = static ? {x:points[0].x,y:points[0].y} : adapter.workspacePoint2windowPoint(points[0].x,points[0].y);
                                var lineWidth_temp = static ? lineWidth : adapter.length(lineWidth);
            
                            //begin drawing and move the inital point
                                context.beginPath(); 
                                context.moveTo(point.x,point.y);
                            
                            //go through all points, drawing lines between each, still checking to see if this element is static, and adjusting
                            //the point's position if not
                                for(var a = 1; a < points.length; a++){
                                    point = static ? {x:points[a].x,y:points[a].y} : adapter.workspacePoint2windowPoint(points[a].x,points[a].y);
                                    context.lineTo(point.x,point.y);
                                }
                                context.closePath(); 
            
                        //paint this shape as requested
                            context.fillStyle = fillStyle;
                            context.strokeStyle = strokeStyle;
                            context.lineWidth = lineWidth_temp;
                            context.fill(); 
                            context.stroke();
                    };
                    this.image = function(x,y,width,height,angle=0,anchor={x:0,y:0},url,static=false){
                        //if the url is missing; draw the default shape
                            if(url == undefined){
                                draw.rect(x,y,width,height,angle,anchor,"rgb(50,50,50)","rgb(255,0,0)",3);
                                console.warn('image element\'s url is invalid or missing',url);
                                return;
                            }
            
                        //collect element position into a neat package
                            var position = {location:{x:x,y:y}, angle:angle};
            
                        //if the element isn't static; adjust it's position to account for viewport position
                            if(!static){
                                position.location = adapter.workspacePoint2windowPoint(position.location.x,position.location.y);
                                position.location = canvas.system.utility.cartesianAngleAdjust(position.location.x,position.location.y,-position.angle);
                                position.location.x += adapter.length(-anchor.x*width);
                                position.location.y += adapter.length(-anchor.y*height);
            
                                width = adapter.length(width);
                                height = adapter.length(height);
                            }
            
                        //if this image url is not cached; cache it
                            if( !imageCache.hasOwnProperty(url) ){
                                imageCache[url] = new Image(); 
                                imageCache[url].src = url;
                            }
                    
                        //actual render (using cached image)
                            context.save();
                            context.rotate( position.angle );
                            context.drawImage( imageCache[url], position.location.x, position.location.y, width, height );
                            context.restore();
                    };
                };
                var animationRequestId = undefined;
            
                function renderFrame(noClear=false){
                    //clear the canvas
                        if(!noClear){ draw.clear(); }
            
                    //sequentially - and recursively - render everything on the elements list (under construction)
                        function renderElement(element,offsetX=0,offsetY=0,offsetAngle=0,static=false){
                            //if element is static, adjust the element's bounding box accordingly
                                if(static){
                                    var tempBoundingBox = {
                                        topLeft:     adapter.windowPoint2workspacePoint(element.boundingBox.topLeft.x,element.boundingBox.topLeft.y),
                                        bottomRight: adapter.windowPoint2workspacePoint(element.boundingBox.bottomRight.x,element.boundingBox.bottomRight.y),
                                    };
                                }else{
                                    var tempBoundingBox = element.boundingBox;
                                }
                                            
                            //use bounding box to determine whether this shape should be rendered
                                if( !canvas.system.utility.detectOverlap.boundingBoxes(core.viewport.getBoundingBox(), tempBoundingBox) ){ return; }
                            
                            //main rendering area
                                switch(element.type){
                                    case 'dot':
                                        //assuming the offset angle is not zero; calculate the correct position of the anchor point
                                            if(offsetAngle != 0){
                                                var point = canvas.system.utility.cartesianAngleAdjust(element.x,element.y,-offsetAngle);
                                                offsetX -= element.x-point.x;
                                                offsetY -= element.y-point.y;
                                            }
            
                                        //render shape
                                            draw.dot( 
                                                element.x+offsetX, element.y+offsetY, 
                                                element.r, 
                                                element.fillStyle,
                                                static
                                            );
                                    break;
                                    case 'rectangle':
                                        //assuming the offset angle is not zero; calculate the correct position of the anchor point
                                            if(offsetAngle != 0){
                                                var point = canvas.system.utility.cartesianAngleAdjust(element.x,element.y,-offsetAngle);
                                                offsetX -= element.x-point.x;
                                                offsetY -= element.y-point.y;
                                            }
            
                                        //render shape
                                            draw.rectangle( 
                                                element.x+offsetX, element.y+offsetY, 
                                                element.width, element.height, 
                                                element.angle+offsetAngle, 
                                                element.anchor, 
                                                element.fillStyle, element.strokeStyle, element.lineWidth,
                                                static
                                            );
                                    break;
                                    case 'image':
                                        //assuming the offset angle is not zero; calculate the correct position of the anchor point
                                            if(offsetAngle != 0){
                                                var point = canvas.system.utility.cartesianAngleAdjust(element.x,element.y,-offsetAngle);
                                                offsetX -= element.x-point.x;
                                                offsetY -= element.y-point.y;
                                            }
            
                                        //render shape
                                            draw.image( 
                                                element.x+offsetX, element.y+offsetY, 
                                                element.width, element.height, 
                                                element.angle+offsetAngle,
                                                element.anchor, 
                                                element.url,
                                                static
                                            );
                                    break;
                                    case 'polygon':
                                        //run through all points in the poly, and account for the offsets
                                            var points = element.points.map( function(a){
                                                //assuming the offset angle is not zero; calculate the correct position of the anchor point
                                                    if(offsetAngle != 0){
                                                        a = canvas.system.utility.cartesianAngleAdjust(a.x,a.y,-offsetAngle);
                                                    }
                                                //add positional offset to point
                                                    return {x:a.x+offsetX, y:a.y+offsetY};
                                            } );
            
                                        //render shape
                                            draw.polygon( 
                                                points, 
                                                element.fillStyle, 
                                                element.strokeStyle, 
                                                element.lineWidth,
                                                static
                                            );
                                    break;
                                    default: console.warn('unknown shape type "'+element.type+'"'); break;
                                }
                        }; 
                        function recursiveRender(group,offsetX=0,offsetY=0,offsetAngle=0,static=false){
                            for(var a = 0; a < group.length; a++){
                                var item = group[a];
            
                                if(item.type == 'group'){ 
                                    var angle = item.angle?item.angle:0;
            
                                    if(offsetAngle != 0){
                                        var point = canvas.system.utility.cartesianAngleAdjust(item.x,item.y,-offsetAngle);
                                        offsetX -= item.x-point.x;
                                        offsetY -= item.y-point.y;
                                    }
            
                                    recursiveRender( item.children, item.x+offsetX, item.y+offsetY, angle+offsetAngle, (static||item.static) );
                                }else{
                                    renderElement( item, offsetX, offsetY, offsetAngle, (static||item.static) );
                                }
                            }
                        }
                        recursiveRender(core.arrangement.getArrangement());
                }
                function animate(timestamp){
                    //attempt to render frame, if there is a failure; stop animation loop and report the error
                        try{
                            renderFrame();
                        }catch(e){
                            cancelAnimationFrame(animationRequestId);
                            animationRequestId = undefined;
                            console.error('major animation error');
                            console.error(e);
                        }
            
                    //perform stats collection
                        core.stats.collect(timestamp);
                    
                    animationRequestId = requestAnimationFrame(animate);
                }
            
                this.frame = function(){renderFrame();};
                this.active = function(bool){
                    if(bool == undefined){return animationRequestId!=undefined;}
            
                    if(bool){
                        if(animationRequestId != undefined){return;}
                        animate();
                    }else{
                        if(animationRequestId == undefined){return;}
                        cancelAnimationFrame(animationRequestId);
                        animationRequestId = undefined;
                    }
                };
            };
            
            this.stats = new function(){
                var active = true;
                var average = 30;
                var lastTimestamp = 0;
            
                var framesPerSecond = {
                    compute:function(timestamp){
                        this.frameTimeArray.push( 1000/(timestamp-lastTimestamp) );
                        if( this.frameTimeArray.length >= average){ this.frameTimeArray.shift(); }
            
                        this.rate = canvas.system.utility.averageArray( this.frameTimeArray );
            
                        lastTimestamp = timestamp;
                    },
                    counter:0,
                    frameTimeArray:[],
                    rate:0,
                };
            
                this.collect = function(timestamp){
                    //if stats are turned off, just bail
                        if(!active){return;}
            
                    framesPerSecond.compute(timestamp);
                };
                this.active = function(bool){if(bool==undefined){return active;} active=bool;};
                this.getReport = function(){
                    return {
                        framesPerSecond: framesPerSecond.rate,
                    };
                };
            };
            
            this.callback = new function(){
                var callbacks = ['onmousedown', 'onmouseup', 'onmousemove', 'onmouseenter', 'onmouseleave', 'onwheel', 'onkeydown', 'onkeyup'];
                for(var a = 0; a < callbacks.length; a++){
                    //interface
                        this[callbacks[a]] = function(x,y,event){};
            
                    //attachment to canvas
                        //default
                            canvas[callbacks[a]] = function(callback){
                                return function(event){
                                    if( !core.callback[callback] ){return;}
                                    var p = adapter.windowPoint2workspacePoint(event.x,event.y);
                                    core.callback[callback](p.x,p.y,event);
                                }
                            }(callbacks[a]);
            
                        //special cases
                            canvas.onmousemove = function(event){
                                if( !core.callback.onmousemove ){return;}
                                var p = adapter.windowPoint2workspacePoint(event.x,event.y);
                                core.callback.onmousemove(p.x,p.y,event);
                                core.viewport.mousePosition(p.x,p.y);
                            };
                            canvas.onkeydown = function(event){
                                if( !core.callback.onkeydown ){return;}
                                var p = core.viewport.mousePosition();
                                core.callback.onkeydown(p.x,p.y,event);
                            };
                            canvas.onkeyup = function(event){
                                if( !core.callback.onkeyup ){return;}
                                var p = core.viewport.mousePosition();
                                core.callback.onkeyup(p.x,p.y,event);
                            };
                }
            };
            
            //initial viewport setup
                core.viewport.refresh();
        };
        canvas.system.mouse = new function(){
            canvas.system.core.callback.onmousedown = function(x,y,event){
                // console.log( canvas.system.core.arrangement.getElementUnderPoint(x,y) );
                // canvas.system.core.arrangement.remove( canvas.system.core.arrangement.getElementUnderPoint(x,y) );
                canvas.system.utility.functionListRunner(canvas.system.mouse.functionList.onmousedown)(event,{x:x,y:y});
            };
            canvas.system.core.callback.onmousemove = function(x,y,event){ 
                canvas.system.utility.functionListRunner(canvas.system.mouse.functionList.onmousemove)(event,{x:x,y:y});
            };
            canvas.system.core.callback.onmouseup = function(x,y,event){ 
                canvas.system.utility.functionListRunner(canvas.system.mouse.functionList.onmouseup)(event,{x:x,y:y});
            };
            canvas.system.core.callback.onmouseleave = function(x,y,event){ 
                canvas.system.utility.functionListRunner(canvas.system.mouse.functionList.onmouseleave)(event,{x:x,y:y});
            };
            canvas.system.core.callback.onmouseenter = function(x,y,event){ 
                canvas.system.utility.functionListRunner(canvas.system.mouse.functionList.onmouseenter)(event,{x:x,y:y});
            };
            canvas.system.core.callback.onwheel = function(x,y,event){
                canvas.system.utility.functionListRunner(canvas.system.mouse.functionList.onwheel)(event,{x:x,y:y});
            };
            
            
            
            this.tmp = {};
            this.functionList = {};
            
            this.functionList.onmousedown = [
                {
                    'specialKeys':[],
                    'function':function(event,data){
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
                    'function':function(event,data){
                        var scaleLimits = {'max':10, 'min':0.1};
            
                        //perform scale and associated pan
                            //discover point under mouse
                                var originalPoint = canvas.system.core.viewport.windowPoint2workspacePoint(event.x,event.y);
                            //perform actual scaling
                                var scale = canvas.system.core.viewport.scale();
                                scale -= scale*(event.deltaY/100);
                                if( scale > scaleLimits.max ){scale = scaleLimits.max;}
                                if( scale < scaleLimits.min ){scale = scaleLimits.min;}
                                canvas.system.core.viewport.scale(scale);
                            //discover point under mouse
                                var newPoint = canvas.system.core.viewport.windowPoint2workspacePoint(event.x,event.y);
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
        canvas.system.keyboard = new function(){
            canvas.system.core.callback.onkeydown = function(x,y,event){
                //if key is already pressed, don't press it again
                    if(canvas.system.keyboard.pressedKeys[event.code]){ return; }
                    canvas.system.keyboard.pressedKeys[event.code] = true;
                
                //perform action
                    canvas.system.utility.functionListRunner(canvas.system.keyboard.functionList.onkeydown)(event,{x:x,y:y});
            };
            canvas.system.core.callback.onkeyup = function(x,y,event){
                //if key isn't pressed, don't release it
                    if(!canvas.system.keyboard.pressedKeys[event.code]){return;}
                    delete canvas.system.keyboard.pressedKeys[event.code];
                
                //perform action
                    canvas.system.utility.functionListRunner(canvas.system.keyboard.functionList.onkeyup)(event,{x:x,y:y});
            };
            
            this.releaseAll = function(){
                for(var a = 0; a < this.pressedKeys.length; a++){
                    this.releaseKey(this.pressedKeys[a]);
                }
            };
            this.releaseKey = function(keyCode){
                canvas.onkeyup( new KeyboardEvent('keyup',{'key':keyCode}) );
            }
            
            this.pressedKeys = {};
            
            this.functionList = {};
            this.functionList.onkeydown = [
                {
                    'specialKeys':[],
                    'function':function(event,data){}
                }
            ];
            this.functionList.onkeyup = [
                {
                    'specialKeys':[],
                    'function':function(event,data){}
                }
            ];
        };
        
        canvas.system.core.render.active(true);
        var staticBackground = canvas.system.core.arrangement.add( undefined, (function(){var temp = canvas.system.core.element.create('group'); temp.name = 'staticBackground'; return temp;})() );
            staticBackground.ignored = true;
            staticBackground.static = true;
            canvas.system.core.arrangement.refresh(staticBackground);
            var test = canvas.system.core.arrangement.add( staticBackground, (function(){var temp = canvas.system.core.element.create('rectangle'); temp.name = 'test'; return temp;})() );
                test.x = 15; test.y = 0;
                test.width = 30; test.height = 30;
                test.fillStyle = 'rgba(255,0,0,0.3)';
                canvas.system.core.arrangement.refresh(test);
        
        var main = canvas.system.core.arrangement.add( undefined, (function(){var temp = canvas.system.core.element.create('group'); temp.name = 'main'; return temp;})() );
            var background = canvas.system.core.arrangement.add( main, (function(){var temp = canvas.system.core.element.create('group'); temp.name = 'background'; return temp;})() );
                var test = canvas.system.core.arrangement.add( background, (function(){var temp = canvas.system.core.element.create('rectangle'); temp.name = 'test'; return temp;})() );
                test.x = 30; test.y = 30;
                test.width = 30; test.height = 30;
                test.fillStyle = 'rgba(255,0,0,0.3)';
                canvas.system.core.arrangement.refresh(test);
                
            var middleground = canvas.system.core.arrangement.add( main, (function(){var temp = canvas.system.core.element.create('group'); temp.name = 'middleground'; return temp;})() );
                var test = canvas.system.core.arrangement.add( middleground, (function(){var temp = canvas.system.core.element.create('rectangle'); temp.name = 'test'; return temp;})() );
                    test.x = 90; test.y = 30;
                    test.width = 30; test.height = 30;
                    test.fillStyle = 'rgba(255,0,0,1)';
                    canvas.system.core.arrangement.refresh(test);
                var test = canvas.system.core.arrangement.add( middleground, (function(){var temp = canvas.system.core.element.create('image'); temp.name = 'testImage'; return temp;})() );
                    test.x = 100; test.y = 30;
                    test.width = 200; test.height = 200;
                    test.angle = 0.3;
                    test.url = 'https://images-na.ssl-images-amazon.com/images/I/61Nx%2BIpgqQL._SY355_.jpg';
                    canvas.system.core.arrangement.refresh(test);
                var test = canvas.system.core.arrangement.add( middleground, (function(){var temp = canvas.system.core.element.create('polygon'); temp.name = 'testPoly'; return temp;})() );
                    test.points = [{x:0,y:0}, {x:10,y:0}, {x:10,y:10}, {x:5,y:20}, {x:0,y:10}];
                    canvas.system.core.arrangement.refresh(test);
                var test = canvas.system.core.arrangement.add( middleground, (function(){var temp = canvas.system.core.element.create('dot'); temp.name = 'testDot'; return temp;})() );
                    test.x = 200; test.y = 100;
                    canvas.system.core.arrangement.refresh(test);
        
            var foreground = canvas.system.core.arrangement.add( main, (function(){var temp = canvas.system.core.element.create('group'); temp.name = 'foreground'; return temp;})() );
                var test = canvas.system.core.arrangement.add( foreground, (function(){var temp = canvas.system.core.element.create('rectangle'); temp.name = 'test'; return temp;})() );
                    test.x = 150; test.y = 30;
                    test.width = 30; test.height = 30;
                    test.fillStyle = 'rgba(255,0,0,0.3)';
                    canvas.system.core.arrangement.refresh(test);
        
        var control = canvas.system.core.arrangement.add( undefined, (function(){var temp = canvas.system.core.element.create('group'); temp.name = 'control'; return temp;})() );
            control.static = true;
            canvas.system.core.arrangement.refresh(control);
            var test = canvas.system.core.arrangement.add( control, (function(){var temp = canvas.system.core.element.create('rectangle'); temp.name = 'test'; return temp;})() );
                test.x = 45; test.y = 60;
                test.width = 30; test.height = 30;
                test.fillStyle = 'rgba(255,0,0,0.3)';
                canvas.system.core.arrangement.refresh(test);
        
        // console.log(canvas.system.core.arrangement.getArrangement());
    }
}