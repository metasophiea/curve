this.text = function(){

    this.type = 'text';

    this.name = '';
    this.ignored = false;
    this.static = false;
    this.parent = undefined;
    this.extremities = {
        points:[],
        boundingBox:{},
    };

    this.x = 0;
    this.y = 0;
    this.text = 'hello';
    this.angle = 0;
    this.size = 1;

    this.style = {
        font:'100px Arial',
        align:'start',                  // start/end/center/lief/right 
        baseline:'alphabetic',          // alphabetic/top/hanging/middle/ideographic/bottom
        fill:'rgba(255,100,100,1)',
        stroke:'rgba(0,0,0,0)',
        lineWidth:1,
        shadowColour:'rgba(0,0,0,0)',
        shadowBlur:2,
        shadowOffset:{x:20, y:20},
    };

    this.computeExtremities = function(offset){
        //if the offset isn't set; that means that this is the element that got the request for extremity recomputation
        //in which case; gather the offset of all parents. Otherwise just use what was provided
            offset = offset == undefined ? gatherParentOffset(this) : offset;

        //reset variables
            this.extremities = {
                points:[],
                boundingBox:{},
            };

        //calculate points
            this.extremities.points = canvas.library.math.pointsOfText( this.text, this.x, this.y, this.angle, 1/this.size, this.style.font, this.style.align, this.style.baseline );
            this.extremities.points = this.extremities.points.map(function(point){
                point = canvas.library.math.cartesianAngleAdjust(point.x,point.y,offset.a);
                point.x += offset.x;
                point.y += offset.y;
                return point;
            });
            //development drawing
                for(var a = 0; a < this.extremities.points.length; a++){
                    var temp = adapter.workspacePoint2windowPoint(this.extremities.points[a].x,this.extremities.points[a].y);
                    core.render.drawDot( temp.x, temp.y, 4, 'rgba(50,50,50,1)' );
                }

        //calculate boundingBox
            this.extremities.boundingBox = canvas.library.math.boundingBoxFromPoints( this.extremities.points );
            //development drawing
                var temp = adapter.workspacePoint2windowPoint(this.extremities.boundingBox.topLeft.x,this.extremities.boundingBox.topLeft.y);
                core.render.drawDot( temp.x, temp.y );
                var temp = adapter.workspacePoint2windowPoint(this.extremities.boundingBox.bottomRight.x,this.extremities.boundingBox.bottomRight.y);
                core.render.drawDot( temp.x, temp.y );

        //update the points and bounding box of the parent
            if(this.parent != undefined){
                this.parent.computeExtremities();
            }
    };

    function isPointWithinBoundingBox(x,y,shape){
        if( shape.extremities.boundingBox == undefined ){console.warn('the shape',shape,'has no bounding box'); return false;}
        return canvas.library.math.detectOverlap.pointWithinBoundingBox( {x:x,y:y}, shape.extremities.boundingBox );
    }
    function isPointWithinHitBox(x,y,shape){
        if( shape.extremities.points == undefined ){console.warn('the shape',shape,'has no points'); return false;}
        return canvas.library.math.detectOverlap.pointWithinPoly( {x:x,y:y}, shape.extremities.points );
    }
    this.isPointWithin = function(x,y){
        if( isPointWithinBoundingBox(x,y,this) ){
            return isPointWithinHitBox(x,y,this);
        }
        return false;
    };

    function shouldRender(shape){ return true; return canvas.library.math.detectOverlap.boundingBoxes(core.viewport.getBoundingBox(), shape.extremities.boundingBox); };
    this.render = function(context,offset={x:0,y:0,a:0,parentAngle:0},static=false){
        //if this shape shouldn't be rendered (according to the shapes 'shouldRender' method)
        //just bail on the whole thing
            if(!shouldRender(this)){return;}

        //adjust offset for parent's angle
            var point = canvas.library.math.cartesianAngleAdjust(this.x,this.y,offset.parentAngle);
            offset.x += point.x - this.x;
            offset.y += point.y - this.y;
        
        //collect and consolidate shape values into a neat package
            var shapeValue = {
                location:{
                    x:(this.x+offset.x),
                    y:(this.y+offset.y)
                },
                size: this.size,
                angle:(this.angle+offset.a),
                lineWidth: this.style.lineWidth,
                shadowBlur: this.style.shadowBlur,
                shadowOffset: { x:this.style.shadowOffset.x, y:this.style.shadowOffset.y },
            };
        
        //adapt values
            shapeValue.location = adapter.workspacePoint2windowPoint( shapeValue.location.x, shapeValue.location.y );   
      
            shapeValue.size = adapter.length(shapeValue.size);
            shapeValue.lineWidth = adapter.length(shapeValue.lineWidth);
            shapeValue.shadowBlur = adapter.length(shapeValue.shadowBlur);
            shapeValue.shadowOffset.x = adapter.length(shapeValue.shadowOffset.x);
            shapeValue.shadowOffset.y = adapter.length(shapeValue.shadowOffset.y);

        //post adaptation calculations
            shapeValue.location = canvas.library.math.cartesianAngleAdjust(shapeValue.location.x,shapeValue.location.y,-shapeValue.angle);

        //actual render
            context.font = this.style.font;
            context.textAlign = this.style.align;
            context.textBaseline = this.style.baseline;
            context.fillStyle = this.style.fill;
            context.strokeStyle = this.style.stroke;
            context.lineWidth = shapeValue.lineWidth;
            context.shadowColor = this.style.shadowColour;
            context.shadowBlur = shapeValue.shadowBlur;
            context.shadowOffsetX = shapeValue.shadowOffset.x;
            context.shadowOffsetY = shapeValue.shadowOffset.y;

            context.save();
            context.rotate( shapeValue.angle );
            context.scale(shapeValue.size,shapeValue.size);
            context.fillText( this.text, shapeValue.location.x/shapeValue.size, shapeValue.location.y/shapeValue.size );
            context.shadowColor = 'rgba(0,0,0,0)'; //to stop stroke shadows drawing over the fill text (an uncreative solution)
            context.strokeText( this.text, shapeValue.location.x/shapeValue.size, shapeValue.location.y/shapeValue.size );
            context.restore();
    };
};