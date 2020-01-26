this.audioScope = function(name,x,y,a){
    var attributes = {
        framerateLimits: {min:1, max:30}
    };
    var style = {
        background:{r:200/255,g:200/255,b:200/255,a:1},
        h1:{colour:{r:0/255,g:0/255,b:0/255,a:1}, size:3.5, ratio:1, font:'defaultThin', printingMode:{widthCalculation:'absolute',horizontal:'middle',vertical:'middle'}},
        h2:{colour:{r:150/255,g:150/255,b:150/255,a:1}, size:2, ratio:1.5, font:'defaultThin', printingMode:{widthCalculation:'absolute',horizontal:'middle',vertical:'middle'}},
        button:{
            background__up__colour:{r:175/255,g:175/255,b:175/255,a:1}, 
            background__hover__colour:{r:190/255,g:190/255,b:190/255,a:1}, 
            background__hover_press__colour:{r:170/255,g:170/255,b:170/255,a:1},
        },
        dial:{
            handle:{r:220/255,g:220/255,b:220/255,a:1},
            slot:{r:50/255,g:50/255,b:50/255,a:1},
            needle:{r:250/255,g:150/255,b:150/255,a:1},
        },
    };
    var design = {
        name:name,
        model:'audioScope',
        category:'humanOutputDevices',
        collection: 'alpha',
        x:x, y:y, a:a,
        space:[{x:0,y:0},{x:195,y:0},{x:195,y:110},{x:0,y:110}],
        // spaceOutline: true,
        elements:[
            {collection:'basic', type:'polygon', name:'backing', data:{ pointsAsXYArray:[{x:0,y:0},{x:195,y:0},{x:195,y:110},{x:0,y:110}], colour:style.background }},

            {collection:'dynamic', type:'connectionNode_audio', name:'input', data:{ x:195, y:5, width:10, height:20 }},
            {collection:'display', type:'grapher_audioScope', name:'waveport', data:{ x:5, y:5, width:150, height:100, static:true }},
            {collection:'control', type:'button_rectangle', name:'holdKey', data:{ x:160, y:5, width:30, height:20, style:style.button }},

            {collection:'basic', type:'text', name:'framerate_name', data:{x: 175, y: 68, text: 'framerate', width:style.h1.size, height:style.h1.size*style.h1.ratio, colour:style.h1.colour, font:style.h1.font, printingMode:style.h1.printingMode}},
            {collection:'basic', type:'text', name:'framerate_1',    data:{x: 164, y: 60, text: '1',         width:style.h2.size, height:style.h2.size*style.h2.ratio, colour:style.h2.colour, font:style.h2.font, printingMode:style.h2.printingMode}},
            {collection:'basic', type:'text', name:'framerate_15',   data:{x: 175, y: 32, text: '15',        width:style.h2.size, height:style.h2.size*style.h2.ratio, colour:style.h2.colour, font:style.h2.font, printingMode:style.h2.printingMode}},
            {collection:'basic', type:'text', name:'framerate_30',   data:{x: 187, y: 60, text: '30',        width:style.h2.size, height:style.h2.size*style.h2.ratio, colour:style.h2.colour, font:style.h2.font, printingMode:style.h2.printingMode}},
            {collection:'control', type:'dial_continuous', name:'framerate', data:{
                x:175, y:47.5, radius:12, resetValue:0.5,
                style:{handle:style.dial.handle, slot:style.dial.slot, needle:style.dial.needle},
            }},
        ]
    };

    //main object
        var object = _canvas_.interface.unit.builder(design);
    
    //circuitry
        object.elements.button_rectangle.holdKey.onpress = function(){object.elements.grapher_audioScope.waveport.stop();};
        object.elements.button_rectangle.holdKey.onrelease = function(){object.elements.grapher_audioScope.waveport.start();};
        object.elements.connectionNode_audio.input.out().connect(object.elements.grapher_audioScope.waveport.getNode());

    //wiring
        object.elements.dial_continuous.framerate.onchange = function(a){
            object.elements.grapher_audioScope.waveport.refreshRate(
                attributes.framerateLimits.min + Math.floor((attributes.framerateLimits.max - attributes.framerateLimits.min)*a)
            );
        };

    //setup
        object.elements.grapher_audioScope.waveport.start();
        object.elements.dial_continuous.framerate.set(0);

    return object;
};

this.audioScope.metadata = {
    name:'Audio Scope',
    category:'humanOutputDevices',
    helpURL:'https://curve.metasophiea.com/help/units/alpha/audioScope/'
};