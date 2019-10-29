this.rectangle = function(){
    var self = this;

    //attributes 
        //protected attributes
            const type = 'rectangle'; this.getType = function(){return type;}

        //simple attributes
            this.name = '';
            this.parent = undefined;
            this.dotFrame = false;
            this.extremities = { points:[], boundingBox:{bottomRight:{x:0, y:0}, topLeft:{x:0, y:0}} };
            this.ignored = false;
            this.colour = {r:1,g:0,b:0,a:1};
        //advanced use attributes
            this.devMode = false;
            this.stopAttributeStartedExtremityUpdate = false;

        //attributes pertinent to extremity calculation
            var x = 0;              this.x =      function(a){ if(a==undefined){return x;}      x = a;      if(this.devMode){console.log(this.getAddress()+'::x');} if(this.stopAttributeStartedExtremityUpdate){return;} computeExtremities(); };
            var y = 0;              this.y =      function(a){ if(a==undefined){return y;}      y = a;      if(this.devMode){console.log(this.getAddress()+'::y');} if(this.stopAttributeStartedExtremityUpdate){return;} computeExtremities(); };
            var angle = 0;          this.angle =  function(a){ if(a==undefined){return angle;}  angle = a;  if(this.devMode){console.log(this.getAddress()+'::angle');} if(this.stopAttributeStartedExtremityUpdate){return;} computeExtremities(); };
            var anchor = {x:0,y:0}; this.anchor = function(a){ if(a==undefined){return anchor;} anchor = a; if(this.devMode){console.log(this.getAddress()+'::anchor');} if(this.stopAttributeStartedExtremityUpdate){return;} computeExtremities(); };
            var width = 10;         this.width =  function(a){ if(a==undefined){return width;}  width = a;  if(this.devMode){console.log(this.getAddress()+'::width');} if(this.stopAttributeStartedExtremityUpdate){return;} computeExtremities(); };
            var height = 10;        this.height = function(a){ if(a==undefined){return height;} height = a; if(this.devMode){console.log(this.getAddress()+'::height');} if(this.stopAttributeStartedExtremityUpdate){return;} computeExtremities(); };
            var scale = 1;          this.scale =  function(a){ if(a==undefined){return scale;}  scale = a;  if(this.devMode){console.log(this.getAddress()+'::scale');} if(this.stopAttributeStartedExtremityUpdate){return;} computeExtremities(); };

    //addressing
        this.getAddress = function(){ return (this.parent != undefined ? this.parent.getAddress() : '') + '/' + this.name; };

    //webGL rendering functions
        var points = [
            0,0,
            1,0,
            1,1,
            0,1,
        ];
        var vertexShaderSource = `#version 300 es
            //constants
                in vec2 point;

            //variables
                struct location{
                    vec2 xy;
                    float scale;
                    float angle;
                };
                uniform location adjust;

                uniform vec2 resolution;
                uniform vec2 dimensions;
                uniform vec2 anchor;

            void main(){
                //using the 'adjust' values; perform anchored rotation, and leave shape with it's anchor over the chosen point
                    vec2 P = dimensions * adjust.scale * (point - anchor);
                    P = vec2( P.x*cos(adjust.angle) + P.y*sin(adjust.angle), P.y*cos(adjust.angle) - P.x*sin(adjust.angle) ) + adjust.xy;

                //convert from unit space to clipspace
                    gl_Position = vec4( (((P / resolution) * 2.0) - 1.0) * vec2(1, -1), 0, 1 );
            }
        `;
        var fragmentShaderSource = `#version 300 es
            precision mediump float;
            out vec4 outputColor;
            uniform vec4 colour;
                                                                        
            void main(){
                outputColor = colour;
            }
        `;
        var point = { buffer:undefined, attributeLocation:undefined };
        var uniformLocations;
        function updateGLAttributes(context,adjust){
            //buffers
                //points
                    if(point.buffer == undefined){
                        point.attributeLocation = context.getAttribLocation(program, "point");
                        point.buffer = context.createBuffer();
                        context.enableVertexAttribArray(point.attributeLocation);
                        context.bindBuffer(context.ARRAY_BUFFER, point.buffer); 
                        context.vertexAttribPointer( point.attributeLocation, 2, context.FLOAT,false, 0, 0 );
                        context.bufferData(context.ARRAY_BUFFER, new Float32Array(points), context.STATIC_DRAW);
                    }else{
                        context.bindBuffer(context.ARRAY_BUFFER, point.buffer); 
                        context.vertexAttribPointer( point.attributeLocation, 2, context.FLOAT,false, 0, 0 );
                    }
            
            //uniforms
                if( uniformLocations == undefined ){
                    uniformLocations = {
                        "adjust.xy": context.getUniformLocation(program, "adjust.xy"),
                        "adjust.scale": context.getUniformLocation(program, "adjust.scale"),
                        "adjust.angle": context.getUniformLocation(program, "adjust.angle"),
                        "resolution": context.getUniformLocation(program, "resolution"),
                        "dimensions": context.getUniformLocation(program, "dimensions"),
                        "anchor": context.getUniformLocation(program, "anchor"),
                        "colour": context.getUniformLocation(program, "colour"),
                    };
                }

                context.uniform2f(uniformLocations["adjust.xy"], adjust.x, adjust.y);
                context.uniform1f(uniformLocations["adjust.scale"], adjust.scale);
                context.uniform1f(uniformLocations["adjust.angle"], adjust.angle);
                context.uniform2f(uniformLocations["resolution"], context.canvas.width, context.canvas.height);
                context.uniform2f(uniformLocations["dimensions"], width, height);
                context.uniform2f(uniformLocations["anchor"], anchor.x, anchor.y);
                context.uniform4f(uniformLocations["colour"], self.colour.r, self.colour.g, self.colour.b, self.colour.a);
        }
        var program;
        function activateGLRender(context,adjust){
            if(program == undefined){ program = core.render.produceProgram(self.getType(), vertexShaderSource, fragmentShaderSource); }
    
            context.useProgram(program);
            updateGLAttributes(context,adjust);
            context.drawArrays(context.TRIANGLE_FAN, 0, 4);
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
                    var P = {
                        x: adjusted.scale * width * (points[a] - anchor.x), 
                        y: adjusted.scale * height * (points[a+1] - anchor.y), 
                    };

                    self.extremities.points.push({ 
                        x: P.x*Math.cos(adjusted.angle) + P.y*Math.sin(adjusted.angle) + adjusted.x,
                        y: P.y*Math.cos(adjusted.angle) - P.x*Math.sin(adjusted.angle) + adjusted.y,
                    });
                }
                self.extremities.boundingBox = _canvas_.library.math.boundingBoxFromPoints(self.extremities.points);
        
            //if told to do so, inform parent (if there is one) that extremities have changed
                if(informParent){ if(self.parent){self.parent.updateExtremities();} }
        }
        this.computeExtremities = computeExtremities;
        this.__ext = function(){return JSON.stringify(this.extremities);};

    //lead render
        function drawDotFrame(){
            //draw shape extremity points
                self.extremities.points.forEach(a => core.render.drawDot(a.x,a.y));
            //draw bounding box top left and bottom right points
                core.render.drawDot(self.extremities.boundingBox.topLeft.x,self.extremities.boundingBox.topLeft.y,3,{r:0,g:1,b:1,a:0.5});
                core.render.drawDot(self.extremities.boundingBox.bottomRight.x,self.extremities.boundingBox.bottomRight.y,3,{r:0,g:1,b:1,a:0.5});
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