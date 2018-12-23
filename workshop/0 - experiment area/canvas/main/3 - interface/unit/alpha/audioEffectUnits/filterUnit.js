this.filterUnit = function(x,y){
    var state = {
        freqRange:{ low: 0.1, high: 20000, },
        graphDetail: 3,
    };
    var style = {
        background: {fill:'rgba(200,200,200,1)'},

        h1:{fill:'rgba(0,0,0,1)', font:'3pt Courier New'},
        h2:{fill:'rgba(0,0,0,1)', font:'2pt Courier New'},
        h3:{fill:'rgba(0,0,0,1)', font:'1.5pt Courier New'},
        
        dial:{
            handle:{fill:'rgba(220,220,220,1)'},
            slot:{fill:'rgba(50,50,50,1)'},
            needle:{fill:'rgba(250,150,150,1)'},
        },
        graph:{
            foregroundlines:[{stroke:'rgba(0,200,163,1)', lineWidth:0.5, lineJoin:'round'}],
            backgroundlines:{stroke:'rgba(0,200,163,0.25)', lineWidth:0.25},
            backgroundtext:{fill:'rgba(0,200,163,0.75)', font:'6pt Helvetica'},
        }
    };
    var design = {
        name: 'filterUnit',
        collection: 'alpha',
        x: x, y: y,
        space:[ {x:10,y:0}, {x:92.5,y:0}, {x:102.5,y:70}, {x:51.25,y:100}, {x:0,y:70} ],
        // spaceOutline:true,
        elements:[
            {type:'polygon', name:'backing', data:{ points:[{x:10,y:0}, {x:92.5,y:0}, {x:102.5,y:70}, {x:51.25,y:100}, {x:0,y:70}], style:style.background }},

            {type:'connectionNode_audio', name:'audioIn', data:{ x: 94.8, y: 16, width: 10, height: 20, angle:-0.14 }},
            {type:'connectionNode_audio', name:'audioOut', data:{ x: -2.3, y: 16, width: 10, height: 20, angle:0.144, isAudioOutput:true }},
        
            {type:'grapher_static', name:'graph', data:{x:15, y:5, width:72.5, height:50, resolution:5,
                style:{
                    foregrounds: style.graph.foregroundlines, 
                    background_stroke: style.graph.backgroundlines.stroke, 
                    background_lineWidth: style.graph.backgroundlines.lineWidth, 
                    backgroundText_fill: style.graph.backgroundtext.fill, 
                    backgroundText_font: style.graph.backgroundtext.font,
                }}
            },

            {type:'text', name:'Q_0',     data:{x:74, y: 76,   text:'0',   style:style.h2}},
            {type:'text', name:'Q_1/2',   data:{x:80, y: 59.5, text:'1/2', style:style.h2}},
            {type:'text', name:'Q_1',     data:{x:89, y: 76,   text:'1',   style:style.h2}},
            {type:'text', name:'Q_title', data:{x:81, y: 79,   text:'Q',   style:style.h1}},
            {type:'dial_continuous',name:'Q_dial',data:{
                x: 82.5, y: 68.5, r: 7, startAngle: (3*Math.PI)/4, maxAngle: 1.5*Math.PI,
                style:{handle:style.dial.handle.fill, slot:style.dial.slot.fill, needle:style.dial.needle.fill},
            }},

            {type:'text', name:'gain_0',     data:{x:54,    y: 86,   text:'0',    style:style.h2}},
            {type:'text', name:'gain_1/2',   data:{x:61.75, y: 68.5, text:'5',    style:style.h2}},
            {type:'text', name:'gain_1',     data:{x:69,    y: 86,   text:'10',   style:style.h2}},
            {type:'text', name:'gain_title', data:{x:58,    y: 89,   text:'Gain', style:style.h1}},
            {type:'dial_continuous',name:'gain_dial',data:{
                x: 62.5, y: 77.5, r: 7, startAngle: (3*Math.PI)/4, maxAngle: 1.5*Math.PI,
                style:{handle:style.dial.handle.fill, slot:style.dial.slot.fill, needle:style.dial.needle.fill},
            }},
            
            {type:'text', name:'frequency_0',     data:{x:31.5, y: 86,   text:'0',     style:style.h2}},
            {type:'text', name:'frequency_100',   data:{x:37.5, y:68.5, text:'100',   style:style.h2}},
            {type:'text', name:'frequency_20000', data:{x:46.5, y: 86,   text:'20k', style:style.h2}},
            {type:'text', name:'frequency_title', data:{x:35.5, y:89,    text:'Freq',  style:style.h1}},
            {type:'dial_continuous',name:'frequency_dial',data:{
                x: 40, y: 77.5, r: 7, startAngle: (3*Math.PI)/4, maxAngle: 1.5*Math.PI, 
                style:{handle:style.dial.handle.fill, slot:style.dial.slot.fill, needle:style.dial.needle.fill},
            }},

            {type:'text', name:'type_lowp',  data:{x:9,     y: 74.5, text:'lowp', style:style.h3}},
            {type:'text', name:'type_highp', data:{x:6,     y: 69,   text:'highp',style:style.h3}},
            {type:'text', name:'type_band',  data:{x:8,     y: 63,   text:'band', style:style.h3}},
            {type:'text', name:'type_lows',  data:{x:14,    y: 59,   text:'lows', style:style.h3}},
            {type:'text', name:'type_highs', data:{x:22.5,  y: 59.5, text:'highs',style:style.h3}},
            {type:'text', name:'type_peak',  data:{x:27.5,  y: 63,   text:'peak', style:style.h3}},
            {type:'text', name:'type_notch', data:{x:29,    y: 69,   text:'notch',style:style.h3}},
            {type:'text', name:'type_all',   data:{x:25.5,  y: 74.5, text:'all',  style:style.h3}},
            {type:'text', name:'type_title', data:{x:15.5,  y:78.5,  text:'Type', style:style.h1}},
            {type:'dial_discrete',name:'type_dial',data:{
                x: 20, y: 67.5, r: 7, startAngle: (3*Math.PI)/4, maxAngle: 1.5*Math.PI, optionCount: 8,
                style:{handle:style.dial.handle.fill, slot:style.dial.slot.fill, needle:style.dial.needle.fill},
            }},
        ]
    };

    //main object
        var object = interfaceUnit.builder(this.filterUnit,design);

    //import/export
        object.importData = function(data){
            object.elements.dial_continuous.Q_dial.set(data.Q);
            object.elements.dial_continuous.gain_dial.set(data.gain);
            object.elements.dial_discrete.type_dial.set(data.type);
            object.elements.dial_continuous.frequency_dial.set(data.frequency);
        };
        object.exportData = function(){
            return {
                Q:         object.elements.dial_continuous.Q_dial.get(), 
                gain:      object.elements.dial_continuous.gain_dial.get(), 
                type:      object.elements.dial_discrete.type_dial.get(), 
                frequency: object.elements.dial_continuous.frequency_dial.get(), 
            };
        };

    //circuitry
        //filter
            object.filterCircuit = new interface.circuit.alpha.filterUnit(workspace.library.audio.context);
            object.elements.connectionNode_audio.audioIn.out().connect( object.filterCircuit.in() );
            object.filterCircuit.out().connect( object.elements.connectionNode_audio.audioOut.in() );

        //internal functions
            function getFrequencyAndLocationArray(){
                var locationArray = [];
                var frequencyArray = [];
                for(var a = 0; a <= Math.floor(Math.log10(state.freqRange.high))+1; a++){
                    for(var b = 1; b < 10; b+=1/Math.pow(2,state.graphDetail)){
                        if( Math.pow(10,a)*(b/10) >= state.freqRange.high){break;}
                        locationArray.push( Math.log10(Math.pow(10,a)*b) );
                        frequencyArray.push( Math.pow(10,a)*(b/10) );
                    }
                }
                return {frequency:frequencyArray, location:workspace.library.math.normalizeStretchArray(locationArray)};
            }
            function updateGraph(){
                var temp = getFrequencyAndLocationArray();
                object.elements.grapher_static.graph.draw( object.filterCircuit.measureFrequencyResponse_values(temp.frequency)[0], temp.location );
            };
        
        //wiring
            object.elements.dial_continuous.Q_dial.onchange = function(value){object.filterCircuit.Q(value*10);updateGraph();};
            object.elements.dial_continuous.gain_dial.onchange = function(value){object.filterCircuit.gain(value*10);updateGraph();};
            object.elements.dial_continuous.frequency_dial.onchange = function(value){object.filterCircuit.frequency( workspace.library.math.curvePoint.exponential(value,0,20000,10.5866095) );updateGraph();};
            object.elements.dial_discrete.type_dial.onchange = function(value){object.filterCircuit.type(['lowpass','highpass','bandpass','lowshelf','highshelf','peaking','notch','allpass'][value]);updateGraph();};

    //setup
        var arrays = getFrequencyAndLocationArray();
        arrays.frequency = arrays.frequency.filter(function(a,i){return i%Math.pow(2,state.graphDetail)==0;});
        arrays.location = arrays.location.filter(function(a,i){return i%Math.pow(2,state.graphDetail)==0;});
        object.elements.grapher_static.graph.viewbox({bottom: 0, top: 2, left: 0, right: 1});
        object.elements.grapher_static.graph.horizontalMarkings({points:[0.25,0.5,0.75,1,1.25,1.5,1.75],textPosition:{x:0.005,y:0.075},printText:true});
        object.elements.grapher_static.graph.verticalMarkings({
            points:arrays.location,
            printingValues:arrays.frequency.map(a => Math.log10(a)%1 == 0 ? a : '').slice(0,arrays.frequency.length-1).concat(''), //only print the factoirs of 10, leaving everything else as an empty string
            textPosition:{x:-0.0025,y:1.99},
            printText:true,
        });

        object.elements.dial_discrete.type_dial.set(0);
        object.elements.dial_continuous.Q_dial.set(0);
        object.elements.dial_continuous.gain_dial.set(0.1);
        object.elements.dial_continuous.frequency_dial.set(0.5);
        setTimeout(updateGraph,100);

    return object;
};

this.filterUnit.metadata = {
    name:'Filter Unit',
    helpURL:'https://metasophiea.com/curve/help/units/alpha/filterUnit/'
};
