this.group = function(_id,_name){
    const self = this;

    //attributes 
        //protected attributes
            const type = 'group'; 
            this.getType = function(){return type;}
            const id = _id; 
            this.getId = function(){return id;}

        //simple attributes
            this.name = _name;
            this.parent = undefined;
            this.dotFrame = false;
            this.extremities = { points:[], boundingBox:{bottomRight:{x:0, y:0}, topLeft:{x:0, y:0}} };
            let ignored = false;
            this.ignored = function(a){
                if(a==undefined){return ignored;}     
                ignored = a;
                dev.log.elementLibrary(type,self.getAddress(),'.ignored('+a+')'); //#development
                if(allowComputeExtremities){computeExtremities();}
            };
            
        //advanced use attributes
            let allowComputeExtremities = true;

        //addressing
            this.getAddress = function(){ return (self.parent != undefined ? self.parent.getAddress() : '') + '/' + self.name; };
        
        //attributes pertinent to extremity calculation
            let x = 0;     
            let y = 0;     
            let angle = 0; 
            let scale = 1; 
            let heedCamera = false;
            let static = false;
            this.x = function(a){ 
                if(a==undefined){return x;}     
                x = a;     
                dev.log.elementLibrary(type,self.getAddress(),'.x('+a+')'); //#development
                if(allowComputeExtremities){computeExtremities();}
            };
            this.y = function(a){ 
                if(a==undefined){return y;}     
                y = a;
                dev.log.elementLibrary(type,self.getAddress(),'.y('+a+')'); //#development
                if(allowComputeExtremities){computeExtremities();}
            };
            this.angle = function(a){ 
                if(a==undefined){return angle;} 
                angle = a;
                dev.log.elementLibrary(type,self.getAddress(),'.angle('+a+')'); //#development
                if(allowComputeExtremities){computeExtremities();}
            };
            this.scale = function(a){ 
                if(a==undefined){return scale;} 
                scale = a;
                dev.log.elementLibrary(type,self.getAddress(),'.scale('+a+')'); //#development
                if(allowComputeExtremities){computeExtremities();}
            };
            this.heedCamera = function(a){
                if(a==undefined){return heedCamera;}     
                heedCamera = a;
                dev.log.elementLibrary(type,self.getAddress(),'.heedCamera('+a+')'); //#development
                if(allowComputeExtremities){computeExtremities();}
            };
            this.static = function(a){
                if(a==undefined){return static;}  
                static = a;  
                dev.log.elementLibrary(type,self.getAddress(),'.static('+a+')'); //#development
                if(allowComputeExtremities){computeExtremities();}
            };

        //unifiedAttribute
            this.unifiedAttribute = function(attributes){
                if(attributes==undefined){ return { ignored:ignored, x:x, y:y, angle:angle, scale:scale, heedCamera:heedCamera, static:static }; } 
                dev.log.elementLibrary(type,self.getAddress(),'.unifiedAttribute('+JSON.stringify(attributes)+')'); //#development

                allowComputeExtremities = false;
                Object.keys(attributes).forEach(key => {
                    dev.log.elementLibrary(type,self.getAddress(),'.unifiedAttribute -> updating "'+key+'" to '+JSON.stringify(attributes[key])); //#development
                    try{
                        self[key](attributes[key]);
                    }catch(err){
                        console.warn(type,id,self.getAddress(),'.unifiedAttribute -> unknown attribute "'+key+'" which was being set to "'+JSON.stringify(attributes[key])+'"');
                    }
                });
                allowComputeExtremities = true;

                computeExtremities();
            };

    //group functions
        let children = []; 
        let childRegistry = {};

        function getChildByName(name){ return childRegistry[name]; }
        function checkForName(name){ return childRegistry[name] != undefined; }
        function checkForElement(element){ return children.find(a => a == element); }
        function isValidElement(element){
            if( element == undefined ){ return false; }
            if( element.name == undefined || element.name.length == 0 ){
                console.warn('group error: element with no name being inserted into group "'+self.getAddress()+'", therefore; the element will not be added');
                return false;
            }
            if( checkForName(element.name) ){
                console.warn('group error: element with name "'+element.name+'" already exists in group "'+self.getAddress()+'", therefore; the element will not be added');
                return false;
            }

            return true;
        }

        this.children = function(){return children;};
        this.syncChildren = function(foreignChildren){
            dev.log.elementLibrary(type,self.getAddress(),'.syncChildren('+JSON.stringify(foreignChildren)+')'); //#development
            dev.log.elementLibrary(type,self.getAddress(),'.syncChildren -> children:'+JSON.stringify(children)); //#development
            this.clear();
            dev.log.elementLibrary(type,self.getAddress(),'.syncChildren -> children:'+JSON.stringify(children)); //#development
            foreignChildren.forEach(child => {
                this.append(child);
            });
            dev.log.elementLibrary(type,self.getAddress(),'.syncChildren -> children:'+JSON.stringify(children)); //#development
        };
        this.getChildByName = function(name){return getChildByName(name);};
        this.getChildIndexByName = function(name){return children.indexOf(children.find(a => a.name == name)); };
        this.contains = function(element){ return checkForElement(element) != undefined; };
        this.append = function(newElement){
            dev.log.elementLibrary(type,self.getAddress(),'.append('+JSON.stringify(newElement)+')'); //#development
            dev.log.elementLibrary(type,self.getAddress(),'.append -> children: ['+children.map(child => JSON.stringify(child))+']','newElement.name: '+(newElement!=undefined?newElement.name:'')); //#development

            if( !isValidElement(newElement) ){ return false; } 

            children.push(newElement); 
            newElement.parent = this;
            augmentExtremities_add(newElement);

            childRegistry[newElement.name] = newElement;

            return true;
        };
        this.prepend = function(newElement){
            dev.log.elementLibrary(type,self.getAddress(),'.prepend('+JSON.stringify(newElement)+')'); //#development

            if( !isValidElement(newElement) ){ return false; }

            children.unshift(newElement); 
            newElement.parent = this;
            augmentExtremities_add(newElement);

            childRegistry[newElement.name] = newElement;

            return true;
        };
        this.remove = function(newElement){
            dev.log.elementLibrary(type,self.getAddress(),'.remove('+JSON.stringify(newElement)+')'); //#development
            if(newElement == undefined){return;}
            children.splice(children.indexOf(newElement), 1);
            augmentExtremities_remove(newElement);

            newElement.parent = undefined;
            delete childRegistry[newElement.name];
        };
        this.clear = function(){
            dev.log.elementLibrary(type,self.getAddress(),'.clear()'); //#development
            children = [];
            childRegistry = {};
            return true;
        };
        this.getElementsUnderPoint = function(x,y){
            dev.log.elementLibrary(type,self.getAddress(),'.getElementsUnderPoint('+x+','+y+')'); //#development

            let returnList = [];

            //run though children backwards (thus, front to back)
            for(let a = children.length-1; a >= 0; a--){
                //if child wants to be ignored, just move on to the next one
                    if( children[a].ignored() ){ continue; }

                //if the point is not within this child's bounding box, just move on to the next one
                    if( !library.math.detectOverlap.pointWithinBoundingBox( {x:x,y:y}, children[a].extremities.boundingBox ) ){ continue; }

                //if the child is a group type; pass this point to it's "getElementsUnderPoint" function and collect the results, then move on to the next item
                    if( children[a].getType() == 'group' ){ returnList = returnList.concat( children[a].getElementsUnderPoint(x,y) ); continue; }

                //if this point exists within the child; add it to the results list
                    if( library.math.detectOverlap.pointWithinPoly( {x:x,y:y}, children[a].extremities.points ) ){ returnList = returnList.concat( children[a] ); }
            }

            return returnList;
        };
        this.getElementsUnderArea = function(points){
            dev.log.elementLibrary(type,self.getAddress(),'.getElementsUnderArea('+points+')'); //#development

            let returnList = [];

            //run though children backwords (thus, front to back)
            for(let a = children.length-1; a >= 0; a--){
                //if child wants to be ignored, just move on to the next one
                    if( children[a].ignored() ){ continue; }

                //if the area does not overlap with this child's bounding box, just move on to the next one
                    if( !library.math.detectOverlap.boundingBoxes( library.math.boundingBoxFromPoints(points), item.extremities.boundingBox ) ){ continue; }

                //if the child is a group type; pass this area to it's "getElementsUnderArea" function and collect the results, then move on to the next item
                    if( children[a].getType() == 'group' ){ returnList = returnList.concat( item.getElementUnderArea(points) ); continue; }

                //if this area overlaps with the child; add it to the results list
                    if( library.math.detectOverlap.overlappingPolygons(points, item.extremities.points) ){ returnList = returnList.concat( children[a] ); }
            }

            return returnList;
        };
        this.getTree = function(){
            const result = {name:self.name, type:type, id:self.getId(), children:[]};

            children.forEach(function(a){
                if(a.getType() == 'group'){ result.children.push( a.getTree() ); }
                else{ result.children.push({ type:a.getType(), name:a.name, id:a.getId() }); }
            });

            return result;
        };

    //clipping
        const clipping = { stencil:undefined, active:false };
        this.stencil = function(element){
            if(element == undefined){return clipping.stencil;}
            dev.log.elementLibrary(type,self.getAddress(),'.stencil('+JSON.stringify(element)+')'); //#development
            clipping.stencil = element;
            clipping.stencil.parent = this;
            if(clipping.active){ computeExtremities(); }
        };
        this.clipActive = function(bool){
            if(bool == undefined){return clipping.active;}
            dev.log.elementLibrary(type,self.getAddress(),'.clipActive('+bool+')'); //#development
            clipping.active = bool;
            computeExtremities();
        };

    //extremities
        function calculateExtremitiesBox(){
            dev.log.elementLibrary(type,self.getAddress(),'::calculateExtremitiesBox()'); //#development

            let limits = {left:undefined,right:undefined,top:undefined,bottom:undefined};
            if(children.length == 0){
                dev.log.elementLibrary(type,self.getAddress(),'::calculateExtremitiesBox -> no children'); //#development
                limits = {left:x,right:x,top:y,bottom:y};
            }else{
                dev.log.elementLibrary(type,self.getAddress(),'::calculateExtremitiesBox -> children.length: '+children.length); //#development
                const firstChild = library.math.boundingBoxFromPoints(children[0].extremities.points);
                dev.log.elementLibrary(type,self.getAddress(),'::calculateExtremitiesBox -> firstChild: '+JSON.stringify(firstChild)); //#development
                limits = { left:firstChild.topLeft.x, right:firstChild.bottomRight.x, top:firstChild.bottomRight.y, bottom:firstChild.topLeft.y }

                children.slice(1).forEach(child => {
                    const tmp = library.math.boundingBoxFromPoints(child.extremities.points);
                    dev.log.elementLibrary(type,self.getAddress(),'::calculateExtremitiesBox -> child: '+JSON.stringify(tmp)); //#development
                    if( tmp.bottomRight.x > limits.right ){ limits.right = tmp.bottomRight.x; }
                    else if( tmp.topLeft.x < limits.left ){ limits.left = tmp.topLeft.x; }
                    if( tmp.bottomRight.y > limits.top ){ limits.top = tmp.bottomRight.y; }
                    else if( tmp.topLeft.y < limits.bottom ){ limits.bottom = tmp.topLeft.y; }
                });
            }

            self.extremities.points = [ {x:limits.left,y:limits.top}, {x:limits.right,y:limits.top}, {x:limits.right,y:limits.bottom}, {x:limits.left,y:limits.bottom} ];
            dev.log.elementLibrary(type,self.getAddress(),'::calculateExtremitiesBox -> self.extremities.points: '+JSON.stringify(self.extremities.points)); //#development
        }
        function updateExtremities(informParent=true){
            dev.log.elementLibrary(type,self.getAddress(),'::updateExtremities('+informParent+')'); //#development
           
            //generate extremity points
                self.extremities.points = [];

                //if clipping is active and possible, the extremities of this group are limited to those of the clipping element
                //otherwise, gather extremities from children and calculate extremities here
                if(clipping.active && clipping.stencil != undefined){
                    self.extremities.points = clipping.stencil.extremities.points.slice();
                }else{
                    calculateExtremitiesBox();
                }
                dev.log.elementLibrary(type,self.getAddress(),'::updateExtremities -> extremities.points.length: '+self.extremities.points.length); //#development

            //generate bounding box from points
                self.extremities.boundingBox = library.math.boundingBoxFromPoints(self.extremities.points);
                dev.log.elementLibrary(type,self.getAddress(),'::updateExtremities -> self.extremities.boundingBox: '+JSON.stringify(self.extremities.boundingBox)); //#development

            //update parent
                if(informParent){ if(self.parent){self.parent.updateExtremities();} }
        }
        function augmentExtremities(element){
            dev.log.elementLibrary(type,self.getAddress(),'::augmentExtremities('+JSON.stringify(element)+')'); //#development

            //get offset from parent
                const offset = self.parent && !static ? self.parent.getOffset() : {x:0,y:0,scale:1,angle:0};
            //combine offset with group's position, angle and scale to produce new offset for children
                const point = library.math.cartesianAngleAdjust(x,y,offset.angle);
                const newOffset = { 
                    x: point.x*offset.scale + offset.x,
                    y: point.y*offset.scale + offset.y,
                    scale: offset.scale*scale,
                    angle: offset.angle + angle,
                };
            //run computeExtremities on new child
                element.computeExtremities(false,newOffset);
            //augment points list
                calculateExtremitiesBox();
                dev.log.elementLibrary(type,self.getAddress(),'::augmentExtremities -> extremities.points.length: '+self.extremities.points.length); //#development
            //recalculate bounding box
                self.extremities.boundingBox = library.math.boundingBoxFromPoints(self.extremities.points);
            //inform parent of change
                if(self.parent){self.parent.updateExtremities();}
        }
        function computeExtremities(informParent=true,offset){
            dev.log.elementLibrary(type,self.getAddress(),'::computeExtremities('+informParent+','+JSON.stringify(offset)+')'); //#development
            
            //get offset from parent, if one isn't provided
                if(offset == undefined){ offset = self.parent && !static? self.parent.getOffset() : {x:0,y:0,scale:1,angle:0}; }
            //combine offset with group's position, angle and scale to produce new offset for children
                const point = library.math.cartesianAngleAdjust(x,y,offset.angle);
                const newOffset = { 
                    x: point.x*offset.scale + offset.x,
                    y: point.y*offset.scale + offset.y,
                    scale: offset.scale*scale,
                    angle: offset.angle + angle,
                };
            //run computeExtremities on all children
                children.forEach(child => child.computeExtremities(false,newOffset));
            //run computeExtremities on stencil (if applicable)
                if( clipping.stencil != undefined ){ clipping.stencil.computeExtremities(false,newOffset); }
            //update extremities
                updateExtremities(informParent,offset);
        }
        function augmentExtremities_add(element){
            dev.log.elementLibrary(type,self.getAddress(),'::augmentExtremities_add('+JSON.stringify(element)+')'); //#development

            //get offset from parent
                const offset = self.parent && !static ? self.parent.getOffset() : {x:0,y:0,scale:1,angle:0};
                dev.log.elementLibrary(type,self.getAddress(),'::augmentExtremities_add -> generated offset: '+JSON.stringify(offset)); //#development
            //combine offset with group's position, angle and scale to produce new offset for children
                const point = library.math.cartesianAngleAdjust(x,y,offset.angle);
                const newOffset = { 
                    x: point.x*offset.scale + offset.x,
                    y: point.y*offset.scale + offset.y,
                    scale: offset.scale*scale,
                    angle: offset.angle + angle,
                };
            //run computeExtremities on new child
                element.computeExtremities(false,newOffset);

            //augment points list
                self.extremities.boundingBox = library.math.boundingBoxFromPoints( self.extremities.points.concat(element.extremities.points) );
                self.extremities.points = [
                    { x:self.extremities.boundingBox.topLeft.x, y:self.extremities.boundingBox.topLeft.y },
                    { x:self.extremities.boundingBox.bottomRight.x, y:self.extremities.boundingBox.topLeft.y },
                    { x:self.extremities.boundingBox.bottomRight.x, y:self.extremities.boundingBox.bottomRight.y },
                    { x:self.extremities.boundingBox.topLeft.x, y:self.extremities.boundingBox.bottomRight.y },
                ];

                dev.log.elementLibrary(type,self.getAddress(),'::augmentExtremities_add -> extremities.points.length: '+self.extremities.points.length); //#development
            //inform parent of change
                if(self.parent){self.parent.updateExtremities();}
        }
        function augmentExtremities_remove(element){
            dev.log.elementLibrary(type,self.getAddress(),'::augmentExtremities_remove('+JSON.stringify(element)+')'); //#development
            //this function assumes that the element has already been removed from the 'children' variable)
            //is the element's bounding box within the bounding box of the group; if so, no recalculation need be done
            //otherwise the element is touching the boundary, in which case search through the children for another 
            //element that also touches the boundary, or find the closest element and adjust the boundary to touch that

            const data = {
                topLeft:{
                    x: self.extremities.boundingBox.topLeft.x - element.extremities.boundingBox.topLeft.x,
                    y: self.extremities.boundingBox.topLeft.y - element.extremities.boundingBox.topLeft.y,
                },
                bottomRight:{
                    x: element.extremities.boundingBox.bottomRight.x - self.extremities.boundingBox.bottomRight.x,
                    y: element.extremities.boundingBox.bottomRight.y - self.extremities.boundingBox.bottomRight.y,
                }
            };
            if( data.topLeft.x != 0 && data.topLeft.y != 0 && data.bottomRight.x != 0 && data.bottomRight.y != 0 ){
                dev.log.elementLibrary(type,self.getAddress(),'::augmentExtremities_remove -> easy remove: no changes to the group\'s bounding box required'); //#development
                return;
            }else{
                ['topLeft','bottomRight'].forEach(cornerName => {
                    ['x','y'].forEach(axisName => {
                        if(data[cornerName][axisName] == 0){
                            dev.log.elementLibrary(type,self.getAddress(),'::augmentExtremities_remove -> '+cornerName+'_'+axisName+' is at boundary'); //#development

                            let boundaryToucherFound = false;
                            let closestToBoundary = {distance:undefined, position:undefined};
                            for(let a = 0; a < children.length; a++){
                                const tmp = Math.abs(children[a].extremities.boundingBox[cornerName][axisName] - self.extremities.boundingBox[cornerName][axisName]);
                                if(closestToBoundary.distance == undefined || closestToBoundary.distance > tmp){
                                    closestToBoundary = { distance:tmp, position:children[a].extremities.boundingBox[cornerName][axisName] };
                                    if(closestToBoundary.distance == 0){ boundaryToucherFound = true; break; }
                                }
                            }

                            if(!boundaryToucherFound){
                                dev.log.elementLibrary(type,self.getAddress(),'::augmentExtremities_remove -> need to adjust the bounding box'); //#development
                                self.extremities.boundingBox[cornerName][axisName] = closestToBoundary.position;
                            }
                        }
                    });
                });
            }
        }

        this.getOffset = function(){
            dev.log.elementLibrary(type,self.getAddress(),'.getOffset()'); //#development

            let output = {x:0,y:0,scale:1,angle:0};

            if(this.parent){
                dev.log.elementLibrary(type,self.getAddress(),'.getOffset -> parent found'); //#development
                const offset = this.parent.getOffset();
                const point = library.math.cartesianAngleAdjust(x,y,offset.angle);
                output = { 
                    x: point.x*offset.scale + offset.x,
                    y: point.y*offset.scale + offset.y,
                    scale: offset.scale * scale,
                    angle: offset.angle + angle,
                };
            }else{
                dev.log.elementLibrary(type,self.getAddress(),'.getOffset -> no parent found'); //#development
                output = {x:x ,y:y ,scale:scale ,angle:angle};
            }

            dev.log.elementLibrary(type,self.getAddress(),'.getOffset -> output: '+JSON.stringify(output)); //#development
            return output;
        };
        this.computeExtremities = computeExtremities;
        this.updateExtremities = updateExtremities;
    
    //lead render
        function drawDotFrame(){
            //draw bounding box top left and bottom right points
            render.drawDot(self.extremities.boundingBox.topLeft.x,self.extremities.boundingBox.topLeft.y,3,{r:0,g:0,b:0,a:0.75});
            render.drawDot(self.extremities.boundingBox.bottomRight.x,self.extremities.boundingBox.bottomRight.y,3,{r:0,g:0,b:0,a:0.75});
        }
        this.render = function(context, offset){
            dev.log.elementLibrary(type,self.getAddress(),'.render(-context-,'+JSON.stringify(offset)+')'); //#development
            //combine offset with group's position, angle and scale to produce new offset for children
                const point = library.math.cartesianAngleAdjust(x,y,offset.angle);
                const newOffset = { 
                    x: point.x*offset.scale + offset.x,
                    y: point.y*offset.scale + offset.y,
                    scale: offset.scale*scale,
                    angle: offset.angle + angle,
                };

            //activate clipping (if requested, and is possible)
                if(clipping.active && clipping.stencil != undefined){
                    //active stencil drawing mode
                        context.enable(context.STENCIL_TEST);
                        context.colorMask(false,false,false,false);
                        context.stencilFunc(context.ALWAYS,1,0xFF);
                        context.stencilOp(context.KEEP,context.KEEP,context.REPLACE);
                        context.stencilMask(0xFF);
                    //draw stencil
                        clipping.stencil.render(context,newOffset);
                    //reactive regular rendering
                        context.colorMask(true,true,true,true);
                        context.stencilFunc(context.EQUAL,1,0xFF);
                }
            
            //render children
                children.forEach(function(a){
                    dev.log.elementLibrary(type,self.getAddress(),'.render -> '+JSON.stringify(clipping.active ? self.extremities.boundingBox : viewport.getBoundingBox())+' / '+JSON.stringify(a.extremities.boundingBox)); //#development
                    if(
                        library.math.detectOverlap.boundingBoxes(
                            clipping.active ? self.extremities.boundingBox : viewport.getBoundingBox(),
                            a.extremities.boundingBox
                        )
                    ){ 
                        dev.log.elementLibrary(type,self.getAddress(),'.render -> rendering shape: '+a.name); //#development
                        a.render(context,newOffset);
                    }else{
                        dev.log.elementLibrary(type,self.getAddress(),'.render -> not rendering shape: '+a.name); //#development
                    }
                });

            //deactivate clipping
                if(clipping.active){ 
                    context.disable(context.STENCIL_TEST); 
                    context.clear(context.STENCIL_BUFFER_BIT);
                }

            //if requested; draw dot frame
                if(self.dotFrame){drawDotFrame();}
        };

    //info dump
        this._dump = function(){
            report.info(self.getAddress(),'._dump()');
            report.info(self.getAddress(),'._dump -> id: '+id);
            report.info(self.getAddress(),'._dump -> type: '+type);
            report.info(self.getAddress(),'._dump -> name: '+self.name);
            report.info(self.getAddress(),'._dump -> address: '+self.getAddress());
            report.info(self.getAddress(),'._dump -> parent: '+JSON.stringify(self.parent));
            report.info(self.getAddress(),'._dump -> dotFrame: '+self.dotFrame);
            report.info(self.getAddress(),'._dump -> extremities: '+JSON.stringify(self.extremities));
            report.info(self.getAddress(),'._dump -> ignored: '+ignored);
            report.info(self.getAddress(),'._dump -> x: '+x);
            report.info(self.getAddress(),'._dump -> y: '+y);
            report.info(self.getAddress(),'._dump -> angle: '+angle);
            report.info(self.getAddress(),'._dump -> scale: '+scale);
            report.info(self.getAddress(),'._dump -> heedCamera: '+heedCamera);
            report.info(self.getAddress(),'._dump -> static: '+static);
            report.info(self.getAddress(),'._dump -> children: '+JSON.stringify(children));
            report.info(self.getAddress(),'._dump -> childRegistry: '+JSON.stringify(childRegistry));
            report.info(self.getAddress(),'._dump -> clipping: '+JSON.stringify(clipping));
        };
    
    //interface
        this.interface = new function(){
            this.ignored = self.ignored;
            this.x = self.x;
            this.y = self.y;
            this.angle = self.angle;
            this.scale = self.scale;
            this.heedCamera = self.heedCamera;
            this.static = self.static;
            this.unifiedAttribute = self.unifiedAttribute;

            this.getAddress = self.getAddress;

            this.children = function(){ return self.children().map(e => element.getIdFromElement(e)) };
            this.syncChildren = function(childIds){ self.syncChildren(childIds.map(id => element.getElementFromId(id))); };
            this.getChildByName = function(name){ return element.getIdFromElement(self.getChildByName(name)); };
            this.getChildIndexByName = self.getChildIndexByName;
            this.contains = function(elementId){ return self.contains(element.getElementFromId(elementId)); };
            this.append = function(elementId){ return self.append(element.getElementFromId(elementId)); };
            this.prepend = function(elementId){ return self.prepend(element.getElementFromId(elementId)); };
            this.remove = function(elementId){ return self.remove(element.getElementFromId(elementId)); };
            this.clear = self.clear;
            this.getElementsUnderPoint = function(x,y){ return self.getElementsUnderPoint(x,y).map(ele => element.getIdFromElement(ele)); };
            this.getElementsUnderArea = function(points){ return self.getElementsUnderArea(points).map(ele => element.getIdFromElement(ele)); };
            this.getTree = self.getTree;
            this.stencil = function(elementId){ return self.stencil(element.getElementFromId(elementId)); };
            this.clipActive = self.clipActive;

            this._dump = self._dump;
        };
};