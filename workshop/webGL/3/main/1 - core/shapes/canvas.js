this.canvas = function(){
    var self = this;

    //attributes 
        //protected attributes
            const type = 'canvas'; this.getType = function(){return type;}

        //simple attributes
            this.name = '';
            this.parent = undefined;
            this.dotFrame = false;
            this.extremities = { points:[], boundingBox:{}, isChanged:true };
            this.ignored = false;

        //attributes pertinent to extremity calculation
            var x = 0;              this.x =      function(a){ if(a==undefined){return x;}      x = a;      this.extremities.isChanged = true; this.computeExtremities(); updateDimentions(); };
            var y = 0;              this.y =      function(a){ if(a==undefined){return y;}      y = a;      this.extremities.isChanged = true; this.computeExtremities(); updateDimentions(); };
            var angle = 0;          this.angle =  function(a){ if(a==undefined){return angle;}  angle = a;  this.extremities.isChanged = true; this.computeExtremities(); updateDimentions(); };
            var anchor = {x:0,y:0}; this.anchor = function(a){ if(a==undefined){return anchor;} anchor = a; this.extremities.isChanged = true; this.computeExtremities(); updateDimentions(); };
            var width = 10;         this.width =  function(a){ if(a==undefined){return width;}  width = a;  this.extremities.isChanged = true; this.computeExtremities(); updateDimentions(); };
            var height = 10;        this.height = function(a){ if(a==undefined){return height;} height = a; this.extremities.isChanged = true; this.computeExtremities(); updateDimentions(); };
            var scale = 1;          this.scale =  function(a){ if(a==undefined){return scale;}  scale = a;  this.extremities.isChanged = true; this.computeExtremities(); updateDimentions(); };

        //subCanvas
            var subCanvas = { object:document.createElement('canvas'), context:undefined, resolution:1, isChanged:true };
            subCanvas.context = subCanvas.object.getContext('2d');

            function updateDimentions(){
                subCanvas.object.setAttribute('width',width*subCanvas.resolution);
                subCanvas.object.setAttribute('height',height*subCanvas.resolution);
                subCanvas.isChanged = true;
            }
            updateDimentions();

            this._ = subCanvas.context;
            this.$ = function(a){return a*subCanvas.resolution;};
            this.resolution = function(a){
                if(a == undefined){return subCanvas.resolution;}
                subCanvas.resolution = a;
                updateDimentions();
            };
            this.requestUpdate = function(){ subCanvas.isChanged = true; };

    //addressing
        this.getAddress = function(){ return this.parent.getAddress() + '/' + this.name; };

    //webGL rendering
        var points = [
            0,0,
            1,0,
            1,1,
            0,1,
        ];
        var vertexShaderSource = `
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
                uniform vec2 dimensions;
                uniform vec2 anchor;

            //vertex/fragment shader transfer variables
                varying vec2 textureCoordinates;

            void main(){
                //transfer point to fragment shader
                    textureCoordinates = point;

                //using the 'adjust' values; perform anchored rotation, and leave shape with it's anchor over the chosen point
                //(including scale adjust)
                    vec2 P = point * dimensions * adjust.scale;
                    P = vec2( P.x - dimensions.x*anchor.x, P.y - dimensions.y*anchor.y );
                    P = vec2( 
                        P.x*cos(adjust.angle) + P.y*sin(adjust.angle), 
                        P.y*cos(adjust.angle) - P.x*sin(adjust.angle)
                    );
                    P += adjust.xy;

                //convert from unit space to clipspace
                    gl_Position = vec4( (((P / resolution) * 2.0) - 1.0) * vec2(1, -1), 0, 1 );
            }
        `;
        var fragmentShaderSource = `  
            precision mediump float;

            uniform sampler2D textureImage;
            varying vec2 textureCoordinates;
                                                                        
            void main(){
                gl_FragColor = texture2D(textureImage, textureCoordinates);
            }
        `;
        var pointBuffer;
        var pointAttributeLocation;
        var uniformLocations;
        var subCanvasTexture;
        function updateGLAttributes(context,adjust){
            //buffers
                //points
                    if(pointBuffer == undefined){
                        pointAttributeLocation = context.getAttribLocation(program, "point");
                        pointBuffer = context.createBuffer();
                        context.enableVertexAttribArray(pointAttributeLocation);
                        context.bindBuffer(context.ARRAY_BUFFER, pointBuffer); 
                        context.vertexAttribPointer( pointAttributeLocation, 2, context.FLOAT,false, 0, 0 );
                        context.bufferData(context.ARRAY_BUFFER, new Float32Array(points), context.STATIC_DRAW);
                    }else{
                        context.bindBuffer(context.ARRAY_BUFFER, pointBuffer); 
                        context.vertexAttribPointer( pointAttributeLocation, 2, context.FLOAT,false, 0, 0 );
                    }

                //texture
                    if(subCanvas.isChanged){
                        subCanvas.isChanged = false;
                        subCanvasTexture = context.createTexture();
                        context.bindTexture(context.TEXTURE_2D, subCanvasTexture);
                        context.texParameteri( context.TEXTURE_2D, context.TEXTURE_WRAP_S, context.CLAMP_TO_EDGE );
                        context.texParameteri( context.TEXTURE_2D, context.TEXTURE_WRAP_T, context.CLAMP_TO_EDGE );
                        context.texParameteri( context.TEXTURE_2D, context.TEXTURE_MIN_FILTER, context.NEAREST );
                        context.texParameteri( context.TEXTURE_2D, context.TEXTURE_MAG_FILTER, context.NEAREST );
                        context.texImage2D(context.TEXTURE_2D, 0, context.RGBA, context.RGBA, context.UNSIGNED_BYTE, subCanvas.object);
                    }else{
                        context.bindTexture(context.TEXTURE_2D, subCanvasTexture);
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
                    };
                }

                context.uniform2f(uniformLocations["adjust.xy"], adjust.x, adjust.y);
                context.uniform1f(uniformLocations["adjust.scale"], adjust.scale);
                context.uniform1f(uniformLocations["adjust.angle"], adjust.angle);
                context.uniform2f(uniformLocations["resolution"], context.canvas.width, context.canvas.height);
                context.uniform2f(uniformLocations["dimensions"], width, height);
                context.uniform2f(uniformLocations["anchor"], anchor.x, anchor.y);
        }
        var program;
        function activateGLRender(context,adjust){
            if(program == undefined){ program = core.render.produceProgram('canvas', vertexShaderSource, fragmentShaderSource); }
            
            context.useProgram(program);
            updateGLAttributes(context,adjust);
            context.drawArrays(context.TRIANGLE_FAN, 0, 4);
        }

    //extremities
        function computeExtremities(informParent=true,offset){
            //get offset from parent
                if(offset == undefined){ offset = self.parent ? self.parent.getOffset() : {x:0,y:0,scale:1,angle:0}; }

            //calculate points based on the offset
                var point = _canvas_.library.math.cartesianAngleAdjust(x,y,offset.angle);
                var adjusted = { 
                    x: point.x*offset.scale + offset.x,
                    y: point.y*offset.scale + offset.y,
                    scale: offset.scale*scale,
                    angle: -(offset.angle + angle),
                };

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
                if(informParent){ if(self.parent){self.parent.computeExtremities();} }
        }
        var oldOffset = {x:undefined,y:undefined,scale:undefined,angle:undefined};
        this.computeExtremities = function(informParent,offset){
            if(offset == undefined){ offset = self.parent ? self.parent.getOffset() : {x:0,y:0,scale:1,angle:0}; }

            if(
                this.extremities.isChanged ||
                oldOffset.x != offset.x || oldOffset.y != offset.y || oldOffset.scale != offset.scale || oldOffset.angle != offset.angle
            ){
                computeExtremities(informParent,offset);
                this.extremities.isChanged = false;
                oldOffset.x = offset.x;
                oldOffset.y = offset.y;
                oldOffset.scale = offset.scale;
                oldOffset.angle = offset.angle;
            }
        };

    //lead render
        function drawDotFrame(){
            self.extremities.points.forEach(a => core.render.drawDot(a.x,a.y));

            var tl = self.extremities.boundingBox.topLeft;
            var br = self.extremities.boundingBox.bottomRight;
            core.render.drawDot(tl.x,tl.y,2,{r:0,g:0,b:0,a:1});
            core.render.drawDot(br.x,br.y,2,{r:0,g:0,b:0,a:1});
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