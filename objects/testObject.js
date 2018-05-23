this.testObject = function(x,y,debug=false){
    var style = {
        background: 'fill:rgba(255,100,255,0.75); stroke:none;',
        h1: 'fill:rgba(0,0,0,1); font-size:14px; font-family:Courier New;',
        text: 'fill:rgba(0,0,0,1); font-size:10px; font-family:Courier New; pointer-events: none;',

        markings: 'fill:none; stroke:rgb(150,150,150); stroke-width:1;',

        handle: 'fill:rgba(200,200,200,1)',
        backing: 'fill:rgba(150,150,150,1)',
        slot: 'fill:rgba(50,50,50,1)',
        needle: 'fill:rgba(250,150,150,1)',

        glow:'fill:rgba(240,240,240,1)',
        dim:'fill:rgba(80,80,80,1)',

        level:{
            backing: 'fill:rgb(10,10,10)', 
            levels:['fill:rgb(250,250,250)','fill:rgb(200,200,200)'],
            marking:'fill:rgba(220,220,220,1); stroke:none; font-size:1px; font-family:Courier New;'
        },

        grapher:{
            middleground:'stroke:rgba(0,255,0,1); stroke-width:0.5; stroke-linecap:round;', 
            background:'stroke:rgba(0,100,0,1); stroke-width:0.25;',
            backgroundText:'fill:rgba(0,100,0,1); font-size:3; font-family:Helvetica;',
            backing:'fill:rgba(50,50,50,1)'
        },
    };
    var design = {
        type: 'testObject2',
        x: x, y: y,
        base: {
            points:[{x:0,y:0},{x:335,y:0},{x:335,y:285},{x:0,y:285}], 
            style:style.background
        },
        elements:[
            {type:'slide_vertical',name:'slide_vertical',data:{
                x:5, y:40, width: 10, height: 120, 
                style:{handle:style.handle, backing:style.backing, slot:style.slot}, 
                onchange:function(data){design.connectionNode_data.externalData_1.send('slide_vertical',data);}, 
                onrelease:function(){console.log('slide_vertical onrelease');}
            }},
            {type:'slide_horizontal',name:'slide_horizontal',data:{
                x:5, y:165, width: 115, height: 10, 
                style:{handle:style.handle, backing:style.backing, slot:style.slot}, 
                onchange:function(data){design.connectionNode_data.externalData_1.send('slide_horizontal',data);}, 
                onrelease:function(){console.log('slide_horizontal onrelease');}
            }},
            {type:'slidePanel_vertical',name:'slidePanel_vertical',data:{
                x:20, y:40, width: 100, height: 120, count: 10, 
                style:{handle:style.handle, backing:style.backing, slot:style.slot}, 
                onchange:function(){/*console.log('slidePanel_vertical onchange');*/}, 
                onrelease:function(){/*console.log('slidePanel_vertical onrelease');*/}
            }},
            {type:'slidePanel_horizontal',name:'slidePanel_horizontal',data:{
                x:5, y:180, width: 115, height: 100, count: 10,
                style:{handle:style.handle, backing:style.backing, slot:style.slot}, 
                onchange:function(){/*console.log('slide_horizontalPanel onchange');*/}, 
                onrelease:function(){/*console.log('slide_horizontalPanel onrelease');*/}
            }},
            {type:'dial_continuous',name:'dial_continuous',data:{
                x: 70, y: 22.5, r: 12, startAngle: (3*Math.PI)/4, maxAngle: 1.5*Math.PI, arcDistance: 1.35, 
                style:{handle:style.handle, slot:style.slot, needle:style.needle, outerArc:style.markings},
                onchange:function(){console.log('dial_continuous onchange');},
                onrelease:function(){console.log('dial_continuous onrelease');}
            }},
            {type:'dial_discrete',name:'dial_discrete',data:{
                x: 105, y: 22.5, r: 12, startAngle: (3*Math.PI)/4, maxAngle: 1.5*Math.PI, arcDistance: 1.35, optionCount: 8,
                style:{handle:style.handle, slot:style.slot, needle:style.needle, outerArc:style.markings}, 
                onchange:function(){console.log('dial_discrete onchange');},
                onrelease:function(){console.log('dial_discrete onrelease');}
            }},
            {type:'button_rect',name:'button_rect',data:{
                x:220, y: 5, width:20, height:20, 
                style:{
                    up:'fill:rgba(200,200,200,1)', hover:'fill:rgba(220,220,220,1)', 
                    down:'fill:rgba(180,180,180,1)', glow:'fill:rgba(220,200,220,1)'
                }, 
                onclick:function(){design.connectionNode_data.externalData_1.send('button_rect');}
            }},
            {type:'checkbox_rect', name:'checkbox_rect', data:{
                x:245, y: 5, width:20, height:20, angle:0, 
                style:{
                    check:'fill:rgba(150,150,150,1)', backing:'fill:rgba(200,200,200,1)', 
                    checkGlow:'fill:rgba(220,220,220,1)', backingGlow:'fill:rgba(220,220,220,1)'
                }, 
                onchange:function(){design.connectionNode_data.externalData_1.send('checkbox_rect', design.checkbox.checkbox_rect.get());}
            }},
            {type:'key_rect', name:'key_rect', data:{
                x:270, y:5, width:20, height:20, angle:0, 
                style:{
                    off:'fill:rgba(200,200,200,1)', press:'fill:rgba(180,180,180,1)', 
                    glow:'fill:rgba(220,200,220,1)', pressAndGlow:'fill:rgba(200,190,200,1)'
                }, 
                onkeydown:function(){design.connectionNode_data.externalData_1.send('key_rect',true);}, 
                onkeyup:function(){design.connectionNode_data.externalData_1.send('key_rect',false);}
            }},
            {type:'rastorgrid', name:'rastorgrid', data:{
                x:230, y:135, width:100, height:100, xCount:4, yCount:4, 
                style:{
                    backing:'fill:rgba(200,200,200,1)', check:'fill:rgba(150,150,150,1)',
                    backingGlow:'fill:rgba(220,220,220,1)', checkGlow:'fill:rgba(220,220,220,1)'
                }, 
                onchange:function(){design.connectionNode_data.externalData_1.send('rastorgrid', design.rastorgrid.rastorgrid.get());}
            }},
            {type:'glowbox', name:'globox', data:{
                x:120, y:5, width: 10, height:10, angle:0, 
                style:{glow:'fill:rgba(240,240,240,1)', dim:'fill:rgba(80,80,80,1)'}
            }},
            {type:'label', name:'label', data:{
                x:125, y:20, text:'_mainObject', style:style.h1, angle:0
            }},
            {type:'level', name:'level', data:{
                x: 125, y:240, angle:0, width: 10, height:40, 
                style:{backing: 'fill:rgb(10,10,10)', levels:['fill:rgb(250,250,250)','fill:rgb(200,200,200)']}
            }},
            {type:'meter_level', name:'meter_level', data:{
                x: 137.5, y:240, angle:0, width: 10, height:40, markings:[0.125,0.25,0.375,0.5,0.625,0.75,0.875],
                style:{backing:style.backing, levels:style.levels, markings:style.markings},
                }},
            {type:'audio_meter_level', name:'audio_meter_level', data:{
                x: 150, y:240, angle:0, width: 10, height:40, markings:[0.125,0.25,0.375,0.5,0.625,0.75,0.875], 
                style:{backing:style.backing, levels:style.levels, markings:style.markings},
            }},
            {type:'sevenSegmentDisplay', name:'sevenSegmentDisplay', data:{
                x: 162.5, y: 240, angle:0, width:10, height:20, 
                style:{background:'fill:rgb(0,0,0)', glow:'fill:rgb(200,200,200)',dim:'fill:rgb(20,20,20)'}
            }},
            {type:'sixteenSegmentDisplay', name:'sixteenSegmentDisplay', data:{
                x: 175, y: 240, angle:0, width:10, height:20, 
                style:{background:'fill:rgb(0,0,0)', glow:'fill:rgb(200,200,200)',dim:'fill:rgb(20,20,20)'}
            }},
            {type:'readout_sixteenSegmentDisplay', name:'readout_sixteenSegmentDisplay', data:{
                x: 187.5, y: 240, angle:0, width:100, height:20, count:10, 
                style:{background:'fill:rgb(0,0,0)', glow:'fill:rgb(200,200,200)',dim:'fill:rgb(20,20,20)'}
            }},
            {type:'rastorDisplay', name:'rastorDisplay', data:{
                x: 162.5, y: 262.5, angle:0, width:20, height:20, xCount:8, yCount:8, xGappage:0.1, yGappage:0.1
            }},
            {type:'grapher', name:'grapher', data:{
                x:125, y:30, width:100, height:100,
                style:{
                    middleground:style.grapher.middleground, background:style.grapher.background, 
                    backgroundText:style.grapher.backgroundText, backing:style.grapher.backing
                }
            }},
            {type:'grapher_periodicWave', name:'grapher_periodicWave', data:{
                x:125, y:135, width:100, height:100,
                style:{
                    middleground:style.grapher.middleground, background:style.grapher.background, 
                    backgroundText:style.grapher.backgroundText, backing:style.grapher.backing
                }
            }},
            {type:'connectionNode_audio', name:'internalAudio_1', data: {
                type: 1, x: 230, y: 65, width: 30, height: 30
            }},
            {type:'connectionNode_audio', name:'internalAudio_2', data:{
                type: 0, x: 300, y: 65, width: 30, height: 30
            }},
            {type:'connectionNode_data', name:'internalData_1', data:{
                x: 230, y: 30, width: 30, height: 30
            }},
            {type:'connectionNode_data', name:'internalData_2', data:{
                x: 300, y: 30, width: 30, height: 30
            }},
            {type:'connectionNode_data', name:'externalData_1', data:{
                x: 230, y: 100, width: 30, height: 30, 
                receive:function(address, data){
                    switch(address){
                        case 'slide_vertical':        design.slide_vertical.slide_vertical.set(data,true,false);               break;
                        case 'slide_horizontal':      design.slide_horizontal.slide_horizontal.set(data,true,false);           break;
                        case 'slidePanel_vertical':   design.slidePanel_vertical.slidePanel_vertical.set(data,true,false);     break;
                        case 'slide_horizontalPanel': design.slidePanel_horizontal.slidePanel_horizontal.set(data,true,false); break;
                        case 'dial_continuous':       design.dial_continuous.dial_continuous.set(data,true,false);             break;
                        case 'dial_discrete':         design.dial_discrete.dial_discrete.select(data,true,false);              break;
                        case 'button_rect': 
                            design.grapher_periodicWave.grapher_periodicWave.reset(); 
                            design.dial_continuous.dial_continuous.smoothSet(1,1,'s',false); 
                            design.slide_vertical.slide_vertical.smoothSet(1,1,'linear',false); 
                            design.slidePanel_horizontal.slidePanel_horizontal.smoothSet(1,1,'sin',false); 
                            design.slidePanel_vertical.slidePanel_vertical.smoothSetAll(1,1,'cos',false); 
                            design.slidePanel_horizontal.slidePanel_horizontal.smoothSetAll(1,1,'exponential',false);
                        break;
                        case 'checkbox_rect': design.checkbox_rect.checkbox_rect.set(data,false); break;
                        case 'key_rect': 
                            if(data){
                                design.key_rect.key_rect.glow();design.glowbox.glowbox.on();
                            }else{
                                design.key_rect.key_rect.dim();design.glowbox.glowbox.off();
                            }
                        break;
                        case 'rastorgrid': design.rastorgrid.rastorgrid.set(data,false); break;
                    }
                }, 
            }},
        ]
    };
 
    //main object
        var obj = __globals.utility.experimental.objectBuilder(objects.testObject,design);

    //setup
        setTimeout(function(){
            for(var a = 0; a < 10; a++){ design.slidePanel_vertical.slidePanel_vertical.slide(a).set( 1-1/(a+1)  ); }
            for(var a = 0; a < 10; a++){ design.slidePanel_horizontal.slidePanel_horizontal.slide(a).set( 1-1/(a+1)  ); }

            setInterval(function(){
                design.sevenSegmentDisplay.sevenSegmentDisplay.enterCharacter( ''+Math.round(Math.random()*9) ); 
                design.sixteenSegmentDisplay.sixteenSegmentDisplay.enterCharacter(
                    '0123456789abcdefghijklmnopqrstuvwxyz'.split('')[Math.round(Math.random()*35)]
                ); 
            },500);
            design.readout_sixteenSegmentDisplay.readout_sixteenSegmentDisplay.test();
            design.rastorDisplay.rastorDisplay.test();

            design.grapher.grapher._test();

            design.grapher_periodicWave.grapher_periodicWave.waveElement('sin',1,1);
            design.grapher_periodicWave.grapher_periodicWave.draw();

            design.level.level.set(0.5,0);
            design.level.level.set(0.75,1);

            setInterval(function(){ design.meter_level.meter_level.set( Math.random() ); },1000);

            design.connectionNode_audio.internalAudio_1.connectTo(design.connectionNode_audio.internalAudio_2);
            design.connectionNode_data.internalData_1.connectTo(design.connectionNode_data.internalData_2);
        },1);

    return obj;
}