// var multibandFilter_object = function(
//     id='multibandFilter_object',
//     x, y, width, height, angle,
// ){
//     var vars = {
//         freqRange:{ low: 0.1, high: 20000, },
//         graphDetail: 3, //factor of the number of points a graphed line is drawn with
//         channelCount: 8,
//         gain:[],
//         Q:[],
//         frequency:[],
//     };
//     var style = {
//         background: 'fill:rgba(200,200,200,1); stroke:none;',
//         h1: 'fill:rgba(0,0,0,1); font-size:6px; font-family:Courier New;',
//         h2: 'fill:rgba(0,0,0,1); font-size:4px; font-family:Courier New;',
//         h3: 'fill:rgba(0,0,0,1); font-size:2px; font-family:Courier New;',
//         panels:[
//             'fill:rgba(0,200,163,  0.25);  pointer-events:none;',
//             'fill:rgba(100,235,131,0.25); pointer-events:none;',
//             'fill:rgba(228,255,26, 0.25); pointer-events:none;',
//             'fill:rgba(232,170,20, 0.25); pointer-events:none;',
//             'fill:rgba(255,87,20,  0.25); pointer-events:none;',
//             'fill:rgba(0,191,255,  0.25); pointer-events:none;',
//             'fill:rgba(249,99,202, 0.25); pointer-events:none;',
//             'fill:rgba(255,255,255,0.25); pointer-events:none;',
//         ],

