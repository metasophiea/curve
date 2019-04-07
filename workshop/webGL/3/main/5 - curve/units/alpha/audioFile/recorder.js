this.recorder = function(x,y,a){
    var style = {
        background:{r:200/255,g:200/255,b:200/255,a:1},
        h1:{colour:{r:0/255,g:0/255,b:0/255,a:1}, size:4, ratio:1, font:'Courier New', printingMode:{widthCalculation:'absolute',horizontal:'middle',vertical:'middle'}},
        h2:{colour:{r:0/255,g:0/255,b:0/255,a:1}, size:3, ratio:1.5, font:'Courier New', printingMode:{widthCalculation:'absolute',horizontal:'middle',vertical:'middle'}},
        button:{
            background__up__colour:{r:175/255,g:175/255,b:175/255,a:1}, 
            background__hover__colour:{r:220/255,g:220/255,b:220/255,a:1}, 
            background__hover_press__colour:{r:150/255,g:150/255,b:150/255,a:1},
        },
    };
    var design = {
        name: 'recorder',
        category: 'audioFile',
        collection: 'alpha',
        x:x, y:y, a:a,
        space:[{x:0,y:0},{x:175,y:0},{x:175,y:40},{x:0,y:40}],
        // spaceOutline:true,
        elements:[
            {type:'polygon', name:'backing', data:{ pointsAsXYArray:[{x:0,y:0},{x:175,y:0},{x:175,y:40},{x:0,y:40}], colour:style.background }},

            {type:'connectionNode_audio', name:'inRight', data: {x:175, y:2.5, width:10, height:15}},
            {type:'connectionNode_audio', name:'inLeft', data: {x:175, y:22.5, width:10, height:15}},


            //logo label
                {type:'rectangle', name:'logo_rect', data:{x:135, y:27.5, angle:-0.25, width:35, height:10, colour:{r:230/255,g:230/255,b:230/255,a:1}}},
                {type:'text', name:'logo_label', data:{x:154, y:28, angle:-0.25, text:'REcorder', width:style.h1.size, height:style.h1.size*style.h1.ratio, colour:style.h1.colour, font:style.h1.font, printingMode:style.h1.printingMode}},

            //rec
                {type:'button_rectangle', name:'rec', data: {
                    x:5, y: 25, width:20, height:10, style:style.button,
                    onpress: function(){
                        if(state == 'paused'){object.recorder.resume();}
                        else{object.recorder.start();}
                        updateLights('rec');
                    }
                }},
                {type:'text', name:'button_rectangle_text', data:{x:15, y:30 - style.h2.size/4, text:'rec', angle:0, width:style.h2.size, height:style.h2.size*style.h2.ratio, colour:style.h2.colour, font:style.h2.font, printingMode:style.h2.printingMode}},
            //pause/resume
                {type:'button_rectangle', name:'pause/resume', data: {
                    x:27.5, y: 25, width:20, height:10, style:style.button,
                    onpress: function(){
                        if(state == 'paused'){object.recorder.resume();}
                        else{object.recorder.pause();}
                        updateLights('pause/resume');
                    }
                }},
                {type:'text', name:'button_pause/resume_text', data:{x:37.7, y:30 - style.h2.size/4, text:'pause', angle:0, width:style.h2.size, height:style.h2.size*style.h2.ratio, colour:style.h2.colour, font:style.h2.font, printingMode:style.h2.printingMode}},
            //stop
                {type:'button_rectangle', name:'stop', data: {
                    x:50, y: 25, width:20, height:10, style:style.button,
                    onpress: function(){updateLights('stop');object.recorder.stop();}
                }},
                {type:'text', name:'button_stop_text', data:{x:60, y:30 - style.h2.size/4, text:'stop', angle:0, width:style.h2.size, height:style.h2.size*style.h2.ratio, colour:style.h2.colour, font:style.h2.font, printingMode:style.h2.printingMode}},
            //save
                {type:'button_rectangle', name:'save', data: {
                    x:72.5, y: 25, width:20, height:10, style:style.button,
                    onpress: function(){
                        updateLights('save');
                        if(state != 'empty'){ object.recorder.save(); }
                    }
                }},
                {type:'text', name:'button_save_text', data:{x:82.5, y:30 - style.h2.size/4, text:'save', angle:0, width:style.h2.size, height:style.h2.size*style.h2.ratio, colour:style.h2.colour, font:style.h2.font, printingMode:style.h2.printingMode}},
            //clear
                {type:'button_rectangle', name:'clear', data: {
                    x:95, y: 25, width:20, height:10, style:style.button,
                    onpress: function(){updateLights('clear');object.recorder.clear();}
                }},
                {type:'text', name:'button_clear_text', data:{x:105, y:30 - style.h2.size/4, text:'clear', angle:0, width:style.h2.size, height:style.h2.size*style.h2.ratio, colour:style.h2.colour, font:style.h2.font, printingMode:style.h2.printingMode}},

            //time readout
                {type:'readout_sixteenSegmentDisplay_static', name:'time', data:{ x: 70, y: 5, angle:0, width:100, height:15, count:11 }},

            //activity lights
                //recording
                    {type:'glowbox_rect', name:'activityLight_recording', data:{x:5, y:5, width:15, height:15, style:{glow:{r:255/255,g:63/255,b:63/255,a:1}, dim:{r:25/255,g:6/255,b:6/255,a:1}}}},
                    {type:'text', name:'activityLight_recording_text', data:{x:12.5, y:12.5 - style.h2.size/4, text:'rec', angle:0, width:style.h2.size, height:style.h2.size*style.h2.ratio, colour:style.h2.colour, font:style.h2.font, printingMode:style.h2.printingMode}},
                //paused
                    {type:'glowbox_rect', name:'activityLight_paused', data:{x:20, y:5, width:15, height:15, style:{glow:{r:126/255,g:186/255,b:247/255,a:1}, dim:{r:12/255,g:18/255,b:24/255,a:1}}}},
                    {type:'text', name:'activityLight_paused_text', data:{x:27.5, y:12.5 - style.h2.size/4, text:'pau', angle:0, width:style.h2.size, height:style.h2.size*style.h2.ratio, colour:style.h2.colour, font:style.h2.font, printingMode:style.h2.printingMode}},
                //empty
                    {type:'glowbox_rect', name:'activityLight_empty', data:{x:35, y:5, width:15, height:15, style:{glow:{r:199/255,g:249/255,b:244/255,a:1}, dim:{r:19/255,g:24/255,b:24/255,a:1}}}},
                    {type:'text', name:'activityLight_empty_text', data:{x:42.5, y:12.5 - style.h2.size/4, text:'emp', angle:0, width:style.h2.size, height:style.h2.size*style.h2.ratio, colour:style.h2.colour, font:style.h2.font, printingMode:style.h2.printingMode}},
                //ready to save
                    {type:'glowbox_rect', name:'activityLight_full', data:{x:50, y:5, width:15, height:15, style:{glow:{r:61/255,g:224/255,b:35/255,a:1}, dim:{r:6/255,g:22/255,b:3/255,a:1}}}},
                    {type:'text', name:'activityLight_full_text', data:{x:57.5, y:12.5 - style.h2.size/4, text:'ful', angle:0, width:style.h2.size, height:style.h2.size*style.h2.ratio, colour:style.h2.colour, font:style.h2.font, printingMode:style.h2.printingMode}},
        ]
    };

    //main object
        var object = _canvas_.interface.unit.builder(this.recorder,design);

    //circuitry
        //update functions
            //time readout
                setInterval(function(){
                    var time = object.recorder.recordingTime();
                    var decimalValues = time % 1;
                    time = _canvas_.library.math.seconds2time( Math.round(time) );

                    object.elements.readout_sixteenSegmentDisplay_static.time.text(
                        _canvas_.library.misc.padString(time.h,2,'0')+':'+
                        _canvas_.library.misc.padString(time.m,2,'0')+':'+
                        _canvas_.library.misc.padString(time.s,2,'0')+'.'+
                        _canvas_.library.misc.padString((''+decimalValues).slice(2),2,'0')
                    );
                    object.elements.readout_sixteenSegmentDisplay_static.time.print();
                },100);
            //lights
                var state = 'empty'; //empty - recording - paused - full
                function updateLights(action){
                    if( state == 'empty' && (action == 'save' || action == 'stop') ){return;}
                    if( action == 'stop' || action == 'save' ){ state = 'full'; }
                    if( state == 'empty' && action == 'rec' ){ state = 'recording'; }
                    if( action == 'clear' ){ state = 'empty'; }
                    if( state == 'recording' && action == 'pause/resume' ){ state = 'paused'; }
                    else if( state == 'paused' && (action == 'pause/resume' || action == 'rec') ){ state = 'recording'; }

                    if(state == 'empty'){object.elements.glowbox_rect.activityLight_empty.on();}else{object.elements.glowbox_rect.activityLight_empty.off();}
                    if(state == 'recording'){object.elements.glowbox_rect.activityLight_recording.on();}else{object.elements.glowbox_rect.activityLight_recording.off();}
                    if(state == 'paused'){object.elements.glowbox_rect.activityLight_paused.on();}else{object.elements.glowbox_rect.activityLight_paused.off();}
                    if(state == 'full'){object.elements.glowbox_rect.activityLight_full.on();}else{object.elements.glowbox_rect.activityLight_full.off();}
                }
                updateLights('clear');
                object.elements.glowbox_rect.activityLight_empty.on();

        //audio recorder
            object.recorder = new _canvas_.interface.circuit.recorder(_canvas_.library.audio.context);
            object.elements.connectionNode_audio.inRight.out().connect( object.recorder.in_right() );
            object.elements.connectionNode_audio.inLeft.out().connect( object.recorder.in_left() );

    return object;
};

this.recorder.metadata = {
    name:'Recorder',
    category:'audioFile',
    helpURL:'https://curve.metasophiea.com/help/units/alpha/recorder/'
};