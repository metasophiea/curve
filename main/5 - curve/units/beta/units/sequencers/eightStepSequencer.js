this.eightStepSequencer = function(x,y,a){
    var width = 1670; var height = 590;
    var div = 6;
    var shape = [
        {x:0,y:0},
        {x:width/div -20/div,y:0},
        {x:width/div -20/div,y:(height/div)*(5.5/9.5) -10/div},
        {x:(width/div)*(26/27.5) -20/div,y:(height/div)*(5.5/9.5) -10/div},
        {x:(width/div)*(24.5/27.5) -20/div,y:(height/div)*(7/9.5) -10/div},
        {x:(width/div)*(24.5/27.5) -20/div,y:(height/div)*(9.5/9.5) -20/div},
        {x:0,y:height/div -20/div},
    ];
    var colours = [
        {r:1,g:0.01,b:0.02,a:1},
        {r:1,g:0.55,b:0,a:1},
        {r:1,g:0.93,b:0,a:1},
        {r:0,g:1,b:0,a:1},
        {r:0,g:1,b:0.81,a:1},
        {r:0,g:0.62,b:1,a:1},
        {r:0.08,g:0,b:1,a:1},
        {r:0.68,g:0,b:1,a:1}, 
    ];
    var design = {
        name:'eightStepSequencer',
        x:x, y:y, angle:a,
        space:shape,
        elements:[
            {collection:'dynamic', type:'connectionNode_data', name:'output', data:{ 
                x:0, y:30, width:5, height:15, angle:Math.PI, cableVersion:2,
                style:{ 
                    dim:style.connectionNode.data.dim, 
                    glow:style.connectionNode.data.glow, 
                    cable_dim:style.connectionCable.data.dim, 
                    cable_glow:style.connectionCable.data.glow 
                }
            }},
            {collection:'dynamic', type:'connectionNode_signal', name:'directionChange_step', data:{ 
                x:width/div-0.5 -20/div, y:10, width:5, height:10, cableVersion:2,
                style:{ 
                    dim:style.connectionNode.signal.dim, 
                    glow:style.connectionNode.signal.glow,
                    cable_dim:style.connectionCable.signal.dim,
                    cable_glow:style.connectionCable.signal.glow,
                },
                onchange:function(value){if(!value){return} object.elements.button_image.button_step.press(); object.elements.button_image.button_step.release(); } 
            }},
            {collection:'dynamic', type:'connectionNode_signal', name:'directionChange_forwards', data:{ 
                x:width/div-0.5 -20/div, y:22, width:5, height:10, cableVersion:2,
                style:{ 
                    dim:style.connectionNode.signal.dim, 
                    glow:style.connectionNode.signal.glow,
                    cable_dim:style.connectionCable.signal.dim,
                    cable_glow:style.connectionCable.signal.glow,
                },
                onchange:function(value){if(!value){return} object.elements.slide_discrete_image.slide_direction.set(1); } 
            }},
            {collection:'dynamic', type:'connectionNode_signal', name:'directionChange_backwards', data:{ 
                x:width/div-0.5 -20/div, y:33, width:5, height:10, cableVersion:2,
                style:{ 
                    dim:style.connectionNode.signal.dim, 
                    glow:style.connectionNode.signal.glow,
                    cable_dim:style.connectionCable.signal.dim,
                    cable_glow:style.connectionCable.signal.glow,
                },
                onchange:function(value){if(!value){return} object.elements.slide_discrete_image.slide_direction.set(0); } 
            }},




            {collection:'basic', type:'image', name:'backing', 
                data:{ x:-10/div, y:-10/div, width:width/div, height:height/div, url:'protoTypeUnits/beta/2/eightStepSequencer/eightStepSequencer_backing.png' }
            },

            {collection:'control', type:'button_image', name:'button_step', data:{
                x:243.25, y:4.5, width:21, height:21, hoverable:false, 
                backingURL__up:'protoTypeUnits/beta/2/eightStepSequencer/eightStepSequencer_stepButton_up.png',
                backingURL__press:'protoTypeUnits/beta/2/eightStepSequencer/eightStepSequencer_stepButton_down.png',
                onpress:step,
            }},
            {collection:'control', type:'slide_discrete_image',name:'slide_direction',data:{
                x:244, y:37.125, width:9.25, height:19.4, handleHeight:1/2, value:0, resetValue:0.5, angle:-Math.PI/2, optionCount:2, value:1,
                handleURL:'protoTypeUnits/beta/2/eightStepSequencer/eightStepSequencer_directionSlideHandle.png',
                onchange:function(value){ state.direction = value*2 - 1; }
            }},
        ]
    };
    //dynamic design
    for(var a = 0; a < 8; a++){
        design.elements.unshift(
            {collection:'dynamic', type:'connectionNode_signal', name:'noteOctaveChange_back_'+a, data:{ 
                x:7 +30*a, y:0, width:5, height:10, angle:Math.PI*1.5, cableVersion:2,
                style:{ 
                    dim:style.connectionNode.signal.dim, 
                    glow:style.connectionNode.signal.glow,
                    cable_dim:style.connectionCable.signal.dim,
                    cable_glow:style.connectionCable.signal.glow,
                },
                onchange:function(a){return function(value){
                    if(!value){return} 

                    var newNote = state.stages[a].note - 1;
                    var newOctave = state.stages[a].octave;
                    if(newNote < 0){ newNote = 11; newOctave--; }
                    if(newOctave < -1){ return; }

                    object.elements.dial_colourWithIndent_discrete['dial_noteSelect_'+a].set(newNote);
                    object.elements.slide_discrete_image['slide_octave_'+a].set(newOctave+1);
                } }(a),
            }}
        );
        design.elements.unshift(
            {collection:'dynamic', type:'connectionNode_signal', name:'noteOctaveChange_fore_'+a, data:{ 
                x:18 +30*a, y:0, width:5, height:10, angle:Math.PI*1.5, cableVersion:2,
                style:{ 
                    dim:style.connectionNode.signal.dim, 
                    glow:style.connectionNode.signal.glow,
                    cable_dim:style.connectionCable.signal.dim,
                    cable_glow:style.connectionCable.signal.glow,
                },
                onchange:function(a){return function(value){
                    if(!value){return}

                    var newNote = state.stages[a].note + 1;
                    var newOctave = state.stages[a].octave;
                    if(newNote > 11){ newNote = 0; newOctave++; }
                    if(newOctave > 1){ return; }

                    object.elements.dial_colourWithIndent_discrete['dial_noteSelect_'+a].set(newNote);
                    object.elements.slide_discrete_image['slide_octave_'+a].set(newOctave+1);
                } }(a),
            }}
        );

        design.elements.push(
            {collection:'display', type:'glowbox_rect',name:'LED'+a,data:{
                x:12.5 +30*a, y:2.5, width:10, height:2.5, 
                style:{
                    glow:{r:232/255, g:160/255, b:111/255, a:1},
                    dim:{r:164/255, g:80/255, b:61/255, a:1},
                }
            }}
        );
        design.elements.push(
            {collection:'control', type:'dial_colourWithIndent_discrete',name:'dial_noteSelect_'+a,data:{
                x:17.5 +30*a, y:22.5, radius:(150/6)/2, startAngle:(2.9*Math.PI)/4, maxAngle:1.55*Math.PI, optionCount:12, arcDistance:1.2, resetValue:0.5,
                style:{ handle:colours[a], slot:{r:0,g:0,b:0,a:0}, needle:{r:1,g:1,b:1,a:1} },
                onchange:function(a){return function(value){state.stages[a].note=value}}(a),
            }}
        );
        design.elements.push(
            {collection:'control', type:'slide_discrete_image',name:'slide_octave_'+a,data:{
                x:5.6 +30*a, y:47.25, width:9.5, height:23.75, handleHeight:1/2.5, value:0, resetValue:0.5, angle:-Math.PI/2, optionCount:3, value:1,
                handleURL:'protoTypeUnits/beta/2/eightStepSequencer/eightStepSequencer_octaveSlideHandle_'+a+'.png',
                onchange:function(a){return function(value){state.stages[a].octave=value-1}}(a),
            }}
        );
        design.elements.push(
            {collection:'control', type:'dial_colourWithIndent_continuous',name:'dial_velocity_'+a,data:{
                x:17.5 +30*a, y:57.5, radius:(75/6)/2, startAngle:(3*Math.PI)/4, maxAngle:1.5*Math.PI, value:0, arcDistance:1.2, resetValue:0.5,
                style:{ handle:colours[a], slot:{r:0,g:0,b:0,a:0}, needle:{r:1,g:1,b:1,a:1} },
                onchange:function(a){return function(value){state.stages[a].velocity=value}}(a),
            }}
        );
        design.elements.push(
            {collection:'control', type:'button_rectangle', name:'button_activate_'+a, data:{
                x:17.5 +30*a, y:68.5, width:16, height:16, angle:Math.PI/4,
                style:{
                    background__up__colour:{r:175/255,g:175/255,b:175/255,a:1},
                    background__hover__colour:{r:200/255,g:200/255,b:200/255,a:1}
                },
                onpress:function(a){return function(){state.requestedNextPosition=a;step();}}(a),
            }}
        );

        design.elements.unshift(
            {collection:'dynamic', type:'connectionNode_signal', name:'activate_'+a, data:{ 
                x:7 +30*a, y:height/div -20/div + 5, width:5, height:10, angle:-Math.PI*0.5, cableVersion:2,
                style:{ 
                    dim:style.connectionNode.signal.dim, 
                    glow:style.connectionNode.signal.glow,
                    cable_dim:style.connectionCable.signal.dim,
                    cable_glow:style.connectionCable.signal.glow,
                },
                onchange:function(a){ return function(value){ if(!value){return} object.elements.button_rectangle['button_activate_'+a].press(); object.elements.button_rectangle['button_activate_'+a].release(); } }(a),
            }}
        );
        design.elements.unshift(
            {collection:'dynamic', type:'connectionNode_voltage', name:'velocity_'+a, data:{ 
                x:18 +30*a, y:height/div -20/div + 5, width:5, height:10, angle:-Math.PI*0.5, cableVersion:2,
                style:{ 
                    dim:style.connectionNode.voltage.dim, 
                    glow:style.connectionNode.voltage.glow,
                    cable_dim:style.connectionCable.voltage.dim,
                    cable_glow:style.connectionCable.voltage.glow,
                },
                onchange:function(a){ return function(value){ object.elements.dial_colourWithIndent_continuous['dial_velocity_'+a].set(value) }}(a),
            }}
        );
    }

    
    //main object
        var object = _canvas_.interface.unit.builder(this.ruler,design);

    //internal circuitry
        var state = {
            direction:1,
            previousPosition:-1,
            requestedNextPosition:-1,
            position:-1,
            stages:[
                { note:0, octave:0, velocity:0 },
                { note:0, octave:0, velocity:0 },
                { note:0, octave:0, velocity:0 },
                { note:0, octave:0, velocity:0 },
                { note:0, octave:0, velocity:0 },
                { note:0, octave:0, velocity:0 },
                { note:0, octave:0, velocity:0 },
                { note:0, octave:0, velocity:0 },
            ],
            previousMidiNumber:-1,
        }

        function step(){
            state.previousPosition=state.position;
            if( state.requestedNextPosition != -1 ){
                state.position = state.requestedNextPosition;
                state.requestedNextPosition = -1;
            }else{
                state.position = state.position+state.direction;
            }
            if(state.position > 7){state.position = 0;}
            else if(state.position < 0){state.position = 7;}

            var midiNumber = stageToMidiNoteNumber(state.stages[state.position]);
            object.elements.connectionNode_data.output.send('midinumber',{num:state.previousMidiNumber, velocity:0});
            object.elements.connectionNode_data.output.send('midinumber',{num:midiNumber, velocity:state.stages[state.position].velocity});
            state.previousMidiNumber = midiNumber

            if(state.previousPosition != -1){ object.elements.glowbox_rect['LED'+state.previousPosition].off(); }
            object.elements.glowbox_rect['LED'+state.position].on(); 
        }
        function stageToMidiNoteNumber(stage){
            var octaveOffset = 4;
            var note = ['C','C#','D','D#','E','F','F#','G','G#','A','A#','B'][stage.note];
            var octave = stage.octave+octaveOffset;
            return _canvas_.library.audio.name2num(octave+note);
        }
    
    //interface
        object.i = {
            step:function(){ object.elements.button_image.button_step.press(); },
            direction:function(value){ object.elements.slide_discrete_image.slide_direction.set(value); },
            noteDial:function(number,value){ object.elements.dial_colourWithIndent_discrete['dial_noteSelect_'+number].set(value); },
            octaveSlider:function(number,value){ object.elements.slide_discrete_image['slide_octave_'+number].set(value); },
            velocityDial:function(number,value){ object.elements.dial_colourWithIndent_continuous['dial_velocity_'+number].set(value); },
            activateStep:function(number){ object.elements.button_rectangle['button_activate_'+number].press(); },
        };

    return object;
};



this.eightStepSequencer.metadata = {
    name:'Eight Step Sequencer',
    category:'sequencers',
    helpURL:'https://curve.metasophiea.com/help/units/beta/eightStepSequencer/'
};