//         slide:{
//             handle:'fill:rgba(240,240,240,1)',
//             backing:'fill:rgba(150,150,150,0)',
//             slot:'fill:rgba(50,50,50,1)',
//         },
//         dial:{
//             handle: 'fill:rgba(220,220,220,1)',
//             slot: 'fill:rgba(50,50,50,1)',
//             needle: 'fill:rgba(250,150,150,1)',
//             arc: 'fill:none; stroke:rgb(150,150,150); stroke-width:1;',
//         },
//         graph:{
//             foregroundlines:[
//                 'stroke:rgba(0,200,163,1); stroke-width:0.5; stroke-linecap:round;',
//                 'stroke:rgba(100,235,131,1); stroke-width:0.5; stroke-linecap:round;',
//                 'stroke:rgba(228,255,26,1); stroke-width:0.5; stroke-linecap:round;',
//                 'stroke:rgba(232,170,20,1); stroke-width:0.5; stroke-linecap:round;',
//                 'stroke:rgba(255,87,20,1); stroke-width:0.5; stroke-linecap:round;',
//                 'stroke:rgba(0,191,255,1); stroke-width:0.5; stroke-linecap:round;',
//                 'stroke:rgba(249,99,202,1); stroke-width:0.5; stroke-linecap:round;',
//                 'stroke:rgba(255,255,255,1); stroke-width:0.5; stroke-linecap:round;',
//             ],
//             backgroundlines:'stroke:rgba(0,200,163,0.25); stroke-width:0.25;',
//             backgroundtext:'fill:rgba(0,200,163,0.75); font-size:1; font-family:Helvetica;',
//         }
//     };
//     var width = 195;
//     var height = 255;
//     var design = {
//         type: 'multibandFilterUnit',
//         x: x, y: y,
//         base: {
//             points:[
//                 { x:0,        y:10      }, { x:10,       y:0      },
//                 { x:width-10, y:0       }, { x:width,    y:10     },
//                 { x:width,    y:height-10  }, { x:width-10, y:height     },
//                 { x:10,       y:height     }, { x:0,        y:height-10  }
//             ], 
//             style:style.background
//         },
//         elements:[
//             {type:'connectionNode_audio', name:'audioIn_0', data:{type:0, x:195, y:15, width:10, height:20}},
//             {type:'connectionNode_audio', name:'audioIn_1', data:{type:0, x:195, y:40, width:10, height:20}},
//             {type:'connectionNode_audio', name:'audioOut_0', data:{type:1, x:-10, y:15, width:10, height:20}},
//             {type:'connectionNode_audio', name:'audioOut_1', data:{type:1, x:-10, y:40, width:10, height:20}},
//             {type:'grapherSVG', name:'graph', data:{x:10, y:10, width:175, height:75, style:{foreground:style.graph.foregroundlines, background:style.graph.backgroundlines, backgroundText:style.graph.backgroundtext}}},
//         ]
//     };
//     //dynamic design
//     for(var a = 0; a < vars.channelCount; a++){
//         design.elements.push(
//             {type:'rect', name:'backing_'+a, data:{
//                 x:13.75+a*22, y:87.5, width:12.5, height:157.5, style:style.panels[a],
//             }},
//             {type:'slide',name:'gainSlide_'+a,data:{
//                 x:15+a*22, y:90, width: 10, height: 80, angle:0, handleHeight:0.05, resetValue:0.5,
//                 style:{handle:style.slide.handle, backing:style.slide.backing, slot:style.slide.slot}, 
//                 onchange:function(a){
//                     return function(value){
//                         vars.gain[a] = (1-value)*2;
//                         obj.filterCircuit_0.gain(a,vars.gain[a]);
//                         obj.filterCircuit_1.gain(a,vars.gain[a]);
//                         updateGraph(a);
//                     }
//                 }(a)
//             }},
//             {type:'dial_continuous',name:'qDial_'+a,data:{
//                 x:20+a*22, y:180, r:7, startAngle:(3*Math.PI)/4, maxAngle:1.5*Math.PI, arcDistance:1.35, 
//                 style:{handle:style.dial.handle, slot:style.dial.slot, needle:style.dial.needle, outerArc:style.dial.markings},
//                 onchange:function(a){
//                     return function(value){
//                         vars.Q[a] = value;
//                         obj.filterCircuit_0.Q(a, __globals.utility.math.curvePoint.exponential(vars.Q[a],0,20000,10.5866095));
//                         obj.filterCircuit_1.Q(a, __globals.utility.math.curvePoint.exponential(vars.Q[a],0,20000,10.5866095));
//                         updateGraph(a);
//                     }
//                 }(a)
//             }},
//             {type:'dial_continuous',name:'frequencyDial_'+a,data:{
//                 x:20+a*22, y:200, r:7, startAngle:(3*Math.PI)/4, maxAngle:1.5*Math.PI, arcDistance:1.35, 
//                 style:{handle:style.dial.handle, slot:style.dial.slot, needle:style.dial.needle, outerArc:style.dial.markings},
//                 onchange:function(a){
//                     return function(value){
//                         vars.frequency[a] = value;
//                         design.readout_sixteenSegmentDisplay['frequencyReadout_'+a].text( __globals.utility.misc.padString( __globals.utility.math.curvePoint.exponential(value,0,20000,10.5866095).toFixed(2), 8) );
//                         design.readout_sixteenSegmentDisplay['frequencyReadout_'+a].print('smart');
//                         obj.filterCircuit_0.frequency(a, __globals.utility.math.curvePoint.exponential(vars.frequency[a],0,20000,10.5866095));
//                         obj.filterCircuit_1.frequency(a, __globals.utility.math.curvePoint.exponential(vars.frequency[a],0,20000,10.5866095));
//                         updateGraph(a);
//                     }
//                 }(a)
//             }},
//             {type:'readout_sixteenSegmentDisplay',name:'frequencyReadout_'+a,data:{
//                 x:25+a*22, y:212.5, width:30, height:10, count:8, angle:Math.PI/2,
//             }},
//         );
//     }

//     //main object
//         var obj = __globals.utility.misc.objectBuilder(objects.distortionUnit,design);

//     //import/export
//         obj.exportData = function(){
//             return {
//                 freqRange: vars.freqRange,
//                 channelCount: vars.channelCount,
//                 gain: vars.gain,
//                 Q: vars.Q,
//                 frequency: vars.frequency,
//             };
//         };
//         obj.importData = function(data){};

