this.needleOverlay = function(
    name='needleOverlay',
    x, y, width=120, height=60, angle=0, interactable=true, needleWidth=1/512, selectNeedle=true, selectionArea=true,
    needleStyles=[
        'rgba(240, 240, 240, 1)',
        'rgba(255, 231, 114, 1)'
    ],
    onchange=function(needle,value){}, 
    onrelease=function(needle,value){}, 
    selectionAreaToggle=function(bool){},
){
    var needleData = {};

    //elements 
        //main
            var object = interfacePart.builder('group',name,{x:x, y:y, angle:angle});
        //backing
            var backing = interfacePart.builder('rectangle','backing',{width:width, height:height, style:{fill:'rgba(0,0,0,0)'}});
            object.append(backing);
        //control objects
            var controlObjectsGroup = interfacePart.builder('group','controlObjectsGroup');
            object.append(controlObjectsGroup);
                var controlObjectsGroup_back = interfacePart.builder('group','back');
                controlObjectsGroup.append(controlObjectsGroup_back);
                var controlObjectsGroup_front = interfacePart.builder('group','front');
                controlObjectsGroup.append(controlObjectsGroup_front);

            var invisibleHandleWidth = width*needleWidth + width*0.005;
            var controlObjects = {};
            //lead
                controlObjects.lead = interfacePart.builder('group','lead');
                controlObjects.lead.append( interfacePart.builder('rectangle','handle',{
                    width:needleWidth*width,
                    height:height,
                    style:{ fill:needleStyles[0] },
                }));
                controlObjects.lead.append( interfacePart.builder('rectangle','invisibleHandle',{
                    x:(width*needleWidth - invisibleHandleWidth)/2, 
                    width:invisibleHandleWidth,
                    height:height,
                    style:{ fill:'rgba(255,0,0,0)' },
                }));
            //selection_A
                controlObjects.selection_A = interfacePart.builder('group','selection_A');
                controlObjects.selection_A.append( interfacePart.builder('rectangle','handle',{
                    width:needleWidth*width,
                    height:height,
                    style:{fill:needleStyles[1]},
                }));
                controlObjects.selection_A.append( interfacePart.builder('rectangle','invisibleHandle',{
                    x:(width*needleWidth - invisibleHandleWidth)/2, 
                    width:invisibleHandleWidth,height:height,
                    style:{fill:'rgba(255,0,0,0)'},
                }));
            //selection_B
                controlObjects.selection_B = interfacePart.builder('group','selection_B');
                controlObjects.selection_B.append( interfacePart.builder('rectangle','handle',{
                    width:needleWidth*width,
                    height:height,
                    style:{fill:needleStyles[1]},
                }));
                controlObjects.selection_B.append( interfacePart.builder('rectangle','invisibleHandle',{
                    x:(width*needleWidth - invisibleHandleWidth)/2, 
                    width:invisibleHandleWidth,height:height,
                    style:{fill:'rgba(255,0,0,0)'},
                }));
            //selection_area
                controlObjects.selection_area = interfacePart.builder('rectangle','selection_area',{
                    height:height,
                    style:{fill:workspace.library.misc.blendColours(needleStyles[1],'rgba(0,0,0,0)',0.5)},
                });
            //marks
                controlObjects.markGroup = interfacePart.builder('group','markGroup');
                controlObjectsGroup_back.append(controlObjects.markGroup);

    //internal functions
        object.__calculationAngle = angle;
        var leadNeedle_grappled = false;
        var selectionArea_grappled = false;
        var selectionNeedleA_grappled = false;
        var selectionNeedleB_grappled = false;
        function currentMousePosition_x(event){
            return event.x*Math.cos(object.__calculationAngle) - event.y*Math.sin(object.__calculationAngle);
        }
        function getRelativeX(event){
            var workspacePoint = workspace.core.viewport.windowPoint2workspacePoint(event.x,event.y);
            var point = {
                x: workspacePoint.x - backing.extremities.points[0].x, 
                y: workspacePoint.y - backing.extremities.points[0].y,
            };
            return {
                x: (point.x*Math.cos(object.__calculationAngle) - point.y*Math.sin(object.__calculationAngle)) / width,
                y: (point.y*Math.cos(object.__calculationAngle) - point.x*Math.sin(object.__calculationAngle)) / height,
            };
        }
        function needleJumpTo(needle,location){
            var group = needle == 'lead' ? controlObjectsGroup_front : controlObjectsGroup_back;

            //if the location is wrong, remove the needle and return
                if(location == undefined || location < 0 || location > 1){
                    group.remove(controlObjects[needle]);
                    delete needleData[needle];
                    return;
                }

            //if the needle isn't in the scene, add it
                if( !group.contains(controlObjects[needle]) ){
                    group.append(controlObjects[needle]);
                }

            //actually set the location of the needle (adjusting for the size of needle)
                controlObjects[needle].parameter.x( location*width - width*needleWidth*location );
            //save this value
                needleData[needle] = location;
        }
        function computeSelectionArea(){
            //if the selection needles' data are missing (or they are the same position) remove the area element and return
                if(needleData.selection_A == undefined || needleData.selection_B == undefined || needleData.selection_A == needleData.selection_B){
                    controlObjectsGroup_back.remove(controlObjects.selection_area);
                    if(object.selectionAreaToggle){object.selectionAreaToggle(false);}
                    delete needleData.selection_area;
                    return;
                }

            //if the area isn't in the scene, add it
                if( !controlObjectsGroup_back.contains(controlObjects.selection_area) ){
                    controlObjectsGroup_back.append(controlObjects.selection_area);
                    if(object.selectionAreaToggle){object.selectionAreaToggle(true);}
                }

            //compute area position and size
                if(needleData.selection_A < needleData.selection_B){
                    var A = needleData.selection_A;
                    var B = needleData.selection_B;
                }else{
                    var A = needleData.selection_B;
                    var B = needleData.selection_A;
                }
                var start = A - needleWidth*A + needleWidth
                var area = B - needleWidth*B - start; 
                if(area < 0){area = 0}

                controlObjects.selection_area.parameter.x(width*start);
                controlObjects.selection_area.parameter.width(width*area);
        }
        function mark(position){
            //the name of the mark to be added, is the position it is at

            //if a child already exists in the mark group, remove it. Otherwise add a new mark.
            //return 'true' if the mark was added, or 'false' if it was removed
                var tmp = controlObjects.markGroup.getChildByName(''+position);
                if( tmp == undefined ){
                    controlObjects.markGroup.append( interfacePart.builder('rectangle',''+position,{
                        x:position*width, 
                        width:needleWidth*width, height:height,
                        style:{ fill:needleStyles[0] },
                    }));
                    return true;
                }else{ 
                    controlObjects.markGroup.remove(tmp);
                    return false;
                }
        }
        function select(position,update=true){
            if(!selectNeedle){return;}
            //if there's no input, return the value
            //if input is out of bounds, remove the needle
            //otherwise, set the position
            if(position == undefined){ return needleData.lead; }
            else if(position > 1 || position < 0){ needleJumpTo('lead'); }
            else{ needleJumpTo('lead',position); }

            if(update && object.onchange != undefined){object.onchange('lead',position);}
        }
        function area(positionA,positionB,update=true){
            if(!selectionArea){return;}

            //if there's no input, return the values
            //if input is out of bounds, remove the needles
            //otherwise, set the position
                if(positionA == undefined || positionB == undefined){
                    return {A:needleData.selection_A, B:needleData.selection_B};
                }else if(positionA > 1 || positionA < 0 || positionB > 1 || positionB < 0 ){
                    needleJumpTo('selection_A');
                    needleJumpTo('selection_B');
                }else{
                    needleJumpTo('selection_A',positionA);
                    needleJumpTo('selection_B',positionB);
                }

            //you always gotta compute the selection area
                computeSelectionArea();

            if(update && object.onchange != undefined){object.onchange('selection_A',positionA);}
            if(update && object.onchange != undefined){object.onchange('selection_B',positionB);}
        }

    //interaction
        //generic onmousedown code for interaction
            backing.onmousedown = function(x,y,event){
                if(!interactable){return;}
                if( workspace.system.keyboard.pressedKeys.shift ){
                    var firstPosition = getRelativeX(event).x;
                    workspace.system.mouse.mouseInteractionHandler(
                        function(event){ object.area(firstPosition,getRelativeX(event).x); },    
                    );
                }else{
                    object.select(getRelativeX(event).x);
                }
            };
            controlObjects.lead.getChildByName('invisibleHandle').onmouseenter = function(x,y,event){workspace.core.viewport.cursor('col-resize');};
            controlObjects.lead.getChildByName('invisibleHandle').onmouseleave = function(x,y,event){workspace.core.viewport.cursor('default');};
            controlObjects.lead.getChildByName('invisibleHandle').onmousedown = function(x,y,event){
                if(!interactable){return;}

                leadNeedle_grappled = true;

                var initialValue = needleData.lead;
                var initialX = currentMousePosition_x(event);
                var mux = (width - width*needleWidth);// / 2;

                workspace.system.mouse.mouseInteractionHandler(
                    function(event){
                        var numerator = initialX - currentMousePosition_x(event);
                        var divider = workspace.core.viewport.scale();
                        var location = initialValue - numerator/(divider*mux);
                        location = location < 0 ? 0 : location;
                        location = location > 1 ? 1 : location;
                        select(location);
                    },
                    function(event){
                        var numerator = initialX - currentMousePosition_x(event);
                        var divider = workspace.core.viewport.scale();
                        var location = initialValue - numerator/(divider*mux);
                        location = location < 0 ? 0 : location;
                        location = location > 1 ? 1 : location;
                        leadNeedle_grappled = false;
                        select(location);
                        if(object.onrelease != undefined){object.onrelease('lead',location);}
                    },       
                );
            };

            controlObjects.selection_A.getChildByName('invisibleHandle').onmouseenter = function(x,y,event){workspace.core.viewport.cursor('col-resize');};
            controlObjects.selection_A.getChildByName('invisibleHandle').onmouseleave = function(x,y,event){workspace.core.viewport.cursor('default');};
            controlObjects.selection_A.getChildByName('invisibleHandle').onmousedown = function(x,y,event){
                if(!interactable){return;}

                selectionNeedleA_grappled = true;

                var initialValue = needleData.selection_A;
                var initialX = currentMousePosition_x(event);
                var mux = (width - width*needleWidth);// / 2;

                workspace.system.mouse.mouseInteractionHandler(
                    function(event){
                        var numerator = initialX - currentMousePosition_x(event);
                        var divider = workspace.core.viewport.scale();
                        var location = initialValue - numerator/(divider*mux);
                        location = location < 0 ? 0 : location;
                        location = location > 1 ? 1 : location;
                        area(location,needleData.selection_B);
                    },
                    function(event){
                        var numerator = initialX - currentMousePosition_x(event);
                        var divider = workspace.core.viewport.scale();
                        var location = initialValue - numerator/(divider*mux);
                        location = location < 0 ? 0 : location;
                        location = location > 1 ? 1 : location;
                        selectionNeedleA_grappled = false;
                        area(location,needleData.selection_B);
                        if(object.onrelease != undefined){object.onrelease('selection_A',location);}
                    },       
                );
            };

            controlObjects.selection_B.getChildByName('invisibleHandle').onmouseenter = function(x,y,event){workspace.core.viewport.cursor('col-resize');};
            controlObjects.selection_B.getChildByName('invisibleHandle').onmouseleave = function(x,y,event){workspace.core.viewport.cursor('default');};
            controlObjects.selection_B.getChildByName('invisibleHandle').onmousedown = function(x,y,event){
                if(!interactable){return;}

                selectionNeedleB_grappled = true;

                var initialValue = needleData.selection_B;
                var initialX = currentMousePosition_x(event);
                var mux = (width - width*needleWidth);// / 2;

                workspace.system.mouse.mouseInteractionHandler(
                    function(event){
                        var numerator = initialX - currentMousePosition_x(event);
                        var divider = workspace.core.viewport.scale();
                        var location = initialValue - numerator/(divider*mux);
                        location = location < 0 ? 0 : location;
                        location = location > 1 ? 1 : location;
                        area(needleData.selection_A,location);
                    },
                    function(event){
                        var numerator = initialX - currentMousePosition_x(event);
                        var divider = workspace.core.viewport.scale();
                        var location = initialValue - numerator/(divider*mux);
                        location = location < 0 ? 0 : location;
                        location = location > 1 ? 1 : location;
                        selectionNeedleB_grappled = false;
                        area(needleData.selection_A,location);
                        if(object.onrelease != undefined){object.onrelease('selection_B',location);}
                    },       
                );
            };

            controlObjects.selection_area.onmouseenter = function(x,y,event){workspace.core.viewport.cursor('grab');};
            controlObjects.selection_area.onmouseleave = function(x,y,event){workspace.core.viewport.cursor('default');};
            controlObjects.selection_area.onmousedown = function(x,y,event){
                if(!interactable){return;}

                workspace.core.viewport.cursor('grabbing');
                selectionArea_grappled = true;

                var areaSize = needleData.selection_B - needleData.selection_A;
                var initialValues = {A:needleData.selection_A, B:needleData.selection_B};
                var initialX = currentMousePosition_x(event);
                var mux = (width - width*needleWidth);// / 2;

                function calculate(event){
                    var numerator = initialX - currentMousePosition_x(event);
                    var divider = workspace.core.viewport.scale();

                    var location = {
                        A: initialValues.A - numerator/(divider*mux),
                        B: initialValues.B - numerator/(divider*mux),
                    };

                    if( location.A > 1 ){ location.A = 1; location.B = 1 + areaSize; }
                    if( location.B > 1 ){ location.B = 1; location.A = 1 - areaSize; }
                    if( location.A < 0 ){ location.A = 0; location.B = areaSize; }
                    if( location.B < 0 ){ location.B = 0; location.A = -areaSize; }

                    return location;
                }
                workspace.system.mouse.mouseInteractionHandler(
                    function(event){
                        var location = calculate(event);
                        area(location.A,location.B);
                    },
                    function(event){
                        workspace.core.viewport.cursor('grab');

                        var location = calculate(event);

                        selectionArea_grappled = false;
                        area(location.A,location.B);
                        if(object.onrelease != undefined){object.onrelease('selection_A',location.A);}
                        if(object.onrelease != undefined){object.onrelease('selection_B',location.B);}
                    },
                );

                
            };

        //doubleclick to destroy selection area
            controlObjects.selection_A.ondblclick = function(x,y,event,shape){ if(!interactable){return;} area(-1,-1); workspace.core.viewport.cursor('default'); };
            controlObjects.selection_B.ondblclick = controlObjects.selection_A.ondblclick;
            controlObjects.selection_area.ondblclick = controlObjects.selection_A.ondblclick;
    
    //control
        object.mark = function(position){ return mark(position); };
        object.removeAllMarks = function(){ controlObjects.markGroup.clear(); };
        object.select = function(position,update=true){
            if(position == undefined){return select();}

            if(leadNeedle_grappled){return;}
            select(position,update);
        };
        object.area = function(positionA,positionB,update=true){
            if(positionA == undefined && positionB == undefined){ return area(); }
            if(selectionArea_grappled){return;}
            if(positionA != undefined && selectionNeedleA_grappled){return;}
            if(positionB != undefined && selectionNeedleB_grappled){return;}
            area(positionA,positionB,update);
        };
        object.interactable = function(bool){
            if(bool==undefined){return interactable;}
            interactable = bool;
        };

    //callback
        object.onchange = onchange;
        object.onrelease = onrelease;
        object.selectionAreaToggle = selectionAreaToggle;
        
    return object;
};