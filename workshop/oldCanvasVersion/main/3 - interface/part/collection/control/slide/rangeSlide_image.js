this.rangeslide_image = function(
    name='rangeslide_image', 
    x, y, width=10, height=95, angle=0, interactable=true,
    handleHeight=0.1, spanWidth=0.75, values={start:0,end:1}, resetValues={start:-1,end:-1},

    handleURL, backingURL, slotURL,
    invisibleHandleStyle = 'rgba(255,0,0,0)',
    spanURL,

    onchange=function(){},
    onrelease=function(){},
){
    //default to non-image version if image links are missing
        if(handleURL == undefined || backingURL == undefined || slotURL == undefined || spanURL == undefined){
            return this.rangeslide(
                name, x, y, width, height, angle, interactable,
                handleHeight, spanWidth, values, resetValues,
                handleURL, backingURL, slotURL, invisibleHandleStyle, spanURL,
                onchange, onrelease,
            );
        }



    var grappled = false;
    var handleNames = ['start','end'];

    //elements 
        //main
            var object = interfacePart.builder('group',name,{x:x, y:y, angle:angle});
        //backing and slot group
            var backingAndSlot = interfacePart.builder('group','backingAndSlotGroup');
            object.append(backingAndSlot);
            //backing
                var backing = interfacePart.builder('image','backing',{width:width, height:height, url:backingURL});
                backingAndSlot.append(backing);
            //slot
                var slot = interfacePart.builder('image','slot',{x:width*0.45, y:(height*(handleHeight/2)), width:width*0.1, height:height*(1-handleHeight), url:slotURL});
                backingAndSlot.append(slot);
            //backing and slot cover
                var backingAndSlotCover = interfacePart.builder('rectangle','backingAndSlotCover',{width:width, height:height, style:{fill:'rgba(0,0,0,0)'}});
                backingAndSlot.append(backingAndSlotCover);

        //span
            var span = interfacePart.builder('image','span',{x:width*((1-spanWidth)/2), y:height*handleHeight, width:width*spanWidth, height:height - 2*height*handleHeight, url:slotURL});
            object.append(span);

        //handles
            var handles = {}
            for(var a = 0; a < handleNames.length; a++){
                //grouping
                    handles[handleNames[a]] = interfacePart.builder('group','handle_'+a,{})
                    object.append(handles[handleNames[a]]);
                //handle
                    var handle = interfacePart.builder('image','handle',{width:width, height:height*handleHeight, url:handleURL});
                    handles[handleNames[a]].append(handle);
                //invisible handle
                    var invisibleHandleHeight = height*handleHeight + height*0.01;
                    var invisibleHandle = interfacePart.builder('rectangle','invisibleHandle',{y:(height*handleHeight - invisibleHandleHeight)/2, width:width, height:invisibleHandleHeight+handleHeight, style:{fill:invisibleHandleStyle}});
                    handles[handleNames[a]].append(invisibleHandle);
            }

        //cover
            var cover = interfacePart.builder('rectangle','cover',{width:width, height:height, style:{fill:'rgba(0,0,0,0)'}});
            object.append(cover);

            


    //graphical adjust
        function set(a,handle,update=true){
            a = (a>1 ? 1 : a);
            a = (a<0 ? 0 : a);

            //make sure the handle order is maintained
            //if necessary, one handle should push the other, though not past the ends
                switch(handle){
                    default: console.error('unknown handle to adjust'); break;
                    case 'start':
                        //don't allow start slide to encrouch on end slider's space
                            if( a / (1-(handleHeight/(1-handleHeight))) >= 1 ){ a = 1-(handleHeight/(1-handleHeight)); }

                        //if start slide bumps up against end slide; move end slide accordingly
                            var start_rightEdge = a + (1-a)*handleHeight;
                            var end_leftEdge = values.end - (values.end)*handleHeight;
                            if( start_rightEdge >= end_leftEdge ){
                                values.end = start_rightEdge/(1-handleHeight);
                            }
                    break;
                    case 'end':
                        //don't allow end slide to encrouch on start slider's space
                            if( a / (handleHeight/(1-handleHeight)) <= 1 ){ a = handleHeight/(1-handleHeight); }

                        //if end slide bumps up against start slide; move start slide accordingly
                            var start_rightEdge= values.start + (1-values.start)*handleHeight;
                            var end_leftEdge = a - (a)*handleHeight;
                            if( start_rightEdge >= end_leftEdge ){
                                values.start = (end_leftEdge - handleHeight)/(1-handleHeight);
                            }
                    break;
                }

            //fill in data
                values[handle] = a;

            //adjust y positions
                handles.start.parameter.y( values.start*height*(1-handleHeight) );
                handles.end.parameter.y( values.end*height*(1-handleHeight) );

            //adjust span height (with a little bit of padding so the span is under the handles a little)
                span.parameter.y( height*(handleHeight + values.start - handleHeight*(values.start + 0.1)) );
                span.parameter.height( height*( values.end - values.start + handleHeight*(values.start - values.end - 1 + 0.2) ) );

            if(update && object.onchange){object.onchange(values);}
        }
        function pan(a){
            var diff = values.end - values.start;

            var newPositions = [ a, a+diff ];
            if(newPositions[0] <= 0){
                newPositions[1] = newPositions[1] - newPositions[0];
                newPositions[0] = 0;
            }
            else if(newPositions[1] >= 1){
                newPositions[0] = newPositions[0] - (newPositions[1]-1);
                newPositions[1] = 1;
            }

            set( newPositions[0],'start' );
            set( newPositions[1],'end' );
        }




    //methods
        object.get = function(){return values;};
        object.set = function(values,update){
            if(grappled){return;}
            if(values.start != undefined){set(values.start,'start',update);}
            if(values.end != undefined){set(values.end,'end',update);}
        };
        object.interactable = function(bool){
            if(bool==undefined){return interactable;}
            interactable = bool;
        };



        
    //interaction
        function getPositionWithinFromMouse(x,y){
            //calculate the distance the click is from the top of the slider (accounting for angle)
                var offset = backingAndSlot.getOffset();
                var delta = {
                    x: x - (backingAndSlot.x     + offset.x),
                    y: y - (backingAndSlot.y     + offset.y),
                    a: 0 - (backingAndSlot.angle + offset.a),
                };

            return workspace.library.math.cartesianAngleAdjust( delta.x, delta.y, delta.a ).y / backingAndSlotCover.height;
        }

        //background click
            //to stop clicks passing through the span
                span.onmousedown = function(){};
                span.onclick = function(){};

            backingAndSlotCover.onmousedown = function(x,y,event){};//to stop unit selection
            backingAndSlotCover.onclick = function(x,y,event){
                if(!interactable){return;}
                if(grappled){return;}

                //calculate the distance the click is from the top of the slider (accounting for angle)
                    var d = getPositionWithinFromMouse(x,y);

                //use the distance to calculate the correct value to set the slide to
                //taking into account the slide handle's size also
                    var value = d + 0.5*handleHeight*((2*d)-1);

                //whichever handle is closer; move that handle to the mouse's position
                    Math.abs(values.start-value) < Math.abs(values.end-value) ? set(value,'start') : set(value,'end');
            };

        //double-click reset
            cover.ondblclick = function(){
                if(!interactable){return;}
                if(resetValues.start<0 || resetValues.end<0){return;}
                if(grappled){return;}

                set(resetValues.start,'start');
                set(resetValues.end,'end');
                object.onrelease(values);
            };

        //span panning - expand/shrink
            cover.onwheel = function(){
                if(!interactable){return;}
                if(grappled){return;}

                var move = event.deltaY/100;
                var globalScale = workspace.core.viewport.scale();
                var val = move/(10*globalScale);

                set(values.start-val,'start');
                set(values.end+val,'end');
            };

        //span panning - drag
            span.onmousedown = function(x,y,event){
                if(!interactable){return;}
                grappled = true;

                var initialValue = values.start;
                var initialPosition = getPositionWithinFromMouse(x,y);

                workspace.system.mouse.mouseInteractionHandler(
                    function(event){
                        var point = workspace.core.viewport.windowPoint2workspacePoint(event.x,event.y);
                        var livePosition = getPositionWithinFromMouse(point.x,point.y);
                        pan( initialValue+(livePosition-initialPosition) )
                        object.onchange(values);
                    },
                    function(event){
                        object.onrelease(values);
                        grappled = false;
                    }
                );
            };

        //handle movement
            for(var a = 0; a < handleNames.length; a++){
                handles[handleNames[a]].children[1].onmousedown = (function(a){
                    return function(x,y,event){
                        if(!interactable){return;}
                        grappled = true;
            
                        var initialValue = values[handleNames[a]];
                        var initialPosition = getPositionWithinFromMouse(x,y);
                        
                        workspace.system.mouse.mouseInteractionHandler(
                            function(event){
                                var point = workspace.core.viewport.windowPoint2workspacePoint(event.x,event.y);
                                var livePosition = getPositionWithinFromMouse(point.x,point.y);
                                set( initialValue+(livePosition-initialPosition)/(1-handleHeight), handleNames[a] );
                                object.onchange(values);
                            },
                            function(event){
                                object.onrelease(values);
                                grappled = false;
                            }
                        );
                    }
                })(a);
            }
  



    //callbacks
        object.onchange = onchange;
        object.onrelease = onrelease;  

    //setup
        set(0,'start');
        set(1,'end');

    return object;
};