//     //circuitry
//         obj.filterCircuit_0 = new parts.circuits.audio.multibandFilter(__globals.audio.context,vars.channelCount);
//         obj.filterCircuit_1 = new parts.circuits.audio.multibandFilter(__globals.audio.context,vars.channelCount);
//         design.connectionNode_audio.audioIn_0.out().connect( obj.filterCircuit_0.in() );
//         design.connectionNode_audio.audioIn_1.out().connect( obj.filterCircuit_1.in() );
//         obj.filterCircuit_0.out().connect( design.connectionNode_audio.audioOut_0.in() );
//         obj.filterCircuit_1.out().connect( design.connectionNode_audio.audioOut_1.in() );

//     //internal functions
//         function getFrequencyAndLocationArray(){
//             var locationArray = [];
//             var frequencyArray = [];
//             for(var a = 0; a <= Math.floor(Math.log10(vars.freqRange.high))+1; a++){
//                 for(var b = 1; b < 10; b+=1/Math.pow(2,vars.graphDetail)){
//                     if( Math.pow(10,a)*(b/10) >= vars.freqRange.high){break;}
//                     locationArray.push( Math.log10(Math.pow(10,a)*b) );
//                     frequencyArray.push( Math.pow(10,a)*(b/10) );
//                 }
//             }
//             return {frequency:frequencyArray, location:__globals.utility.math.normalizeStretchArray(locationArray)};
//         }
//         function updateGraph(specificBand){
//             //if no band has been specified, gather the data for all of them and draw the whole thing. Otherwise, just gather 
//             //and redraw the data for the one band

//             var frequencyAndLocationArray = getFrequencyAndLocationArray();
//                 if(specificBand == undefined){
//                     var result = obj.filterCircuit_0.measureFrequencyResponse(undefined, frequencyAndLocationArray.frequency);
//                     for(var a = 0; a < vars.channels; a++){ design.grapherSVG.graph.draw( result[a][0], frequencyAndLocationArray.location, a ); }
//                 }else{
//                     var result = obj.filterCircuit_0.measureFrequencyResponse(specificBand, frequencyAndLocationArray.frequency);
//                     design.grapherSVG.graph.draw( result[0], frequencyAndLocationArray.location, specificBand);
//                 }
//         }

//     //interface
//         obj.i = {
//             kick:function(){//a silly solution to the problem of the circuit and graph not setting up properly
//                 for(var a = 0; a < vars.channelCount; a++){ design.slide['gainSlide_'+a].set(design.slide['gainSlide_'+a].get()); }
//             },
//             gain:function(band,value){ design.slide['gainSlide_'+band].set(value); },
//             Q:function(band,value){ design.dial_continuous['qDial_'+band].set(value); },
//             frequency:function(band,value){ design.dial_continuous['frequencyDial_'+band].set(value); },
//         };

//     //setup
//         //draw background
//             var arrays = getFrequencyAndLocationArray();
//             arrays.frequency = arrays.frequency.filter(function(a,i){return i%Math.pow(2,vars.graphDetail)==0;});
//             arrays.location = arrays.location.filter(function(a,i){return i%Math.pow(2,vars.graphDetail)==0;});
//             design.grapherSVG.graph.viewbox({'bottom':0,'top':2});
//             design.grapherSVG.graph.horizontalMarkings({points:[0.25,0.5,0.75,1,1.25,1.5,1.75],textPosition:{x:0.005,y:0.075},printText:true});
//             design.grapherSVG.graph.verticalMarkings({
//                     points:arrays.location,
//                     printingValues:arrays.frequency.map(a => Math.log10(a)%1 == 0 ? a : '').slice(0,arrays.frequency.length-1).concat(''), //only print the factoirs of 10, leaving everything else as an empty string
//                     textPosition:{x:-0.0025,y:1.99},
//                     printText:true,
//                 });
//             design.grapherSVG.graph.drawBackground();
//         //setup default settings
//             for(var a = 0; a < vars.channelCount; a++){
//                 design.slide['gainSlide_'+a].set(0.5);
//                 design.dial_continuous['qDial_'+a].set(0.15);
//                 design.dial_continuous['frequencyDial_'+a].set(a/vars.channelCount);
//             }
//             design.dial_continuous['frequencyDial_'+0].set( 0.4/vars.channelCount );
//         //kick it
//             setTimeout(obj.i.kick,100);
    
//     return obj;
// };