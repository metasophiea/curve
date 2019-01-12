this.basicSequencer = function(x,y,a){
    var vals = {
        sequencer:{
            width:64, height:10,
        }
    };

    var style = {
        background:{fill:'rgba(200,200,200,1)'},
        markings: {
            fill:{fill:'rgba(150,150,150,1)'},
            stroke:{stroke:'rgba(150,150,150,1)', lineWidth:1}, 
        },
        rangeslide:{
            handle:'rgba(240,240,240,1)',
            backing:'rgba(150,150,150,1)',
            slot:'rgba(50,50,50,1)',
            invisibleHandle:'rgba(0,0,0,0)',
            span:'rgba(220,220,220,1)',
        },
        rangeslide_loop:{
            handle:'rgba(240,240,240,1)',
            backing:'rgba(150,150,150,1)',
            slot:'rgba(50,50,50,1)',
            span:'rgba(255,247,145,0.5)',
        },
        button:{
            background__up__fill:'rgba(220,220,220,1)', 
            background__hover__fill:'rgba(240,240,240,1)', 
            background__hover_press__fill:'rgba(180,180,180,1)',
        },
        checkbox:{
            backing:'rgba(229, 229, 229,1)',
            check:'rgba(252,252,252,1)',
        },
        checkbox_loop:{
            backing:'rgba(229, 221, 112,1)',
            check:'rgba(252,244,128,1)',
        },
    };

    var design = {
        name: 'basicSequencer',
        category:'sequencers',
        collection: 'alpha',
        x:x, y:y, a:a,
        space:[{x:0,y:0}, {x:800,y:0}, {x:800,y:210}, {x:140,y:210}, {x:115,y:225}, {x:0,y:225}],
        // spaceOutline:true,
        elements:[
            {type:'polygon', name:'backing', data:{ points:[{x:0,y:0}, {x:800,y:0}, {x:800,y:210}, {x:140,y:210}, {x:115,y:225}, {x:0,y:225}], style:style.background }},

            //main sequencer
                {type:'sequencer', name:'main', data:{ x:10, y:20, width:780, height:170, xCount:vals.sequencer.width, yCount:vals.sequencer.height,
                    event:function(event){
                        for(var a = 0; a < event.length; a++){
                            object.elements.connectionNode_data['output_'+event[a].line].send('hit',{velocity:event[a].strength});
                        }
                    },
                    onchangeviewarea:function(data){ object.elements.rangeslide.viewselect.set( {start:data.left, end:data.right}, false ); },
                }},
                {type:'rangeslide', name:'viewselect', data:{ x:10, y:20, height:780, width:10, angle:-Math.PI/2, handleHeight:1/64, spanWidth:1, style:style.rangeslide }},    

            //follow playhead
                {type:'checkbox_rect', name:'followPlayhead',data:{ x:100, y:205, width:15, height:15, style:style.checkbox,
                    onchange:function(value){object.elements.sequencer.main.automove(value);},
                }},

            //loop control
                {type:'checkbox_rect', name:'loopActive',data:{ x:70, y:205, width:25, height:15, style:style.checkbox_loop,
                    onchange:function(value){object.elements.sequencer.main.loopActive(value);},
                }},
                {type:'rangeslide', name:'loopSelect', data:{ x:10, y:200, height: 780, width: 10, angle:-Math.PI/2, handleHeight:1/64, spanWidth:0.75, style:style.rangeslide_loop }},    

            //progression
                {type:'connectionNode_data', name:'progress_input', data:{ x: 800, y: 5, width: 5, height: 20,
                    onreceive:function(){object.elements.sequencer.main.progress();},
                }},
                {type:'button_rect', name:'progress_button', data:{ x:10, y:205, width:25, height:15, style:style.button,
                    onpress:function(){object.elements.sequencer.main.progress();},
                }},
                {type:'path', name:'progress_arrow', data:{ points:[{x:20, y:209},{x:25,y:212.5},{x:20, y:216}], style:style.markings.stroke }},

            //reset
                {type:'connectionNode_data', name:'reset_input', data:{ x: 800, y: 30, width: 5, height: 20,
                    onreceive:function(){object.elements.sequencer.main.playheadPosition(0);},
                }},
                {type:'button_rect', name:'reset_button', data:{ x:40, y:205, width:25, height:15, style:style.button,
                    onpress:function(){object.elements.sequencer.main.playheadPosition(0);},
                }},
                {type:'path', name:'reset_arrow', data:{ points:[{x:55, y:209},{x:50,y:212.5},{x:55, y:216}], style:style.markings.stroke }},
                {type:'path', name:'reset_line', data:{ points:[{x:49, y:209},{x:49, y:216}], style:style.markings.stroke }},
        ]
    };
    //dynamic design
        for(var a = 0; a < vals.sequencer.height; a++){
            design.elements.push(
                {type:'connectionNode_data', name:'output_'+a, data:{ 
                    x: -5, y: 11+a*(180/vals.sequencer.height), width: 5, height:(180/vals.sequencer.height)-2,
                    onreceive:function(){object.elements.sequencer.main.playheadPosition(0);},
                }},
            );
        }


    //main object
        var object = alphaUnit.builder(this.basicSequencer,design);

    //wiring
        object.elements.rangeslide.viewselect.onchange = function(values){ 
            object.elements.sequencer.main.viewarea({topLeft:{x:values.start, y:0}, bottomRight:{x:values.end, y:1}},false); 
        };
        object.elements.rangeslide.loopSelect.onchange = function(values){ 
            var a = Math.round(values.start*vals.sequencer.width);
            var b = Math.round(values.end*vals.sequencer.width);
            if(b == 0){b = 1;}
            object.elements.sequencer.main.loopPeriod(a,b);
        };

    //import/export
        object.exportData = function(){
            return {
                loop:{
                    active: object.elements.checkbox_rect.loopActive.get(),
                    range: object.elements.rangeslide.loopSelect.get(),
                },
                autofollow: object.elements.checkbox_rect.followPlayhead.get(),
                notes: object.elements.sequencer.main.getAllSignals(),
                viewarea:{
                    horizontal: object.elements.rangeslide.viewselect.get(),
                }
            };
        };
        object.importData = function(data){
            object.elements.sequencer.main.addSignals(data.notes);
            object.i.loopActive(data.loop.active);
            object.elements.rangeslide.loopSelect.set(data.loop.range);
            object.elements.checkbox_rect.followPlayhead.set(data.autofollow);
            object.elements.rangeslide.viewselect.set(data.viewarea.horizontal);
        };

    //interface
        object.i = {
            addNote:function(line, position, length, strength=1){object.elements.sequencer.main.addSignal(line, position, length, strength);},
            addNotes:function(data){object.elements.sequencer.main.addSignal(data);},
            getNotes:function(){return object.elements.sequencer.main.getAllSignals();},
            loopActive:function(a){object.elements.checkbox_rect.loopActive.set(a);},
            step: object.elements.sequencer.step,
        };

    return object;
};

this.basicSequencer.metadata = {
    name:'Basic Sequencer (Multi Pulse Out)',
    helpURL:'https://metasophiea.com/curve/help/units/alpha/basicSequencer_pulseOut/'
};