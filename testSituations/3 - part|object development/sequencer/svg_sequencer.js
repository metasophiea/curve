var svg_sequencer = function(
    id='svg_sequencer',
    x, y, width, height, angle,
    
    xCount=64, yCount=16,
    zoomLevel_x=1/1, zoomLevel_y=1/1,

    backingStyle='fill:rgba(20,20,20,1);',
    selectionAreaStyle='fill:rgba(209, 189, 222, 0.5);stroke:rgba(225, 217, 234,1);stroke-width:0.5;pointer-events:none;',

    blockStyle_body=[
        'fill:rgba(138,138,138,0.6);stroke:rgba(175,175,175,0.8);stroke-width:0.5;',
        'fill:rgba(130,199,208,0.6);stroke:rgba(130,199,208,0.8);stroke-width:0.5;',
        'fill:rgba(129,209,173,0.6);stroke:rgba(129,209,173,0.8);stroke-width:0.5;',
        'fill:rgba(234,238,110,0.6);stroke:rgba(234,238,110,0.8);stroke-width:0.5;',
        'fill:rgba(249,178,103,0.6);stroke:rgba(249,178,103,0.8);stroke-width:0.5;',
        'fill:rgba(255, 69, 69,0.6);stroke:rgba(255, 69, 69,0.8);stroke-width:0.5;',
    ],
    blockStyle_bodyGlow=[
        'fill:rgba(138,138,138,0.8);stroke:rgba(175,175,175,1);stroke-width:0.5;',
        'fill:rgba(130,199,208,0.8);stroke:rgba(130,199,208,1);stroke-width:0.5;',
        'fill:rgba(129,209,173,0.8);stroke:rgba(129,209,173,1);stroke-width:0.5;',
        'fill:rgba(234,238,110,0.8);stroke:rgba(234,238,110,1);stroke-width:0.5;',
        'fill:rgba(249,178,103,0.8);stroke:rgba(249,178,103,1);stroke-width:0.5;',
        'fill:rgba(255, 69, 69,0.8);stroke:rgba(255, 69, 69,1);stroke-width:0.5;',
    ],    
    blockStyle_handle='fill:rgba(200,0,0,0);cursor:col-resize;',
    blockStyle_handleWidth=3,

    horizontalStripStyle_pattern=[0,1],
    horizontalStripStyle_glow='stroke:rgba(120,120,120,1);stroke-width:0.5;fill:rgba(120,120,120,0.8);',
    horizontalStripStyle_styles=[
        'stroke:rgba(120,120,120,1);stroke-width:0.5;fill:rgba(120,120,120,0.5);',
        'stroke:rgba(120,120,120,1);stroke-width:0.5;fill:rgba(100,100,100,0);',
    ],
    verticalStripStyle_pattern=[0],
    verticalStripStyle_glow='stroke:rgba(252,244,128,0.5);stroke-width:0.5;fill:rgba(229, 221, 112,0.25);',
    verticalStripStyle_styles=[
        'stroke:rgba(120,120,120,1);stroke-width:0.5;fill:rgba(30,30,30,0.5);',
    ],

    playheadStyle='stroke:rgb(240, 240, 240);',
){
    //state
        var totalSize =  {
            width:  width/zoomLevel_x,
            height: height/zoomLevel_y,
        };
        var viewposition = {x:0,y:0};
        var viewArea = {
            left:0, right:zoomLevel_x,
            top:0, bottom:zoomLevel_y,
        };
        var noteRegistry = new parts.circuits.sequencing.noteRegistry(xCount,yCount);
        var selectedNotes = [];
        var activeNotes = [];
        var snapping = true;
        var step = 1/1;
        var defualtStrength = 0.5;
        var loop = {active:false, period:{start:0, end:xCount}};
        var playhead = {
            width:0.75,
            invisibleHandleMux:6,
            position:-1,
            held:false,
            automoveViewposition:false,
        };

    //internal functions
        function setViewArea(d,update=true){
            //clean off input
                if(d == undefined || (d.left == undefined && d.right == undefined && d.top == undefined && d.bottom == undefined)){return viewArea;}
                if(d.left == undefined){d.left = viewArea.left;} if(d.right == undefined){d.right = viewArea.right;}
                if(d.top == undefined){d.top = viewArea.top;}    if(d.bottom == undefined){d.bottom = viewArea.bottom;}

            //only adjust the zoom, if the distance between the areas changed
                var x = (viewArea.right-viewArea.left)==(d.right-d.left);
                var y = (d.bottom-d.top)==(viewArea.bottom-viewArea.top);
                if(x && y){ adjustZoom( (d.right-d.left),(d.bottom-d.top) ); }
                else if(x){ adjustZoom( (d.right-d.left),undefined ); }
                else if(y){ adjustZoom( undefined,(d.bottom-d.top) ); }

            //update pan
                var newX = 0; var newY = 0;
                if( (1-(d.right-d.left)) != 0 ){ newX = d.left + d.left*((d.right-d.left)/(1-(d.right-d.left))); }
                if( (1-(d.bottom-d.top)) != 0 ){ newY = d.top  +  d.top*((d.bottom-d.top)/(1-(d.bottom-d.top))); }
                setViewposition(newX,newY,update);

            //update state
                viewArea = { top:d.top, bottom:d.bottom, left:d.left, right:d.right };
        }
        function adjustZoom(x,y){
            if(x == undefined && y == undefined){return {x:zoomLevel_x, y:zoomLevel_y};}
            var maxZoom = 0.01;
            
            //(awkward bid for speed)
            if(x != undefined && x != zoomLevel_x && y != undefined && y != zoomLevel_y ){
                //make sure things are between 0.01 and 1
                    var maxZoom = 0.01;
                    x = x<maxZoom?maxZoom:x; x = x>1?1:x;
                    y = y<maxZoom?maxZoom:y; y = y>1?1:y;

                //update state
                    zoomLevel_x = x;
                    zoomLevel_y = y;
                    totalSize.width = width/zoomLevel_x;
                    totalSize.height = height/zoomLevel_y;

                //update interactionPlane
                    interactionPlane.width.baseVal.value = totalSize.width;
                    interactionPlane.height.baseVal.value = totalSize.height;

                //update background strips
                    for(var a = 0; a < xCount; a++){
                        __globals.utility.element.setTransform_XYonly(backgroundDrawArea.children['strip_vertical_'+a], a*(width/(xCount*zoomLevel_x)), 0);
                        backgroundDrawArea.children['strip_vertical_'+a].width.baseVal.value = width/(xCount*zoomLevel_x);
                        backgroundDrawArea.children['strip_vertical_'+a].height.baseVal.value = totalSize.height;
                    }
                    for(var a = 0; a < yCount; a++){
                        __globals.utility.element.setTransform_XYonly(backgroundDrawArea.children['strip_horizontal_'+a], 0, a*(height/(yCount*zoomLevel_y)));
                        backgroundDrawArea.children['strip_horizontal_'+a].height.baseVal.value = height/(yCount*zoomLevel_y);
                        backgroundDrawArea.children['strip_horizontal_'+a].width.baseVal.value = totalSize.width;
                    }

                //update note blocks
                    for(var a = 0; a < notePane.children.length; a++){
                        notePane.children[a].unit(width/(xCount*zoomLevel_x), height/(yCount*zoomLevel_y));
                    }

                //update playhead (if there is one)
                    if(playhead.position >= 0){
                        workarea.children.playhead.main.y2.baseVal.value = totalSize.height;
                        workarea.children.playhead.invisibleHandle.y2.baseVal.value = totalSize.height;
                        __globals.utility.element.setTransform_XYonly(workarea.children.playhead, playhead.position*(totalSize.width/xCount), 0);
                }
            }else if( x != undefined && x != zoomLevel_x ){
                //make sure things are between maxZoom and 1
                    x = x<maxZoom?maxZoom:x; x = x>1?1:x;

                //update state
                    zoomLevel_x = x;
                    totalSize.width = width/zoomLevel_x;

                //update interactionPlane
                    interactionPlane.width.baseVal.value = totalSize.width;

                //update background strips
                    for(var a = 0; a < xCount; a++){
                        __globals.utility.element.setTransform_XYonly(backgroundDrawArea.children['strip_vertical_'+a], a*(width/(xCount*zoomLevel_x)), 0);
                        backgroundDrawArea.children['strip_vertical_'+a].width.baseVal.value = width/(xCount*zoomLevel_x);
                    }
                    for(var a = 0; a < yCount; a++){
                        backgroundDrawArea.children['strip_horizontal_'+a].width.baseVal.value = totalSize.width;
                    }

                //update note blocks
                    for(var a = 0; a < notePane.children.length; a++){
                        notePane.children[a].unit(width/(xCount*zoomLevel_x), undefined);
                    }

                //update playhead (if there is one)
                    if(playhead.position >= 0){
                        __globals.utility.element.setTransform_XYonly(workarea.children.playhead, playhead.position*(totalSize.width/xCount), 0);
                    }
            }else if( y != undefined && y != zoomLevel_y ){
                //make sure things are between maxZoom and 1
                    y = y<maxZoom?maxZoom:y; y = y>1?1:y;

                //update state
                    zoomLevel_y = y;
                    totalSize.height = height/zoomLevel_y;

                //update interactionPlane
                    interactionPlane.height.baseVal.value = totalSize.height;
                
                //update background strips
                    for(var a = 0; a < xCount; a++){
                        backgroundDrawArea.children['strip_vertical_'+a].height.baseVal.value = totalSize.height;
                    }
                    for(var a = 0; a < yCount; a++){
                        __globals.utility.element.setTransform_XYonly(backgroundDrawArea.children['strip_horizontal_'+a], 0, a*(height/(yCount*zoomLevel_y)));
                        backgroundDrawArea.children['strip_horizontal_'+a].height.baseVal.value = height/(yCount*zoomLevel_y);
                    }

                //update note blocks
                    for(var a = 0; a < notePane.children.length; a++){
                        notePane.children[a].unit(undefined, height/(yCount*zoomLevel_y));
                    }

                //update playhead (if there is one)
                    if(playhead.position >= 0){
                        workarea.children.playhead.main.y2.baseVal.value = totalSize.height;
                        workarea.children.playhead.invisibleHandle.y2.baseVal.value = totalSize.height;
                    }
            }
        }
        function drawBackground(){
            backgroundDrawArea.innerHTML = '';

            //background stipes
                //horizontal strips
                for(var a = 0; a < yCount; a++){
                    backgroundDrawArea.appendChild(
                        __globals.utility.misc.elementMaker('rect','strip_horizontal_'+a,{
                            x1:0, y:a*(height/(yCount*zoomLevel_y)),
                            width:totalSize.width, height:height/(yCount*zoomLevel_y),
                            style:horizontalStripStyle_styles[horizontalStripStyle_pattern[a%horizontalStripStyle_pattern.length]],
                        })
                    );
                }
                //vertical strips
                for(var a = 0; a < xCount; a++){
                    backgroundDrawArea.appendChild(
                        __globals.utility.misc.elementMaker('rect','strip_vertical_'+a,{
                            x:a*(width/(xCount*zoomLevel_x)), y:0,
                            width:width/(xCount*zoomLevel_x), height:totalSize.height,
                            style:verticalStripStyle_styles[verticalStripStyle_pattern[a%verticalStripStyle_pattern.length]],
                        })
                    );
                }
        }
        function setViewposition(x,y,update=true){
            if(x == undefined && y == undefined){return viewposition;}
            if(x == undefined || isNaN(x)){ x = viewposition.x; }
            if(y == undefined || isNaN(y)){ y = viewposition.y; }

            //make sure things are between 0 and 1
                x = x<0?0:x; x = x>1?1:x;
                y = y<0?0:y; y = y>1?1:y;

            //perform transform
                viewposition.x = x;
                viewposition.y = y;
                __globals.utility.element.setTransform_XYonly(
                    workarea,
                    -viewposition.x*(totalSize.width - width),
                    -viewposition.y*(totalSize.height - height)
                );

            //adjust clipping box to follow where the viewport is looking
                var x_offSet = (totalSize.width - width) * viewposition.x;
                var y_offSet = (totalSize.height - height) * viewposition.y;
                var q = {
                    tl:{x:x_offSet,       y:y_offSet},
                    br:{x:x_offSet+width, y:y_offSet+height},
                };
                viewport.setAttribute('clip-path','polygon('+q.tl.x+'px '+q.tl.y+'px, '+q.tl.x+'px '+q.br.y+'px, '+q.br.x+'px '+q.br.y+'px, '+q.br.x+'px '+q.tl.y+'px)');

            //update viewArea
                var offsetX = (1-(viewArea.right-viewArea.left))*x;
                var offsetY = (1-(viewArea.bottom-viewArea.top))*y;
                viewArea = {
                    left:   offsetX, 
                    right:  offsetX+(viewArea.right-viewArea.left),
                    top:    offsetY,   
                    bottom: offsetY+(viewArea.bottom-viewArea.top),
                };

            //callbacks
                if(update){
                    obj.onpan({x:x,y:y});
                    obj.onchangeviewarea(viewArea);
                }
        };
        function visible2coordinates(xy){
            return {
                x: zoomLevel_x*(xy.x - viewposition.x) + viewposition.x,
                y: zoomLevel_y*(xy.y - viewposition.y) + viewposition.y,
            };
        }
        function coordinates2lineposition(xy){
            xy.y = Math.floor(xy.y*yCount);
            if(xy.y >= yCount){xy.y = yCount-1;}
        
            xy.x = snapping ? Math.round((xy.x*xCount)/step)*step : xy.x*xCount;
            if(xy.x < 0){xy.x =0;}
        
            return {line:xy.y, position:xy.x};
        }
        function makeNote(line, position, length, strength=defualtStrength){
            var newID = noteRegistry.add({ line:line, position:position, length:length, strength:strength });
            var approvedData = noteRegistry.getNote(newID);
            var newNoteBlock = svg_sequencer.noteBlock(newID, width/(xCount*zoomLevel_x), height/(yCount*zoomLevel_y), approvedData.line, approvedData.position, approvedData.length, approvedData.strength, false, blockStyle_body, blockStyle_bodyGlow, blockStyle_handle, blockStyle_handleWidth);
            notePane.append(newNoteBlock);

            //augmenting the graphic element
                newNoteBlock.select = function(remainSelected=false){
                    if(selectedNotes.indexOf(this) != -1){ if(!remainSelected){this.deselect();} return; }
                    this.selected(true);
                    selectedNotes.push(this);
                    this.glow(true);
                };
                newNoteBlock.deselect = function(){
                    selectedNotes.splice(selectedNotes.indexOf(this),1);
                    this.selected(false);
                    this.glow(false);
                };
                newNoteBlock.delete = function(){
                    this.deselect();
                    noteRegistry.remove(parseInt(this.id));
                    this.remove();
                };
                newNoteBlock.ondblclick = function(event){
                    if(!event[__globals.super.keys.ctrl]){return;}
                    selectedNotes.map(function(a){
                        a.strength(defualtStrength);
                        noteRegistry.update(a.id, { strength: defualtStrength });
                    });
                };
                newNoteBlock.body.onmousedown = function(event){
                    //if spacebar is pressed; ignore all of this, and redirect to the interaction pane (for panning)
                    if(__globals.keyboardInteraction.pressedKeys.hasOwnProperty('Space') && __globals.keyboardInteraction.pressedKeys.Space){
                        interactionPlane.onmousedown(event); return;
                    }

                    //if the shift key is not pressed and this note is not already selected; deselect everything
                        if(!event.shiftKey && !newNoteBlock.selected()){
                            while(selectedNotes.length > 0){
                                selectedNotes[0].deselect();
                            }
                        }

                    //select this block
                        newNoteBlock.select(true);

                    //gather data for all the blocks that we're about to affect
                        var activeBlocks = [];
                        for(var a = 0; a < selectedNotes.length; a++){
                            activeBlocks.push({
                                id: parseInt(selectedNotes[a].id),
                                block: selectedNotes[a],
                                starting: noteRegistry.getNote(parseInt(selectedNotes[a].id)),
                            });
                        }

                    //if control key is pressed; this is a strength-change operation
                        if(event[__globals.super.keys.ctrl]){
                            var initialStrengths = activeBlocks.map(a => a.block.strength());
                            var initial = event.offsetY;
                            __globals.utility.workspace.mouseInteractionHandler(function(event){
                                var diff = (initial - event.offsetY)/__globals.svgElement.clientHeight;
                                for(var a = 0; a < activeBlocks.length; a++){
                                    activeBlocks[a].block.strength(initialStrengths[a] + diff);
                                    noteRegistry.update(activeBlocks[a].id, { strength: initialStrengths[a] + diff });
                                }
                            });
                            return;
                        }

                    //if the alt key is pressed, clone the block
                    //(but don't select it, this is 'alt-click-and-drag to clone' trick)
                    //this function isn't run until the first sign of movement
                        var cloned = false;
                        function cloneFunc(){
                            if(cloned){return;} cloned = true;
                            if(event[__globals.super.keys.alt]){
                                for(var a = 0; a < selectedNotes.length; a++){
                                    var temp = noteRegistry.getNote(parseInt(selectedNotes[a].id));
                                    makeNote(temp.line, temp.position, temp.length, temp.strength);
                                }
                            }
                        }

                    //block movement
                        var initialPosition = coordinates2lineposition(__globals.utility.element.getPositionWithinFromMouse(event,interactionPlane,totalSize.width,totalSize.height));
                        __globals.utility.workspace.mouseInteractionHandler(
                            function(event){//move
                                cloneFunc(); //clone that block

                                var livePosition = coordinates2lineposition(__globals.utility.element.getPositionWithinFromMouse(event,interactionPlane,totalSize.width,totalSize.height));
                                var diff = {
                                    line: livePosition.line - initialPosition.line,
                                    position: livePosition.position - initialPosition.position,
                                };
        
                                for(var a = 0; a < activeBlocks.length; a++){
                                    noteRegistry.update(activeBlocks[a].id, {
                                        line:activeBlocks[a].starting.line+diff.line,
                                        position:activeBlocks[a].starting.position+diff.position,
                                    });
        
                                    var temp = noteRegistry.getNote(activeBlocks[a].id);
        
                                    activeBlocks[a].block.line( temp.line );
                                    activeBlocks[a].block.position( temp.position );
                                }
                            },
                        );
                };
                newNoteBlock.leftHandle.onmousedown = function(event){
                    //if the shift key is not pressed and this block wasn't selected; deselect everything and select this one
                        if(!event.shiftKey && !newNoteBlock.selected()){
                            while(selectedNotes.length > 0){
                                selectedNotes[0].deselect();
                            }
                        }
                    
                    //select this block
                        newNoteBlock.select(true);

                    //gather data for all the blocks that we're about to affect
                        var activeBlocks = [];
                        for(var a = 0; a < selectedNotes.length; a++){
                            activeBlocks.push({
                                id: parseInt(selectedNotes[a].id),
                                block: selectedNotes[a],
                                starting: noteRegistry.getNote(parseInt(selectedNotes[a].id)),
                            });
                        }
                    
                    //perform block length adjustment 
                        var initialPosition = coordinates2lineposition(__globals.utility.element.getPositionWithinFromMouse(event,interactionPlane,totalSize.width,totalSize.height));
                        __globals.utility.workspace.mouseInteractionHandler(
                            function(event){
                                var livePosition = coordinates2lineposition(__globals.utility.element.getPositionWithinFromMouse(event,interactionPlane,totalSize.width,totalSize.height));
                                var diff = {position: initialPosition.position-livePosition.position};
        
                                for(var a = 0; a < activeBlocks.length; a++){
                                    if( activeBlocks[a].starting.position-diff.position < 0 ){ continue; } //this stops a block from getting longer, when it is unable to move any further to the left
                                    
                                    noteRegistry.update(activeBlocks[a].id, {
                                        length: activeBlocks[a].starting.length+diff.position,
                                        position: activeBlocks[a].starting.position-diff.position,
                                    });
                                    var temp = noteRegistry.getNote(activeBlocks[a].id);
                                    activeBlocks[a].block.position( temp.position );
                                    activeBlocks[a].block.length( temp.length );
                                }
                            }
                        );
                };
                newNoteBlock.rightHandle.onmousedown = function(event){
                    //if the shift key is not pressed and this block wasn't selected; deselect everything and select this one
                        if(!event.shiftKey && !newNoteBlock.selected()){
                            while(selectedNotes.length > 0){
                                selectedNotes[0].deselect();
                            }
                        }
                    
                    //select this block
                        newNoteBlock.select(true);

                    //gather data for all the blocks that we're about to affect
                        var activeBlocks = [];
                        for(var a = 0; a < selectedNotes.length; a++){
                            activeBlocks.push({
                                id: parseInt(selectedNotes[a].id),
                                block: selectedNotes[a],
                                starting: noteRegistry.getNote(parseInt(selectedNotes[a].id)),
                            });
                        }

                    //perform block length adjustment 
                        var initialPosition = coordinates2lineposition(__globals.utility.element.getPositionWithinFromMouse(event,interactionPlane,totalSize.width,totalSize.height));
                        __globals.utility.workspace.mouseInteractionHandler(
                            function(event){
                                var livePosition = coordinates2lineposition(__globals.utility.element.getPositionWithinFromMouse(event,interactionPlane,totalSize.width,totalSize.height));
                                var diff = {position: livePosition.position - initialPosition.position};
        
                                for(var a = 0; a < activeBlocks.length; a++){
                                    noteRegistry.update(activeBlocks[a].id, {length: activeBlocks[a].starting.length+diff.position});
                                    var temp = noteRegistry.getNote(activeBlocks[a].id);
                                    activeBlocks[a].block.position( temp.position );
                                    activeBlocks[a].block.length( temp.length );
                                }
                            }
                        );
                };

            return {id:newID, noteBlock:newNoteBlock};
        }
        function makePlayhead(){
            var newPlayhead = __globals.utility.misc.elementMaker('g','playhead',{});
            workarea.appendChild(newPlayhead);
            newPlayhead.onmousedown = function(){
                playhead.held = true;
                __globals.utility.workspace.mouseInteractionHandler(
                    function(event){//move
                        var livePosition = coordinates2lineposition(__globals.utility.element.getPositionWithinFromMouse(event,interactionPlane,totalSize.width,totalSize.height));
                        obj.playheadPosition(livePosition.position);
                    },
                    function(){playhead.held = false;}
                );
            };

            newPlayhead.main = __globals.utility.misc.elementMaker('line','main',{
                x1:0, y1:0,
                x2:0, y2:totalSize.height,
                style:playheadStyle + 'stroke-width:'+playhead.width+';'
            });
            newPlayhead.appendChild(newPlayhead.main);

            newPlayhead.invisibleHandle = __globals.utility.misc.elementMaker('line','invisibleHandle',{
                x1:0, y1:0, x2:0, y2:totalSize.height,
                style:'stroke:rgba(0,0,0,0); cursor: col-resize; stroke-width:'+playhead.width*playhead.invisibleHandleMux+';'
            });
            newPlayhead.appendChild(newPlayhead.invisibleHandle);
        }

    //elements
        //main
            var obj = __globals.utility.misc.elementMaker('g',id,{x:x, y:y, r:angle});
        //static backing
            var backing = __globals.utility.misc.elementMaker('rect','backing',{width:width, height:height, style:backingStyle});
            obj.appendChild(backing);
        //viewport (for clipping the workarea)
            var viewport = __globals.utility.misc.elementMaker('g','viewport',{});
            viewport.setAttribute('clip-path','polygon(0px 0px, '+width+'px 0px, '+width+'px '+height+'px, 0px '+height+'px)');
            obj.appendChild(viewport);
        //workarea
            var workarea = __globals.utility.misc.elementMaker('g','workarea',{});
            viewport.appendChild(workarea);
            workarea.onkeydown = function(event){
                if(event.key == 'Delete' || event.key == 'Backspace'){
                    //delete all selected notes
                    while(selectedNotes.length > 0){
                        selectedNotes[0].delete();
                    }
                    return true;
                }
            };
            //moveable background
                var backgroundDrawArea = __globals.utility.misc.elementMaker('g','backgroundDrawArea',{});
                workarea.appendChild(backgroundDrawArea);
                drawBackground();
            //interaction pane
                var interactionPlane = __globals.utility.misc.elementMaker('rect','interactionPlane',{width:totalSize.width, height:totalSize.height, style:'fill:rgba(0,0,0,0);'});
                workarea.appendChild(interactionPlane);
                interactionPlane.onmousedown = function(event){

                    if(event.shiftKey){ //click-n-drag group select
                        var initialPositionData = __globals.utility.element.getPositionWithinFromMouse(event,backing,width,height);
                        var livePositionData = __globals.utility.element.getPositionWithinFromMouse(event,backing,width,height);
                        
                        var selectionArea = __globals.utility.misc.elementMaker('rect','selectionArea',{
                            x:initialPositionData.x*width, y:initialPositionData.y*height,
                            width:0, height:0,
                            style:selectionAreaStyle,
                        });
                        obj.appendChild(selectionArea);
    
                        __globals.utility.workspace.mouseInteractionHandler(
                            function(event){//move
                                //live re-size the selection box
                                    livePositionData = __globals.utility.element.getPositionWithinFromMouse(event,backing,width,height);
                                    var diff = {x:livePositionData.x-initialPositionData.x, y:livePositionData.y-initialPositionData.y};
            
                                    var transform = {};
                                    if(diff.x < 0){ 
                                        selectionArea.width.baseVal.value = -diff.x*width;
                                        transform.x = initialPositionData.x+diff.x;
                                    }else{ 
                                        selectionArea.width.baseVal.value = diff.x*width;
                                        transform.x = initialPositionData.x;
                                    }
                                    if(diff.y < 0){ 
                                        selectionArea.height.baseVal.value = -diff.y*height;
                                        transform.y = initialPositionData.y+diff.y;
                                    }else{ 
                                        selectionArea.height.baseVal.value = diff.y*height;
                                        transform.y = initialPositionData.y;
                                    }
            
                                    __globals.utility.element.setTransform_XYonly(selectionArea, transform.x*width, transform.y*height);
                            },
                            function(){//stop
                                //remove selection box
                                    selectionArea.remove();

                                //gather the corner points
                                    var finishingPositionData = {
                                        a:visible2coordinates(initialPositionData),
                                        b:visible2coordinates(livePositionData),
                                    };
                                    finishingPositionData.a.x *= totalSize.width;  finishingPositionData.b.y *= totalSize.height;
                                    finishingPositionData.b.x *= totalSize.width;  finishingPositionData.a.y *= totalSize.height;

                                    var selectionBox = [{},{}];
                                    if( finishingPositionData.a.x < finishingPositionData.b.x ){
                                        selectionBox[0].x = finishingPositionData.a.x;
                                        selectionBox[1].x = finishingPositionData.b.x;
                                    }else{
                                        selectionBox[0].x = finishingPositionData.b.x;
                                        selectionBox[1].x = finishingPositionData.a.x;
                                    }
                                    if( finishingPositionData.a.y < finishingPositionData.b.y ){
                                        selectionBox[0].y = finishingPositionData.a.y;
                                        selectionBox[1].y = finishingPositionData.b.y;
                                    }else{
                                        selectionBox[0].y = finishingPositionData.b.y;
                                        selectionBox[1].y = finishingPositionData.a.y;
                                    }

                                //deselect everything
                                    while(selectedNotes.length > 0){
                                        selectedNotes[0].deselect();
                                    }

                                //select the notes that overlap with the selection area
                                    var noteBlocks = notePane.getElementsByTagName('g');
                                    for(var a = 0; a < noteBlocks.length; a++){
                                        var temp = noteRegistry.getNote(parseInt(noteBlocks[a].id));
                                        var block = [
                                                {x:temp.position*(totalSize.width/xCount), y:temp.line*(totalSize.height/yCount)},
                                                {x:(temp.position+temp.length)*(totalSize.width/xCount), y:(temp.line+1)*(totalSize.height/yCount)},
                                            ];    
                                        if( __globals.utility.math.detectOverlap(selectionBox,block,selectionBox,block) ){ noteBlocks[a].select(true); }
                                    }
                            }
                        );
                    }else if(event[__globals.super.keys.alt]){ //create note
                        //deselect everything
                            while(selectedNotes.length > 0){
                                selectedNotes[0].deselect();
                            }
                        
                        //get the current location and make a new note there (with length 0)
                            var position = coordinates2lineposition(__globals.utility.element.getPositionWithinFromMouse(event,interactionPlane,totalSize.width,totalSize.height));
                            var temp = makeNote(position.line,position.position,0);
    
                        //select this new block, and direct the mouse-down to the right handle (for user lengthening)
                            temp.noteBlock.select();
                            temp.noteBlock.rightHandle.onmousedown(event);
                    }else if(__globals.keyboardInteraction.pressedKeys.Space){//panning
                        var initialPosition = __globals.utility.element.getPositionWithinFromMouse(event,backing,width,height);
                        var old_viewposition = {x:viewposition.x, y:viewposition.y};
                        __globals.utility.workspace.mouseInteractionHandler(
                            function(event){
                                var livePosition = __globals.utility.element.getPositionWithinFromMouse(event,backing,width,height);
                                var diffPosition = {x:initialPosition.x-livePosition.x, y:initialPosition.y-livePosition.y};
                                setViewposition(
                                    old_viewposition.x + (diffPosition.x*(xCount*zoomLevel_x))/(xCount-(xCount*zoomLevel_x)),
                                    old_viewposition.y + (diffPosition.y*(yCount*zoomLevel_y))/(yCount-(yCount*zoomLevel_y)),
                                );
                            },
                            function(event){}
                        );
                    }else{ //elsewhere click
                        //deselect everything
                            while(selectedNotes.length > 0){
                                selectedNotes[0].deselect();
                            }
                    }

                };
            //note block area
                var notePane = __globals.utility.misc.elementMaker('g','notePane',{});
                workarea.appendChild(notePane);

    //controls
        //background
        obj.glowHorizontal = function(state,start,end){
            if(end == undefined){end = start+1;}

            for(var a = start; a < end; a++){
                __globals.utility.element.setStyle(
                    backgroundDrawArea.children['strip_horizontal_'+a],
                    state ? horizontalStripStyle_glow : horizontalStripStyle_styles[horizontalStripStyle_pattern[a%horizontalStripStyle_pattern.length]]
                );
            }
        };
        obj.glowVertical = function(state,start,end){
            if(end == undefined){end = start+1;}

            for(var a = start; a < end; a++){
                __globals.utility.element.setStyle(
                    backgroundDrawArea.children['strip_vertical_'+a],
                    state ? verticalStripStyle_glow : verticalStripStyle_styles[verticalStripStyle_pattern[a%verticalStripStyle_pattern.length]]
                );
            }
        };

        //step
        obj.step = function(a){
            if(a == undefined){return step;}
            step = a;
        };

        //viewport position
        obj.viewposition = setViewposition;
        obj.viewArea = setViewArea;

        //note interaction
        obj.export = function(){return noteRegistry.export();};
        obj.import = function(data){noteRegistry.import(data);};
        obj.eventsBetween = function(start,end){ return noteRegistry.eventsBetween(start,end); };
        obj.getAllNotes = function(){return noteRegistry.getAllNotes(); };
        obj.addNote = function(line, position, length, strength=1){ makeNote(line, position, length, strength); };
        obj.addNotes = function(data){ for(var a = 0; a < data.length; a++){this.addNote(data[a].line, data[a].position, data[a].length, data[a].strength);} };

        //loop
        obj.loopActive = function(a){
            if(a == undefined){return loop.active;}
            loop.active = a;

            obj.glowVertical(false,0,xCount);
            if( loop.active ){
                obj.glowVertical(true, 
                    loop.period.start < 0 ? 0 : loop.period.start, 
                    loop.period.end > xCount ? xCount : loop.period.end,
                );
            }
        };
        obj.loopPeriod = function(start,end){
            if(start == undefined || end == undefined){return loop.period;}
            if(start > end || start < 0 || end < 0){return;}

            loop.period = {start:start, end:end};

            if( loop.active ){
                obj.glowVertical(false,0,xCount);
                obj.glowVertical(true,
                    start < 0 ? 0 : start, 
                    end > xCount ? xCount : end,
                );
            }
        };

        //playhead
        obj.automove = function(a){
            if(a == undefined){return playhead.automoveViewposition;}
            playhead.automoveViewposition = a;
        };
        obj.playheadPosition = function(val,stopActive=true){
            if(val == undefined){return playhead.position;}

            playhead.position = val;

            //send stop events for all active notes
                if(stopActive){
                    var events = [];
                    for(var a = 0; a < activeNotes.length; a++){
                        var tmp = noteRegistry.getNote(activeNotes[a]); if(tmp == null){continue;}
                        events.unshift( {noteID:activeNotes[a], line:tmp.line, position:loop.period.start, strength:0} );
                    }
                    activeNotes = [];
                    if(obj.event && events.length > 0){obj.event(events);}
                }

            //reposition graphical playhead
                if(playhead.position < 0 || playhead.position > xCount){
                    //outside vilible bounds, so remove
                    if( workarea.children.playhead ){ workarea.children.playhead.remove(); }
                }else{ 
                    //within vilible bounds, so either create or adjust
                    if( !workarea.children.playhead ){ makePlayhead(); }
                    __globals.utility.element.setTransform_XYonly(workarea.children.playhead, playhead.position*(totalSize.width/xCount), 0);
                    //if the new position is beyond the view in the viewport, adjust the viewport (putting the playhead on the leftmost side)
                    //(assuming automoveViewposition is set)
                    if(playhead.automoveViewposition){
                        var remainderSpace = xCount-(xCount*zoomLevel_x);
                        if( playhead.position < Math.floor(viewposition.x*remainderSpace)   || 
                            playhead.position > Math.floor(viewposition.x*remainderSpace) + (xCount*zoomLevel_x)  
                        ){ obj.viewposition( (playhead.position > remainderSpace ? remainderSpace : playhead.position)/remainderSpace ); }
                    }
                }
        };
        obj.progress = function(){
            //if the playhead is being held, just bail completly
                if(playhead.held){return;}
                
            //if there's no playhead; create one and set its position to 0
                if(playhead.position < 0){makePlayhead(); playhead.position = 0; }

            //gather together all the current events
                var events = obj.eventsBetween(playhead.position, playhead.position+step);

            //upon loop; any notes that are still active are to be ended
            //(so create end events for them, and push those into the current events list)
                if(loop.active && playhead.position == loop.period.start){
                    for(var a = 0; a < activeNotes.length; a++){
                        var tmp = noteRegistry.getNote(activeNotes[a]); if(tmp == null){continue;}
                        events.unshift( {noteID:activeNotes[a], line:tmp.line, position:loop.period.start, strength:0} );
                    }
                    activeNotes = [];
                }

            //add newly started notes to - and remove newly finished notes from - 'activeNotes'
                for(var a = 0; a < events.length; a++){
                    var index = activeNotes.indexOf(events[a].noteID);
                    if(index != -1 && events[a].strength == 0){
                        activeNotes.splice(index);
                    }else{
                        if( events[a].strength > 0 ){
                            activeNotes.push(events[a].noteID);
                        }
                    }
                }

            //progress position
                if( loop.active && (playhead.position+step == loop.period.end) ){
                    playhead.position = loop.period.start;
                }else{
                    playhead.position = playhead.position+step;
                }

            //update graphical playhead
                obj.playheadPosition(playhead.position,false);

            //perform event callback
                if(obj.event && events.length > 0){obj.event(events);}
        };
        
    //callbacks
        obj.onpan = function(data){};
        obj.onchangeviewarea = function(data){};
        obj.event = function(events){};

    return obj;
};
















