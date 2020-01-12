this.rectangle = function(name,_id){
    const self = this;

    //attributes 
        //protected attributes
            const type = 'rectangle'; 
            this.getType = function(){return type;}
            const id = _id; 
            this.getId = function(){return id;}

        //simple attributes
            this.name = name;
            this.parent = undefined;
            this.dotFrame = false;
            this.extremities = { points:[], boundingBox:{bottomRight:{x:0, y:0}, topLeft:{x:0, y:0}} };
            let ignored = false;
            this.ignored = function(a){
                if(a==undefined){return ignored;}     
                ignored = a;
                dev.log.elementLibrary(type,self.getAddress(),'.ignored('+a+')'); //#development
                computeExtremities();
            };
            let colour = {r:1,g:0,b:0,a:1};
            this.colour = function(a){
                if(a==undefined){return colour;}     
                colour = a;
                dev.log.elementLibrary(type,self.getAddress(),'.colour('+JSON.stringify(a)+')'); //#development
                computeExtremities();
            };
        
        //attributes pertinent to extremity calculation
            let x = 0;
            let y = 0; 
            let angle = 0;
            let anchor = {x:0,y:0};
            let width = 10;
            let height = 10;
            let scale = 1;
            let static = false;
            this.x = function(a){ 
                if(a==undefined){return x;}     
                x = a;     
                dev.log.elementLibrary(type,self.getAddress(),'.x('+a+')'); //#development
                computeExtremities();
            };
            this.y = function(a){ 
                if(a==undefined){return y;}     
                y = a;
                dev.log.elementLibrary(type,self.getAddress(),'.y('+a+')'); //#development
                computeExtremities();
            };
            this.angle = function(a){ 
                if(a==undefined){return angle;} 
                angle = a;
                dev.log.elementLibrary(type,self.getAddress(),'.angle('+a+')'); //#development
                computeExtremities();
            };
            this.anchor = function(a){
                if(a==undefined){return anchor;} 
                anchor = a; 
                dev.log.elementLibrary(type,self.getAddress(),'.anchor('+JSON.stringify(a)+')'); //#development
                computeExtremities();
            };
            this.width = function(a){
                if(a==undefined){return width;}  
                width = a;  
                dev.log.elementLibrary(type,self.getAddress(),'.width('+a+')'); //#development
                computeExtremities();
            };
            this.height = function(a){
                if(a==undefined){return height;} 
                height = a; 
                dev.log.elementLibrary(type,self.getAddress(),'.height('+a+')'); //#development
                computeExtremities();
            };
            this.scale = function(a){ 
                if(a==undefined){return scale;} 
                scale = a;
                dev.log.elementLibrary(type,self.getAddress(),'.scale('+a+')'); //#development
                computeExtremities();
            };
            this.static = function(a){
                if(a==undefined){return static;}  
                static = a;  
                dev.log.elementLibrary(type,self.getAddress(),'.static('+a+')'); //#development
                computeExtremities();
            };
            this.unifiedAttribute = function(attributes){
                if(attributes==undefined){ return {x:x, y:y, angle:angle, anchor:anchor, width:width, height:height, scale:scale, ignored:ignored, colour:colour, static:static}; } 
                dev.log.elementLibrary(type,self.getAddress(),'.unifiedAttribute('+JSON.stringify(attributes)+')'); //#development

                if('ignored' in attributes){ 
                    dev.log.elementLibrary(type,self.getAddress(),'.unifiedAttribute -> updating "ignored" to '+attributes.ignored); //#development
                    ignored = attributes.ignored;
                }
                if('colour' in attributes){
                    dev.log.elementLibrary(type,self.getAddress(),'.unifiedAttribute -> updating "colour" to '+attributes.colour); //#development
                    colour = attributes.colour;
                }

                if('x' in attributes){ 
                    dev.log.elementLibrary(type,self.getAddress(),'.unifiedAttribute -> updating "x" to '+attributes.x); //#development
                    x = attributes.x;
                }
                if('y' in attributes){ 
                    dev.log.elementLibrary(type,self.getAddress(),'.unifiedAttribute -> updating "y" to '+attributes.y); //#development
                    y = attributes.y;
                }
                if('angle' in attributes){ 
                    dev.log.elementLibrary(type,self.getAddress(),'.unifiedAttribute -> updating "angle" to '+attributes.angle); //#development
                    angle = attributes.angle;
                }
                if('anchor' in attributes){
                    dev.log.elementLibrary(type,self.getAddress(),'.unifiedAttribute -> updating "anchor" to '+attributes.anchor); //#development
                    anchor = attributes.anchor;
                }
                if('width' in attributes){
                    dev.log.elementLibrary(type,self.getAddress(),'.unifiedAttribute -> updating "width" to '+attributes.width); //#development
                    width = attributes.width;
                }
                if('height' in attributes){
                    dev.log.elementLibrary(type,self.getAddress(),'.unifiedAttribute -> updating "height" to '+attributes.height); //#development
                    height = attributes.height;
                }
                if('scale' in attributes){ 
                    dev.log.elementLibrary(type,self.getAddress(),'.unifiedAttribute -> updating "scale" to '+attributes.scale); //#development
                    scale = attributes.scale;
                }
                if('static' in attributes){ 
                    dev.log.elementLibrary(type,self.getAddress(),'.unifiedAttribute -> updating "static" to '+attributes.static); //#development
                    scale = attributes.static;
                }

                computeExtremities();
            };

    //addressing
        this.getAddress = function(){ return (self.parent != undefined ? self.parent.getAddress() : '') + '/' + self.name; };

    //webGL rendering functions
        let points = [
            0,0,
            1,0,
            1,1,
            0,1,
        ];
        let vertexShaderSource = `#version 300 es
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
        let fragmentShaderSource = `#version 300 es
            precision mediump float;
            out vec4 outputColor;
            uniform vec4 colour;
                                                                        
            void main(){
                outputColor = colour;
            }
        `;
        let point = { buffer:undefined, attributeLocation:undefined };
        let uniformLocations;
        function updateGLAttributes(context,adjust){
            dev.log.elementLibrary(type,self.getAddress(),'::updateGLAttributes(-context-,'+JSON.stringify(adjust)+')'); //#development

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

                dev.log.elementLibrary(type,self.getAddress(),'::updateGLAttributes -> adjust.x:'+adjust.x+' adjust.y:'+adjust.y); //#development
                dev.log.elementLibrary(type,self.getAddress(),'::updateGLAttributes -> adjust.scale:'+adjust.scale); //#development
                dev.log.elementLibrary(type,self.getAddress(),'::updateGLAttributes -> adjust.angle:'+adjust.angle); //#development
                dev.log.elementLibrary(type,self.getAddress(),'::updateGLAttributes -> '+context.canvas.width+' '+context.canvas.height); //#development
                dev.log.elementLibrary(type,self.getAddress(),'::updateGLAttributes -> width:'+width+' height:'+height); //#development
                dev.log.elementLibrary(type,self.getAddress(),'::updateGLAttributes -> anchor.x:'+anchor.x+' anchor.y:'+anchor.y); //#development
                dev.log.elementLibrary(type,self.getAddress(),'::updateGLAttributes -> colour:'+JSON.stringify(colour)); //#development
                context.uniform2f(uniformLocations["adjust.xy"], adjust.x, adjust.y);
                context.uniform1f(uniformLocations["adjust.scale"], adjust.scale);
                context.uniform1f(uniformLocations["adjust.angle"], adjust.angle);
                context.uniform2f(uniformLocations["resolution"], context.canvas.width, context.canvas.height);
                context.uniform2f(uniformLocations["dimensions"], width, height);
                context.uniform2f(uniformLocations["anchor"], anchor.x, anchor.y);
                context.uniform4f(uniformLocations["colour"], colour.r, colour.g, colour.b, colour.a);
        }
        let program;
        function activateGLRender(context,adjust){
            dev.log.elementLibrary(type,self.getAddress(),'::activateGLRender(-context-,'+JSON.stringify(adjust)+')'); //#development
            if(program == undefined){ program = render.produceProgram(self.getType(), vertexShaderSource, fragmentShaderSource); }
    
            context.useProgram(program);
            updateGLAttributes(context,adjust);
            context.drawArrays(context.TRIANGLE_FAN, 0, 4);
        }

    //extremities
        function computeExtremities(informParent=true,offset){
            dev.log.elementLibrary(type,self.getAddress(),'::computeExtremities('+informParent+','+JSON.stringify(offset)+')'); //#development
            
            //get offset from parent, if one isn't provided
                if(offset == undefined){ offset = self.parent && !static ? self.parent.getOffset() : {x:0,y:0,scale:1,angle:0}; }
            //calculate adjusted offset based on the offset
                let point = library.math.cartesianAngleAdjust(x,y,offset.angle);
                dev.log.elementLibrary(type,self.getAddress(),'::computeExtremities -> point'+JSON.stringify(point)); //#development
                let adjusted = { 
                    x: point.x*offset.scale + offset.x,
                    y: point.y*offset.scale + offset.y,
                    scale: offset.scale*scale,
                    angle: -(offset.angle + angle),
                };
                dev.log.elementLibrary(type,self.getAddress(),'::computeExtremities -> adjusted'+JSON.stringify(adjusted)); //#development
            //calculate points based on the adjusted offset
                self.extremities.points = [];
                for(let a = 0; a < points.length; a+=2){
                    let P = {
                        x: adjusted.scale * width * (points[a] - anchor.x), 
                        y: adjusted.scale * height * (points[a+1] - anchor.y), 
                    };

                    self.extremities.points.push({ 
                        x: P.x*Math.cos(adjusted.angle) + P.y*Math.sin(adjusted.angle) + adjusted.x,
                        y: P.y*Math.cos(adjusted.angle) - P.x*Math.sin(adjusted.angle) + adjusted.y,
                    });
                }
                self.extremities.boundingBox = library.math.boundingBoxFromPoints(self.extremities.points);
                dev.log.elementLibrary(type,self.getAddress(),'::computeExtremities -> self.extremities.points:'+JSON.stringify(self.extremities.points)); //#development
                dev.log.elementLibrary(type,self.getAddress(),'::computeExtremities -> self.extremities.boundingBox:'+JSON.stringify(self.extremities.boundingBox)); //#development
        
            //if told to do so, inform parent (if there is one) that extremities have changed
                if(informParent){ if(self.parent){self.parent.updateExtremities();} }
        }
        this.computeExtremities = computeExtremities;

    //lead render
        function drawDotFrame(){
            //draw shape extremity points
                self.extremities.points.forEach(a => render.drawDot(a.x,a.y));
            //draw bounding box top left and bottom right points
                render.drawDot(self.extremities.boundingBox.topLeft.x,self.extremities.boundingBox.topLeft.y,3,{r:0,g:1,b:1,a:0.5});
                render.drawDot(self.extremities.boundingBox.bottomRight.x,self.extremities.boundingBox.bottomRight.y,3,{r:0,g:1,b:1,a:0.5});
        };
        this.render = function(context,offset={x:0,y:0,scale:1,angle:0}){
            dev.log.elementLibrary(type,self.getAddress(),'.render(-context-,'+JSON.stringify(offset)+')'); //#development
            //combine offset with shape's position, angle and scale to produce adjust value for render
                let point = library.math.cartesianAngleAdjust(x,y,offset.angle);
                let adjust = { 
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

    //info dump
        this._dump = function(){
            report.info(self.getAddress(),'._dump()');
            report.info(self.getAddress(),'._dump -> id: '+id);
            report.info(self.getAddress(),'._dump -> parent: '+JSON.stringify(self.parent));
            report.info(self.getAddress(),'._dump -> dotFrame: '+self.dotFrame);
            report.info(self.getAddress(),'._dump -> extremities: '+JSON.stringify(self.extremities));
            report.info(self.getAddress(),'._dump -> ignored: '+ignored);
            report.info(self.getAddress(),'._dump -> colour: '+JSON.stringify(colour));
            report.info(self.getAddress(),'._dump -> x: '+x);
            report.info(self.getAddress(),'._dump -> y: '+y);
            report.info(self.getAddress(),'._dump -> angle: '+angle);
            report.info(self.getAddress(),'._dump -> anchor: '+JSON.stringify(anchor));
            report.info(self.getAddress(),'._dump -> width: '+width);
            report.info(self.getAddress(),'._dump -> height: '+height);
            report.info(self.getAddress(),'._dump -> scale: '+scale);
            report.info(self.getAddress(),'._dump -> static: '+static);
        };
    
    //interface
        this.interface = new function(){
            this.ignored = self.ignored;
            this.colour = self.colour;
            this.x = self.x;
            this.y = self.y;
            this.angle = self.angle;
            this.angle = self.angle;
            this.anchor = self.anchor;
            this.width = self.width;
            this.scale = self.scale;
            this.static = self.static;
            this.unifiedAttribute = self.unifiedAttribute;

            this.getAddress = self.getAddress;

            this._dump = self._dump;
        };
};