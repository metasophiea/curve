this.amplifier = function(x,y,a){
    var shape = [
        {x:0,y:0},
        {x:150,y:0},
        {x:150,y:140},
        {x:0,y:140},
    ];
    var design = {
        name:'amplifier',
        x:x, y:y, angle:a,
        space:shape,
        elements:[
            { type:'polygon', name:'backing', data:{pointsAsXYArray:shape, colour:style.background} },

            { type:'image', name:'grill', data:{x:10,y:10,width:130,height:120,url:'images/units/beta/amplifierGrill.png'} },
            { type:'path', name:'grillFrame', data:{
                looping:true, 
                pointsAsXYArray:[{x:10,y:10}, {x:140,y:10}, {x:140,y:130}, {x:10,y:130}],
                thickness:5,
                jointType:'round',
                colour:{r:24/255,g:24/255,b:24/255,a:1}
            } },

            { type:'text', name:'label', data:{
                x:147.25, y:135, 
                width:4,height:4,
                angle:-Math.PI/2,
                text:'amplifier (true tone)',
                font:'AppleGaramond', 
                printingMode:{widthCalculation:'absolute'},
                colour:style.textColour
            } },
            { type:'path', name:'line', data:{
                pointsAsXYArray:[{x:146,y:7.5}, {x:146,y:92.5} ],
                capType:'round',
                thickness:0.5,
                colour:style.textColour
            } },

            {type:'connectionNode_audio', name:'input_left', data:{ 
                x:150, y:100, width:5, height:15, cableVersion:2,
                style:{ 
                    dim:style.connectionNode.audio.dim, 
                    glow:style.connectionNode.audio.glow,
                    cable_dim:style.connectionCable.audio.dim, 
                    cable_glow:style.connectionCable.audio.glow,
                },
            }},
            {type:'connectionNode_audio', name:'input_right', data:{ 
                x:150, y:120, width:5, height:15, cableVersion:2,
                style:{ 
                    dim:style.connectionNode.audio.dim, 
                    glow:style.connectionNode.audio.glow,
                    cable_dim:style.connectionCable.audio.dim, 
                    cable_glow:style.connectionCable.audio.glow,
                },
            }},

        ]
    };
    //add bumpers
    for(var a = shape.length-1, b=0, c=1; b < shape.length; a=b, b++, c++){
        if(c == shape.length){c = 0;}

        var arm1 = _canvas_.library.math.cartesianAngleAdjust(bumperCoverage.large.length,0,_canvas_.library.math.getAngleOfTwoPoints(shape[b],shape[a]));
        var arm2 = _canvas_.library.math.cartesianAngleAdjust(bumperCoverage.large.length,0,_canvas_.library.math.getAngleOfTwoPoints(shape[b],shape[c]));

        design.elements.push( {type:'path', name:'bumper_'+b, data:{ pointsAsXYArray:[
            { x:shape[b].x+arm1.x, y:shape[b].y+arm1.y }, shape[b], { x:shape[b].x+arm2.x, y:shape[b].y+arm2.y },
        ], thickness:bumperCoverage.large.thickness, jointType:'round', capType:'round', colour:style.bumper }} );
    }


    
    //main object
        var object = _canvas_.interface.unit.builder(this.ruler,design);

    //circuitry
        var flow = {
            destination:null,
            stereoCombiner: null,
            pan_left:null, pan_right:null,
        };

        //destination
            flow._destination = _canvas_.library.audio.destination;

        //stereo channel combiner
            flow.stereoCombiner = new ChannelMergerNode(_canvas_.library.audio.context, {numberOfInputs:2});

        //audio connections
            //inputs to stereo combiner
                object.elements.connectionNode_audio.input_left.out().connect(flow.stereoCombiner, 0, 0);
                object.elements.connectionNode_audio.input_right.out().connect(flow.stereoCombiner, 0, 1);
            //stereo combiner to main output
                flow.stereoCombiner.connect(flow._destination);

    return object;
};

this.amplifier.metadata = {
    name:'Amplifier',
    category:'monitors',
    helpURL:'https://curve.metasophiea.com/help/units/beta/amplifier/'
};