svg_sequencer.noteBlock = function(
    id, unit_x, unit_y,
    line, position, length, strength=1, glow=false, 
    bodyStyle=[
        'fill:rgba(138,138,138,0.6);stroke:rgba(175,175,175,0.8);stroke-width:0.5;',
        'fill:rgba(130,199,208,0.6);stroke:rgba(130,199,208,0.8);stroke-width:0.5;',
        'fill:rgba(129,209,173,0.6);stroke:rgba(129,209,173,0.8);stroke-width:0.5;',
        'fill:rgba(234,238,110,0.6);stroke:rgba(234,238,110,0.8);stroke-width:0.5;',
        'fill:rgba(249,178,103,0.6);stroke:rgba(249,178,103,0.8);stroke-width:0.5;',
        'fill:rgba(255, 69, 69,0.6);stroke:rgba(255, 69, 69,0.8);stroke-width:0.5;',
    ],
    bodyGlowStyle=[
        'fill:rgba(138,138,138,0.8);stroke:rgba(175,175,175,1);stroke-width:0.5;',
        'fill:rgba(130,199,208,0.8);stroke:rgba(130,199,208,1);stroke-width:0.5;',
        'fill:rgba(129,209,173,0.8);stroke:rgba(129,209,173,1);stroke-width:0.5;',
        'fill:rgba(234,238,110,0.8);stroke:rgba(234,238,110,1);stroke-width:0.5;',
        'fill:rgba(249,178,103,0.8);stroke:rgba(249,178,103,1);stroke-width:0.5;',
        'fill:rgba(255, 69, 69,0.8);stroke:rgba(255, 69, 69,1);stroke-width:0.5;',
    ],
    handleStyle='fill:rgba(255,0,255,0);cursor:col-resize;',
    handleWidth=5,
){
    var selected = false;
    var minLength = handleWidth/4;
    var currentStyles = {
        body:getBlendedColour(bodyStyle,strength),
        glow:getBlendedColour(bodyGlowStyle,strength),
    };
    
    //elements
        var obj = __globals.utility.misc.elementMaker('g',id,{y:line*unit_y, x:position*unit_x});
        obj.body = __globals.utility.misc.elementMaker('rect','body',{width:length*unit_x, height:unit_y, style:currentStyles.body});
        obj.leftHandle = __globals.utility.misc.elementMaker('rect','leftHandle',{x:-handleWidth/2, width:handleWidth, height:unit_y,style:handleStyle});
        obj.rightHandle = __globals.utility.misc.elementMaker('rect','rightHandle',{x:length*unit_x-handleWidth/2, width:handleWidth, height:unit_y, style:handleStyle});
        obj.append(obj.body);
        obj.append(obj.leftHandle);
        obj.append(obj.rightHandle);

    //internal functions
        function updateHeight(){
            obj.body.height.baseVal.value = unit_y;
            obj.leftHandle.height.baseVal.value = unit_y;
            obj.rightHandle.height.baseVal.value = unit_y;
        }
        function updateLength(){
            obj.body.width.baseVal.value = length*unit_x;
            __globals.utility.element.setTransform_XYonly(obj.rightHandle, length*unit_x-handleWidth/2, 0);
        }
        function updateLineAndPosition(){ __globals.utility.element.setTransform_XYonly(obj, position*unit_x, line*unit_y); }
        function updateLine(){ __globals.utility.element.setTransform_XYonly(obj, undefined, line*unit_y); }
        function updatePosition(){ __globals.utility.element.setTransform_XYonly(obj, position*unit_x, undefined); }
        function getBlendedColour(swatch,ratio){
            //extract stlyes and get an output template
                var tempSwatch = [];
                for(var a = 0; a < swatch.length; a++){
                    tempSwatch[a] = __globals.utility.element.styleExtractor(swatch[a]);
                }
                var outputStyle = tempSwatch[0];

            //if there's a fill attribute; blend it and add it to the template
                if( tempSwatch[0].hasOwnProperty('fill') ){
                    outputStyle.fill = __globals.utility.misc.multiBlendColours(tempSwatch.map(a => a.fill),ratio);
                }

            //if there's a stroke attribute; blend it and add it to the template
                if( tempSwatch[0].hasOwnProperty('stroke') ){
                    outputStyle.stroke = __globals.utility.misc.multiBlendColours(tempSwatch.map(a => a.stroke),ratio);
                }

            //pack up the template and return
                return __globals.utility.element.stylePacker(outputStyle);
        }

    //controls
        obj.unit = function(x,y){
            if(x == undefined && y == undefined){return {x:unit_x,y:unit_y};}
            //(awkard bid for speed)
            else if( x == undefined ){
                unit_y = y;
                updateHeight();
                updateLine();
            }else if( y == undefined ){
                unit_x = x;
                updateLength();
                updatePosition();
            }else{
                unit_x = x;
                unit_y = y;
                updateHeight();
                updateLength();
                updateLineAndPosition();
            }
        };
        obj.line = function(a){
            if(a == undefined){return line;}
            line = a;
            updateLine();
        };
        obj.position = function(a){
            if(a == undefined){return position;}
            position = a;
            updatePosition();
        };
        obj.length = function(a){
            if(a == undefined){return length;}
            length = a < (minLength/unit_x) ? (minLength/unit_x) : a;
            updateLength();
        };
        obj.strength = function(a){
            if(a == undefined){return strength;}
            a = a > 1 ? 1 : a; a = a < 0 ? 0 : a;
            strength = a;
            currentStyles = {
                body:getBlendedColour(bodyStyle,strength),
                glow:getBlendedColour(bodyGlowStyle,strength),
            };
            obj.glow(glow);
        };
        obj.glow = function(a){
            if(a == undefined){return glow;}
            glow = a;
            if(glow){ __globals.utility.element.setStyle(obj.body, currentStyles.glow); }
            else{     __globals.utility.element.setStyle(obj.body, currentStyles.body); }
        };
        obj.selected = function(a){
            if(a == undefined){return selected;}
            selected = a;
        };

    return obj;
};