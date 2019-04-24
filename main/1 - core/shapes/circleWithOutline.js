this.circleWithOutline = function(){
    var self = this;

    //attributes 
        //protected attributes
            const type = 'circleWithOutline'; this.getType = function(){return type;}

        //simple attributes
            this.name = '';
            this.parent = undefined;
            this.dotFrame = false;
            this.extremities = { points:[], boundingBox:{} };
            this.ignored = false;
            this.colour = {r:1,g:0,b:0,a:1};
            this.lineColour = {r:0,g:0,b:0,a:1};
        //advanced use attributes
            this.devMode = false;
            this.stopAttributeStartedExtremityUpdate = false;

        //attributes pertinent to extremity calculation
            var x = 0;         this.x =         function(a){ if(a==undefined){return x;}         x = a;         if(this.devMode){console.log(this.getAddress()+'::x');} if(this.stopAttributeStartedExtremityUpdate){return;} computeExtremities(); };
            var y = 0;         this.y =         function(a){ if(a==undefined){return y;}         y = a;         if(this.devMode){console.log(this.getAddress()+'::y');} if(this.stopAttributeStartedExtremityUpdate){return;} computeExtremities(); };
            var angle = 0;     this.angle =     function(a){ if(a==undefined){return angle;}     angle = a;     if(this.devMode){console.log(this.getAddress()+'::angle');} if(this.stopAttributeStartedExtremityUpdate){return;} computeExtremities(); };
            var radius = 10;   this.radius =    function(a){ if(a==undefined){return radius;}    radius = a;    if(this.devMode){console.log(this.getAddress()+'::radius');} if(this.stopAttributeStartedExtremityUpdate){return;} computeExtremities(); };
            var scale = 1;     this.scale =     function(a){ if(a==undefined){return scale;}     scale = a;     if(this.devMode){console.log(this.getAddress()+'::scale');} if(this.stopAttributeStartedExtremityUpdate){return;} computeExtremities(); };
            var thickness = 2; this.thickness = function(a){ if(a==undefined){return thickness;} thickness = a; if(this.devMode){console.log(this.getAddress()+'::thickness');} /*if(this.stopAttributeStartedExtremityUpdate){return;} computeExtremities();*/ };
            var detail = 25;   this.detail =    function(a){ 
                                   if(a==undefined){return detail;} detail = a;
                                   if(this.devMode){console.log(this.getAddress()+'::detail');}

                                   generatePoints();

                                   if(this.stopAttributeStartedExtremityUpdate){return;} 
                                   computeExtremities();
                               };

    //addressing
        this.getAddress = function(){ return (this.parent != undefined ? this.parent.getAddress() : '') + '/' + this.name; };

    //webGL rendering functions
        var points = []; 
        var pointsChanged = true;
        function generatePoints(){
            points = [];

            //outline
                for(var a = 0; a < detail; a++){
                    points.push(0,0);
                    points.push( Math.sin( 2*Math.PI * (a/detail) ), Math.cos( 2*Math.PI * (a/detail) ) );
                    points.push( Math.sin( 2*Math.PI * ((a+1)/detail) ), Math.cos( 2*Math.PI * ((a+1)/detail) ) );
                }
            //main circle
                for(var a = 0; a < detail; a++){
                    points.push(0,0);
                    points.push( Math.sin( 2*Math.PI * (a/detail) ), Math.cos( 2*Math.PI * (a/detail) ) );
                    points.push( Math.sin( 2*Math.PI * ((a+1)/detail) ), Math.cos( 2*Math.PI * ((a+1)/detail) ) );
                }

            pointsChanged = true;
        }
        this.detail(detail);
        var vertexShaderSource = 
            _canvas_.library.gsls.geometry + `
            //index
                attribute lowp float index;
            
            //constants
                attribute vec2 point;

            //variables
                struct location{
                    vec2 xy;
                    float scale;
                    float angle;
                };
                uniform location adjust;

                uniform vec2 resolution;
                uniform float radius;
                uniform float thickness;
                uniform vec4 colour;
                uniform vec4 lineColour;
                uniform lowp float indexParting;
        
            //varyings
                varying vec4 activeColour;

            void main(){    
                //adjust points by radius and xy offset
                    float tmpRadius = radius + (thickness/2.0) * (index < indexParting ? 1.0 : -1.0);
                    vec2 P = cartesianAngleAdjust(point*tmpRadius*adjust.scale, -adjust.angle) + adjust.xy;

                //select colour
                    activeColour = index >= indexParting ? colour : lineColour;

                //convert from unit space to clipspace
                    gl_Position = vec4( (((P / resolution) * 2.0) - 1.0) * vec2(1, -1), 0, 1 );
            }
        `;
        var fragmentShaderSource = `  
            precision mediump float;
            varying vec4 activeColour;
                                                                        
            void main(){
                gl_FragColor = activeColour;
            }
        `;
        var index = { buffer:undefined, attributeLocation:undefined };
        var point = { buffer:undefined, attributeLocation:undefined };
        var uniformLocations;
        function updateGLAttributes(context,adjust){
            //buffers
                //points
                    if(point.buffer == undefined || pointsChanged){
                        point.attributeLocation = context.getAttribLocation(program, "point");
                        point.buffer = context.createBuffer();
                        context.enableVertexAttribArray(point.attributeLocation);
                        context.bindBuffer(context.ARRAY_BUFFER, point.buffer); 
                        context.vertexAttribPointer( point.attributeLocation, 2, context.FLOAT,false, 0, 0 );
                        context.bufferData(context.ARRAY_BUFFER, new Float32Array(points), context.STATIC_DRAW);
                        pointsChanged = false;
                    }else{
                        context.bindBuffer(context.ARRAY_BUFFER, point.buffer); 
                        context.vertexAttribPointer( point.attributeLocation, 2, context.FLOAT,false, 0, 0 );
                    }

                //index
                    if(index.buffer == undefined || pointsChanged){
                        index.attributeLocation = context.getAttribLocation(program, "index");
                        index.buffer = context.createBuffer();
                        context.enableVertexAttribArray(index.attributeLocation);
                        context.bindBuffer(context.ARRAY_BUFFER, index.buffer); 
                        context.vertexAttribPointer( index.attributeLocation, 1, context.FLOAT, false, 0, 0 );
                        context.bufferData(context.ARRAY_BUFFER, new Float32Array(Array.apply(null, {length:points.length/2}).map(Number.call, Number)), context.STATIC_DRAW);
                    }else{
                        context.bindBuffer(context.ARRAY_BUFFER, index.buffer);
                        context.vertexAttribPointer( index.attributeLocation, 1, context.FLOAT, false, 0, 0 );
                    }

            //uniforms
                if( uniformLocations == undefined ){
                    uniformLocations = {
                        "adjust.xy": context.getUniformLocation(program, "adjust.xy"),
                        "adjust.scale": context.getUniformLocation(program, "adjust.scale"),
                        "adjust.angle": context.getUniformLocation(program, "adjust.angle"),
                        "resolution": context.getUniformLocation(program, "resolution"),
                        "radius": context.getUniformLocation(program, "radius"),
                        "thickness": context.getUniformLocation(program, "thickness"),
                        "colour": context.getUniformLocation(program, "colour"),
                        "indexParting": context.getUniformLocation(program, "indexParting"),
                        "lineColour": context.getUniformLocation(program, "lineColour"),
                    };
                }

                context.uniform2f(uniformLocations["adjust.xy"], adjust.x, adjust.y);
                context.uniform1f(uniformLocations["adjust.scale"], adjust.scale);
                context.uniform1f(uniformLocations["adjust.angle"], adjust.angle);
                context.uniform2f(uniformLocations["resolution"], context.canvas.width, context.canvas.height);
                context.uniform1f(uniformLocations["radius"], radius);
                context.uniform1f(uniformLocations["thickness"], thickness);
                context.uniform4f(uniformLocations["colour"], self.colour.r, self.colour.g, self.colour.b, self.colour.a);
                context.uniform1f(uniformLocations["indexParting"], points.length/4);
                context.uniform4f(uniformLocations["lineColour"], self.lineColour.r, self.lineColour.g, self.lineColour.b, self.lineColour.a);
        }
        var program;
        function activateGLRender(context,adjust){
            if(program == undefined){ program = core.render.produceProgram(self.getType(), vertexShaderSource, fragmentShaderSource); }

            context.useProgram(program);
            updateGLAttributes(context,adjust);
            context.drawArrays(context.TRIANGLES, 0, points.length/2);
        }

    //extremities
        function computeExtremities(informParent=true,offset){
            if(self.devMode){console.log(self.getAddress()+'::computeExtremities');}

            //get offset from parent, if one isn't provided
                if(offset == undefined){ offset = self.parent && !self.static ? self.parent.getOffset() : {x:0,y:0,scale:1,angle:0}; }
            //calculate adjusted offset based on the offset
                var point = _canvas_.library.math.cartesianAngleAdjust(x,y,offset.angle);
                var adjusted = { 
                    x: point.x*offset.scale + offset.x,
                    y: point.y*offset.scale + offset.y,
                    scale: offset.scale*scale,
                    angle: -(offset.angle + angle),
                };
            //calculate points based on the adjusted offset
                self.extremities.points = [];
                for(var a = 0; a < points.length; a+=2){
                    self.extremities.points.push({
                        x: (points[a]   * radius * adjusted.scale) + adjusted.x,
                        y: (points[a+1] * radius * adjusted.scale) + adjusted.y,
                    });
                }
                self.extremities.boundingBox = _canvas_.library.math.boundingBoxFromPoints(self.extremities.points);
            //if told to do so, inform parent (if there is one) that extremities have changed
                if(informParent){ if(self.parent){self.parent.updateExtremities();} }
        }
        this.computeExtremities = computeExtremities;

    //lead render
        function drawDotFrame(){
            //draw shape extremity points
                self.extremities.points.forEach(a => core.render.drawDot(a.x,a.y));
            //draw bounding box top left and bottom right points
                core.render.drawDot(self.extremities.boundingBox.topLeft.x,self.extremities.boundingBox.topLeft.y,2,{r:0,g:0,b:1,a:1});
                core.render.drawDot(self.extremities.boundingBox.bottomRight.x,self.extremities.boundingBox.bottomRight.y,2,{r:0,g:0,b:1,a:1});
        };
        this.render = function(context,offset={x:0,y:0,scale:1,angle:0}){            
            //combine offset with shape's position, angle and scale to produce adjust value for render
                var point = _canvas_.library.math.cartesianAngleAdjust(x,y,offset.angle);
                var adjust = { 
                    x: point.x*offset.scale + offset.x,
                    y: point.y*offset.scale + offset.y,
                    scale: offset.scale*scale,
                    angle: -(offset.angle + angle),
                };

            //activate shape render code
                activateGLRender(context,adjust);

            //if requested; draw dot frame
                if(self.dotFrame){drawDotFrame();}
        };
};