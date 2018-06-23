objects.pulseGenerator = function(x,y,debug=false){
    var style = {
        background:'fill:rgba(200,200,200,1)',
        text: 'fill:rgba(0,0,0,1); font-size:4px; font-family:Courier New; pointer-events: none;',

        dial:{
            handle: 'fill:rgba(220,220,220,1)',
            slot: 'fill:rgba(50,50,50,1)',
            needle: 'fill:rgba(250,150,150,1)',
            arc: 'fill:none; stroke:rgb(150,150,150); stroke-width:1;',
        }
    };
    var design = {
        type: 'pulseGenerator',
        x: x, y: y,
        base: {
            type:'path',
            points:[
                {x:0,y:10},{x:10,y:0},
                {x:100,y:0},{x:110,y:10},
                {x:110,y:30},{x:100,y:40},
                {x:10,y:40},{x:0,y:30}
            ], 
            style:style.background
        },
        elements:[
            {type:'connectionNode_data', name:'out', data:{
                x: -5, y: 11.25, width: 5, height: 17.5,
            }},
            {type:'dial_continuous',name:'tempo',data:{
                x:20, y:20, r: 12, startAngle: (3*Math.PI)/4, maxAngle: 1.5*Math.PI, arcDistance: 1.2, 
                style:{handle:style.dial.handle, slot:style.dial.slot, needle:style.dial.needle, outerArc:style.dial.arc},
                onchange:function(value){updateTempo(Math.round(value*240));}
            }},
            {type:'readout_sixteenSegmentDisplay',name:'readout',data:{
                x:40, y:10, width:60, height:20, count:6,
            }},
        ]
    };

    //main object
        var obj = __globals.utility.experimental.objectBuilder(objects.universalreadout,design);

    //internal functions
        var interval = null;
        function updateTempo(tempo){
            //update readout
                design.readout_sixteenSegmentDisplay.readout.text(
                    __globals.utility.math.padString(tempo,3,' ')+'bpm'
                );
                design.readout_sixteenSegmentDisplay.readout.print();

            //update interval
                if(interval){ clearInterval(interval); }
                interval = setInterval(function(){
                    obj.io.out.send('pulse');
                },1000*(60/tempo));
        }

    //setup
        design.dial_continuous.tempo.set(0.5);

    return obj;
};