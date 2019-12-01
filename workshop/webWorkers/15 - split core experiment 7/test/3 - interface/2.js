var partsCreated = {};

_canvas_.interface.go = function(){











    




    _canvas_.core.render.active(true);
    // _canvas_.core.render.activeLimitToFrameRate(true);
    _canvas_.core.render.frameRateLimit(10);


    const scale = 5;
    const position = {x:230, y:340};
    _canvas_.core.viewport.scale(scale);
    _canvas_.core.viewport.position(-(position.x)*scale,-(position.y)*scale);

    _canvas_.core.viewport.stopMouseScroll(true);
















    //basic
        partsCreated.basic = {};
        partsCreated.basic.basicGroup = _canvas_.interface.part.builder( 'basic', 'group', 'basicGroup', { x:10, y:10 } );
        _canvas_.system.pane.mm.append(partsCreated.basic.basicGroup);

        //rectangle
            partsCreated.basic.rectangle = _canvas_.interface.part.builder('basic', 'rectangle','testRectangle', { x:5, y:5, width:30, height:30, colour:{r:1,g:0,b:0,a:1} });
            partsCreated.basic.basicGroup.append(partsCreated.basic.rectangle);
        //circle
            partsCreated.basic.circle = _canvas_.interface.part.builder('basic', 'circle','testCircle', { x:20, y:55, radius:15 });
            partsCreated.basic.basicGroup.append(partsCreated.basic.circle);
        //polygon
            partsCreated.basic.polygon = _canvas_.interface.part.builder('basic', 'polygon','testPolygon', { points:[55,5, 70,35, 40,35], colour:{r:0,g:1,b:0,a:1} });
            partsCreated.basic.basicGroup.append(partsCreated.basic.polygon);
        //path
            partsCreated.basic.path = _canvas_.interface.part.builder('basic', 'path','testPath', { points:[0,0, 0,90, 2.5,90, 2.5,72.5, 75,72.5], thickness:1.25, jointType:'round', capType:'round' });
            partsCreated.basic.basicGroup.append(partsCreated.basic.path);
        //image
            partsCreated.basic.image = _canvas_.interface.part.builder('basic', 'image','testImage', { x:40, y:40, width:30, height:30, url:'/images/testImages/Dore-munchausen-illustration.jpg' });
            partsCreated.basic.basicGroup.append(partsCreated.basic.image);
        //text
            partsCreated.basic.text = _canvas_.interface.part.builder('basic', 'text', 'testText', { x:5, y:75, text:'Hello', height:15, width:70, colour:{r:150/255,g:150/255,b:1,a:1} });
            partsCreated.basic.basicGroup.append(partsCreated.basic.text);
        //rectangleWithOutline
            partsCreated.basic.rectangleWithOutline = _canvas_.interface.part.builder('basic', 'rectangleWithOutline','testRectangleWithOutline', { x:105, y:60, width:30, height:30 });
            partsCreated.basic.basicGroup.append(partsCreated.basic.rectangleWithOutline);
        //circleWithOutline
            partsCreated.basic.circleWithOutline = _canvas_.interface.part.builder('basic', 'circleWithOutline','testCircleWithOutline', { x:90, y:70, radius:10 });
            partsCreated.basic.basicGroup.append(partsCreated.basic.circleWithOutline);
        //polygonWithOutline
            partsCreated.basic.polygonWithOutline = _canvas_.interface.part.builder('basic', 'polygonWithOutline','testPolygonWithOutline', { points:[75,15, 75,55, 115,55], thickness:1, colour:{r:1,g:0,b:0.5,a:1}, lineColour:{r:0,g:0,b:0,a:1} });
            partsCreated.basic.basicGroup.append(partsCreated.basic.polygonWithOutline);
        //canvas
            partsCreated.basic.canvas = _canvas_.interface.part.builder('basic', 'canvas','testCanvas', { x:130, y:5, width:30, height:30 });
            partsCreated.basic.basicGroup.append(partsCreated.basic.canvas);
                const $ = partsCreated.basic.canvas.$;
                partsCreated.basic.canvas._.fillStyle = _canvas_.library.math.convertColour.obj2rgba({r:0.9,g:0.9,b:0.9,a:1});
                partsCreated.basic.canvas._.fillRect($(0),$(0),$(30),$(30));
                partsCreated.basic.canvas._.fillStyle = _canvas_.library.math.convertColour.obj2rgba({r:0.732,g:0.756,b:0.892,a:1});
                partsCreated.basic.canvas._.fillRect($(0),$(0),$(10),$(10));
                partsCreated.basic.canvas._.fillStyle = _canvas_.library.math.convertColour.obj2rgba({r:0.107,g:0.722,b:0.945,a:1});
                partsCreated.basic.canvas._.fillRect($(20),$(0),$(10),$(10));
                partsCreated.basic.canvas._.fillStyle = _canvas_.library.math.convertColour.obj2rgba({r:0.859,g:0.573,b:0.754,a:1});
                partsCreated.basic.canvas._.fillRect($(0),$(20),$(10),$(10));
                partsCreated.basic.canvas._.fillStyle = _canvas_.library.math.convertColour.obj2rgba({r:0.754,g:0.859,b:0.573,a:1});
                partsCreated.basic.canvas._.fillRect($(20),$(20),$(10),$(10));
                partsCreated.basic.canvas.requestUpdate();
        //clipped group
            partsCreated.basic.clippingGroup = _canvas_.interface.part.builder( 'basic', 'group', 'clippingGroup', { x:75, y:5, clipActive:true } );
            _canvas_.system.pane.mm.append(partsCreated.basic.clippingGroup);
                const clippingPolygon = _canvas_.interface.part.builder('basic', 'polygon','testClippingPolygon', { points:[0,0, 50,0, 50,50] });
                partsCreated.basic.clippingGroup.stencil(clippingPolygon);
                const clippedImage = _canvas_.interface.part.builder('basic', 'image','clippedImage', { width:50, height:50, url:'/images/testImages/mikeandbrian.jpg' });
                partsCreated.basic.clippingGroup.append(clippedImage);
















    //display
        partsCreated.display = {};
        partsCreated.display.displayGroup = _canvas_.interface.part.builder( 'basic', 'group', 'displayGroup', { x:10, y:150 } );
        _canvas_.system.pane.mm.append(partsCreated.display.displayGroup);

        //glowbox
            //glowbox_rectangle
                partsCreated.display.glowbox_rectangle = _canvas_.interface.part.builder('display', 'glowbox_rectangle', 'test_glowbox_rectangle', {x:0, y:0});
                partsCreated.display.displayGroup.append(partsCreated.display.glowbox_rectangle);
            //glowbox_circle
                partsCreated.display.glowbox_circle = _canvas_.interface.part.builder('display', 'glowbox_circle', 'test_glowbox_circle', {x:15, y:45});
                partsCreated.display.displayGroup.append(partsCreated.display.glowbox_circle);
            //glowbox_image
                partsCreated.display.glowbox_image = _canvas_.interface.part.builder('display', 'glowbox_image', 'test_glowbox_image', {x:0, y:60, glowURL:'/images/testImages/Dore-munchausen-illustration.jpg', dimURL:'/images/testImages/mikeandbrian.jpg'});
                partsCreated.display.displayGroup.append(partsCreated.display.glowbox_image);
            //glowbox_polygon
                partsCreated.display.glowbox_polygon = _canvas_.interface.part.builder('display', 'glowbox_polygon', 'test_glowbox_polygon', {x:0, y:95});
                partsCreated.display.displayGroup.append(partsCreated.display.glowbox_polygon);
            //glowbox_path
                partsCreated.display.glowbox_path = _canvas_.interface.part.builder('display', 'glowbox_path', 'test_glowbox_path', {x:0, y:130});
                partsCreated.display.displayGroup.append(partsCreated.display.glowbox_path);
        
            // let display_glowbox_state = false;
            // setInterval(() => {
            //     if(display_glowbox_state){
            //         partsCreated.display.glowbox_rectangle.off();
            //         partsCreated.display.glowbox_circle.off();
            //         partsCreated.display.glowbox_image.off();
            //         partsCreated.display.glowbox_polygon.off();
            //         partsCreated.display.glowbox_path.off();
            //     }else{
            //         partsCreated.display.glowbox_rectangle.on();
            //         partsCreated.display.glowbox_circle.on();
            //         partsCreated.display.glowbox_image.on();
            //         partsCreated.display.glowbox_polygon.on();
            //         partsCreated.display.glowbox_path.on();
            //     }
            //     display_glowbox_state = !display_glowbox_state;
            // }, 1000);

        //segment displays
            //sevenSegmentDisplay
                partsCreated.display.sevenSegmentDisplay = _canvas_.interface.part.builder('display', 'sevenSegmentDisplay', 'test_sevenSegmentDisplay', {x:35, y:0});
                partsCreated.display.displayGroup.append(partsCreated.display.sevenSegmentDisplay);
            //sevenSegmentDisplay (static)
                partsCreated.display.sevenSegmentDisplay_static = _canvas_.interface.part.builder('display', 'sevenSegmentDisplay', 'test_sevenSegmentDisplay_static', {x:35, y:35, static:true});
                partsCreated.display.displayGroup.append(partsCreated.display.sevenSegmentDisplay_static);
            //sixteenSegmentDisplay
                partsCreated.display.sixteenSegmentDisplay = _canvas_.interface.part.builder('display', 'sixteenSegmentDisplay', 'test_sixteenSegmentDisplay', {x:60, y:0});
                partsCreated.display.displayGroup.append(partsCreated.display.sixteenSegmentDisplay);
            //sixteenSegmentDisplay (static)
                partsCreated.display.sixteenSegmentDisplay_static = _canvas_.interface.part.builder('display', 'sixteenSegmentDisplay', 'test_sixteenSegmentDisplay_static', {x:60, y:35, static:true});
                partsCreated.display.displayGroup.append(partsCreated.display.sixteenSegmentDisplay_static);
            //readout_sevenSegmentDisplay
                partsCreated.display.readout_sevenSegmentDisplay = _canvas_.interface.part.builder('display', 'readout_sevenSegmentDisplay', 'test_readout_sevenSegmentDisplay', {x:85, y:0});
                partsCreated.display.displayGroup.append(partsCreated.display.readout_sevenSegmentDisplay);
            //readout_sevenSegmentDisplay (static)
                partsCreated.display.readout_sevenSegmentDisplay_static = _canvas_.interface.part.builder('display', 'readout_sevenSegmentDisplay', 'test_readout_sevenSegmentDisplay_static', {x:85, y:35, static:true});
                partsCreated.display.displayGroup.append(partsCreated.display.readout_sevenSegmentDisplay_static);
            //readout_sixteenSegmentDisplay
                partsCreated.display.readout_sixteenSegmentDisplay = _canvas_.interface.part.builder('display', 'readout_sixteenSegmentDisplay', 'test_readout_sixteenSegmentDisplay', {x:190, y:0});
                partsCreated.display.displayGroup.append(partsCreated.display.readout_sixteenSegmentDisplay);
            //readout_sixteenSegmentDisplay (static)
                partsCreated.display.readout_sixteenSegmentDisplay_static = _canvas_.interface.part.builder('display', 'readout_sixteenSegmentDisplay', 'test_readout_sixteenSegmentDisplay_static', {x:190, y:35, static:true});
                partsCreated.display.displayGroup.append(partsCreated.display.readout_sixteenSegmentDisplay_static);

            // let display_sevenSegmentDisplay_state = 0;
            // let display_sixteenSegmentDisplay_state_index = 0;
            // let display_sixteenSegmentDisplay_state_glyphs = ['!','?','.',',','\'',':','"','_','-','\\','/','*','#','<','>','(',')','[',']','{','}','0','1','2','3','4','5','6','7','8','9','a','b','c','d','e','f','g','h','i','j','k','l','m','n','o','p','q','r','s','t','u','v','w','x','y','z'];
            // setInterval(() => {
            //     partsCreated.display.sevenSegmentDisplay.enterCharacter(display_sevenSegmentDisplay_state);
            //     partsCreated.display.sevenSegmentDisplay_static.enterCharacter(display_sevenSegmentDisplay_state);
            //     display_sevenSegmentDisplay_state++;
            //     if(display_sevenSegmentDisplay_state > 9){display_sevenSegmentDisplay_state = 0;}

            //     partsCreated.display.sixteenSegmentDisplay.enterCharacter(display_sixteenSegmentDisplay_state_glyphs[display_sixteenSegmentDisplay_state_index]);
            //     partsCreated.display.sixteenSegmentDisplay_static.enterCharacter(display_sixteenSegmentDisplay_state_glyphs[display_sixteenSegmentDisplay_state_index]);
            //     display_sixteenSegmentDisplay_state_index++;
            //     if(display_sixteenSegmentDisplay_state_index >= display_sixteenSegmentDisplay_state_glyphs.length){display_sixteenSegmentDisplay_state_index = 0;}
            // }, 500);
            // setTimeout(() => {
            //     partsCreated.display.readout_sevenSegmentDisplay.text('1234567890');
            //     partsCreated.display.readout_sevenSegmentDisplay.print('smart');
            //     partsCreated.display.readout_sevenSegmentDisplay_static.text('1234567890');
            //     partsCreated.display.readout_sevenSegmentDisplay_static.print('smart');
            //     partsCreated.display.readout_sixteenSegmentDisplay.text('!?.,\':"_-\\/*#<>()[]{}0123456789abcdefghijklmnopqrstuvwxyz');
            //     partsCreated.display.readout_sixteenSegmentDisplay.print('smart');
            //     partsCreated.display.readout_sixteenSegmentDisplay_static.text('!?.,\':"_-\\/*#<>()[]{}0123456789abcdefghijklmnopqrstuvwxyz');
            //     partsCreated.display.readout_sixteenSegmentDisplay_static.print('smart');
            // }, 500);

        //levels
            //level
                partsCreated.display.level = _canvas_.interface.part.builder('display', 'level', 'test_level', {x:295, y:0});
                partsCreated.display.displayGroup.append(partsCreated.display.level);
            //meter_level
                partsCreated.display.meter_level = _canvas_.interface.part.builder('display', 'meter_level', 'test_meter_level', {x:320, y:0});
                partsCreated.display.displayGroup.append(partsCreated.display.meter_level);
            //audio_meter_level
                partsCreated.display.audio_meter_level = _canvas_.interface.part.builder('display', 'audio_meter_level', 'test_audio_meter_level', {x:345, y:0});
                partsCreated.display.displayGroup.append(partsCreated.display.audio_meter_level);

            // setInterval(() => {
            //     partsCreated.display.level.layer(Math.random(), 0);
            //     partsCreated.display.level.layer(Math.random(), 1);
            //     partsCreated.display.meter_level.set(Math.random());
            // },1000);

        //gauge
            //gauge
                partsCreated.display.gauge = _canvas_.interface.part.builder('display', 'gauge', 'test_gauge', {x:370, y:0});
                partsCreated.display.displayGroup.append(partsCreated.display.gauge);
            //gauge_image
                partsCreated.display.gauge_image = _canvas_.interface.part.builder('display', 'gauge_image', 'test_gauge_image', {x:425, y:0, backingURL:'/images/testImages/Dore-munchausen-illustration.jpg'});
                partsCreated.display.displayGroup.append(partsCreated.display.gauge_image);
            //meter_gauge
                partsCreated.display.meter_gauge = _canvas_.interface.part.builder('display', 'meter_gauge', 'test_meter_gauge', {x:370, y:35, markings:{ upper:'...........'.split(''), middle:'.........'.split(''), lower:'.......'.split('') }, style:{markingStyle_font:'defaultThin'}});
                partsCreated.display.displayGroup.append(partsCreated.display.meter_gauge);
            //meter_gauge_image
                partsCreated.display.meter_gauge_image = _canvas_.interface.part.builder('display', 'meter_gauge_image', 'test_meter_gauge_image', {x:425, y:35, backingURL:'/images/testImages/mikeandbrian.jpg'});
                partsCreated.display.displayGroup.append(partsCreated.display.meter_gauge_image);
        
            // setInterval(() => {
            //     partsCreated.display.gauge.needle(Math.random());
            //     partsCreated.display.gauge_image.needle(Math.random());
            //     partsCreated.display.meter_gauge.set(Math.random());
            //     partsCreated.display.meter_gauge_image.set(Math.random());
            // },1000);

        //rastor
            //rastorDisplay
                partsCreated.display.rastorDisplay = _canvas_.interface.part.builder('display', 'rastorDisplay', 'test_rastorDisplay', {x:480, y:0});
                partsCreated.display.displayGroup.append(partsCreated.display.rastorDisplay);

            // partsCreated.display.rastorDisplay.test();
            
        //grapher
            //grapher
                partsCreated.display.grapher = _canvas_.interface.part.builder('display', 'grapher', 'test_grapher', {x:550, y:0});
                partsCreated.display.displayGroup.append(partsCreated.display.grapher);
            //grapher (static)
                partsCreated.display.grapher_static = _canvas_.interface.part.builder('display', 'grapher', 'test_grapher_static', {x:550, y:65, static:true});
                partsCreated.display.displayGroup.append(partsCreated.display.grapher_static);
            //grapher_periodicWave
                partsCreated.display.grapher_periodicWave = _canvas_.interface.part.builder('display', 'grapher_periodicWave', 'test_grapher_periodicWave', {x:675, y:0});
                partsCreated.display.displayGroup.append(partsCreated.display.grapher_periodicWave);
            //grapher_periodicWave (static)
                partsCreated.display.grapher_periodicWave_static = _canvas_.interface.part.builder('display', 'grapher_periodicWave', 'test_grapher_periodicWave_static', {x:675, y:65, static:true});
                partsCreated.display.displayGroup.append(partsCreated.display.grapher_periodicWave_static);
            //grapher_audioScope
                partsCreated.display.grapher_audioScope = _canvas_.interface.part.builder('display', 'grapher_audioScope', 'test_grapher_audioScope', {x:800, y:0});
                partsCreated.display.displayGroup.append(partsCreated.display.grapher_audioScope);
            //grapher_audioScope (static)
                partsCreated.display.grapher_audioScope_static = _canvas_.interface.part.builder('display', 'grapher_audioScope', 'test_grapher_audioScope_static', {x:800, y:65, static:true});
                partsCreated.display.displayGroup.append(partsCreated.display.grapher_audioScope_static);

            // partsCreated.display.grapher.draw([0,-2,1,-1,2],[0,0.25,0.5,0.75,1]);
            // partsCreated.display.grapher.draw([0,0.25,1],undefined,1);
            // partsCreated.display.grapher_static.draw([0,-2,1,-1,2],[0,0.25,0.5,0.75,1]);
            // partsCreated.display.grapher_static.draw([0,0.25,1],undefined,1);
            // partsCreated.display.grapher_periodicWave.reset();
            // partsCreated.display.grapher_periodicWave.wave([0,0,0.5],'sin');
            // partsCreated.display.grapher_periodicWave.wave([0,0.25],'cos');
            // partsCreated.display.grapher_periodicWave.draw();
            // partsCreated.display.grapher_periodicWave_static.reset();
            // partsCreated.display.grapher_periodicWave_static.wave([0,0,0.5],'sin');
            // partsCreated.display.grapher_periodicWave_static.wave([0,0.25],'cos');
            // partsCreated.display.grapher_periodicWave_static.draw();
            // // partsCreated.display.grapher_audioScope.start(); //this doesn't hold up well
            // partsCreated.display.grapher_audioScope_static.start();
















    //control
        partsCreated.control = {};
        partsCreated.control.controlGroup = _canvas_.interface.part.builder('basic', 'group', 'controlGroup', { x:10, y:350 } );
        _canvas_.system.pane.mm.append(partsCreated.control.controlGroup);
    
        //button
            //button_rectangle
                partsCreated.control.button_rectangle = _canvas_.interface.part.builder('control', 'button_rectangle', 'test_button_rectangle', {
                    x:0, y:0, text_centre:'rectangle', style:{text__hover__colour:{r:1,g:0,b:0,a:1}}
                } );
                partsCreated.control.controlGroup.append(partsCreated.control.button_rectangle);
            //button_circle
                partsCreated.control.button_circle = _canvas_.interface.part.builder( 'control', 'button_circle', 'test_button_circle', {
                    x:15, y:37.5, text_centre:'circle', style:{text__hover__colour:{r:1,g:0,b:0,a:1}}
                } );
                partsCreated.control.controlGroup.append(partsCreated.control.button_circle);
            //button_polygon
                partsCreated.control.button_polygon = _canvas_.interface.part.builder( 'control', 'button_polygon', 'test_button_polygon', {
                    x:0,y:55, points:[{x:0,y:5},{x:5,y:0}, {x:25,y:0},{x:30,y:5}, {x:30,y:25},{x:25,y:30}, {x:5,y:30},{x:0,y:25}],style:{text__hover__colour:{r:1,g:0,b:0,a:1}},
                    text_centre:'polygon'
                } );
                partsCreated.control.controlGroup.append(partsCreated.control.button_polygon);
            //button_image
                partsCreated.control.button_image = _canvas_.interface.part.builder( 'control', 'button_image', 'test_button_image', {
                    x:0, y:87.5,
                    backingURL__off:'/images/testImages/buttonStates/off.png',
                    backingURL__up:'/images/testImages/buttonStates/up.png',
                    backingURL__press:'/images/testImages/buttonStates/press.png',
                    backingURL__select:'/images/testImages/buttonStates/select.png',
                    backingURL__select_press:'/images/testImages/buttonStates/select_press.png',
                    backingURL__glow:'/images/testImages/buttonStates/glow.png',
                    backingURL__glow_press:'/images/testImages/buttonStates/glow_press.png',
                    backingURL__glow_select:'/images/testImages/buttonStates/glow_select.png',
                    backingURL__glow_select_press:'/images/testImages/buttonStates/glow_select_press.png',
                    backingURL__hover:'/images/testImages/buttonStates/hover.png',
                    backingURL__hover_press:'/images/testImages/buttonStates/hover_press.png',
                    backingURL__hover_select:'/images/testImages/buttonStates/hover_select.png',
                    backingURL__hover_select_press:'/images/testImages/buttonStates/hover_select_press.png',
                    backingURL__hover_glow:'/images/testImages/buttonStates/hover_glow.png',
                    backingURL__hover_glow_press:'/images/testImages/buttonStates/hover_glow_press.png',
                    backingURL__hover_glow_select:'/images/testImages/buttonStates/hover_glow_select.png',
                    backingURL__hover_glow_select_press:'/images/testImages/buttonStates/hover_glow_select_press.png',
                } );
                partsCreated.control.controlGroup.append(partsCreated.control.button_image);

        //checkbox
            //checkbox_rectangle
                partsCreated.control.checkbox_rectangle = _canvas_.interface.part.builder('control', 'checkbox_rectangle', 'test_checkbox_rectangle', {x:35, y:0} );
                partsCreated.control.controlGroup.append(partsCreated.control.checkbox_rectangle);
            //checkbox_circle
                partsCreated.control.checkbox_circle = _canvas_.interface.part.builder('control', 'checkbox_circle', 'test_checkbox_circle', {x:45, y:37.5} );
                partsCreated.control.controlGroup.append(partsCreated.control.checkbox_circle);
            //checkbox_polygon
                partsCreated.control.checkbox_polygon = _canvas_.interface.part.builder('control', 'checkbox_polygon', 'test_checkbox_polygon', {
                    x:35, y:55,
                    outterPoints:[{x:0,y:4},{x:4,y:0}, {x:16,y:0},{x:20,y:4}, {x:20,y:16},{x:16,y:20},{x:4,y:20},{x:0,y:16}],
                    innerPoints:[ {x:2,y:4},{x:4,y:2}, {x:16,y:2},{x:18,y:4}, {x:18,y:16},{x:16,y:18}, {x:4,y:18},{x:2,y:16}],
                } );
                partsCreated.control.controlGroup.append(partsCreated.control.checkbox_polygon);
            //checkbox_image
                partsCreated.control.checkbox_image = _canvas_.interface.part.builder('control', 'checkbox_image', 'test_checkbox_image', {
                    x:35, y:87.5,
                    uncheckURL:'/images/testImages/Dore-munchausen-illustration.jpg',
                    checkURL:'/images/testImages/mikeandbrian.jpg',
                } );
                partsCreated.control.controlGroup.append(partsCreated.control.checkbox_image);

        //checkboxGrid
            //checkboxGrid
                partsCreated.control.checkboxgrid = _canvas_.interface.part.builder('control', 'checkboxgrid', 'test_checkboxgrid', {x:60, y:0} );
                partsCreated.control.controlGroup.append(partsCreated.control.checkboxgrid);

        //dial
            //dial_continuous
                partsCreated.control.dial_1_continuous = _canvas_.interface.part.builder('control', 'dial_1_continuous', 'test_dial_1_continuous', {x:160, y:10} );
                partsCreated.control.controlGroup.append(partsCreated.control.dial_1_continuous);
                partsCreated.control.dial_2_continuous = _canvas_.interface.part.builder('control', 'dial_2_continuous', 'test_dial_2_continuous', {x:185, y:10} );
                partsCreated.control.controlGroup.append(partsCreated.control.dial_2_continuous);
            //dial_discrete
                partsCreated.control.dial_1_discrete = _canvas_.interface.part.builder('control', 'dial_1_discrete', 'test_dial_1_discrete', {x:160, y:35} );
                partsCreated.control.controlGroup.append(partsCreated.control.dial_1_discrete);
                partsCreated.control.dial_2_discrete = _canvas_.interface.part.builder('control', 'dial_2_discrete', 'test_dial_2_discrete', {x:185, y:35} );
                partsCreated.control.controlGroup.append(partsCreated.control.dial_2_discrete);
            //dial_continuous_image 
                partsCreated.control.dial_continuous_image = _canvas_.interface.part.builder('control', 'dial_continuous_image', 'test_dial_continuous_image', {
                    x:210, y:10, 
                    handleURL:'/images/testImages/expanded-metal-1.jpg',
                    slotURL:'/images/testImages/dark-background_1048-3848.jpg?size=338&ext=jpg',
                    needleURL:'/images/testImages/41-satin-stainless-steel.jpg',
                } );
                partsCreated.control.controlGroup.append(partsCreated.control.dial_continuous_image);
            //dial_discrete_image
                partsCreated.control.dial_discrete_image = _canvas_.interface.part.builder('control', 'dial_discrete_image', 'test_dial_discrete_image', {
                    x:210, y:35, 
                    handleURL:'/images/testImages/expanded-metal-1.jpg',
                    slotURL:'/images/testImages/dark-background_1048-3848.jpg?size=338&ext=jpg',
                    needleURL:'/images/testImages/41-satin-stainless-steel.jpg',
                } );
                partsCreated.control.controlGroup.append(partsCreated.control.dial_discrete_image);
                
        //slide
            //slide_continuous
                partsCreated.control.slide_continuous = _canvas_.interface.part.builder('control', 'slide_continuous', 'test_slide_continuous', {x:230, y:0} );
                partsCreated.control.controlGroup.append(partsCreated.control.slide_continuous);
            //slide_continuous_image
                partsCreated.control.slide_continuous_image = _canvas_.interface.part.builder('control', 'slide_continuous_image', 'test_slide_continuous_image', {
                    x:245, y:0,
                    handleURL:'/images/testImages/expanded-metal-1.jpg',
                    backingURL:'/images/testImages/41-satin-stainless-steel.jpg',
                } );
                partsCreated.control.controlGroup.append(partsCreated.control.slide_continuous_image);
            //slide_discrete
                partsCreated.control.slide_discrete = _canvas_.interface.part.builder('control', 'slide_discrete', 'test_slide_discrete', {x:260, y:0} );
                partsCreated.control.controlGroup.append(partsCreated.control.slide_discrete);
            //slide_discrete_image
                partsCreated.control.slide_discrete_image = _canvas_.interface.part.builder('control', 'slide_discrete_image', 'test_slide_discrete_image', {
                    x:275, y:0,
                    handleURL:'/images/testImages/expanded-metal-1.jpg',
                    backingURL:'/images/testImages/41-satin-stainless-steel.jpg',
                } );
                partsCreated.control.controlGroup.append(partsCreated.control.slide_discrete_image);
            //slidePanel
                partsCreated.control.slidePanel = _canvas_.interface.part.builder('control', 'slidePanel', 'test_slidePanel', {x:290, y:0} );
                partsCreated.control.controlGroup.append(partsCreated.control.slidePanel);
            //slidePanel_image
                partsCreated.control.slidePanel_image = _canvas_.interface.part.builder('control', 'slidePanel_image', 'test_slidePanel_image', {
                    x:375, y:0,
                    handleURL:'/images/testImages/expanded-metal-1.jpg',
                    backingURL:'/images/testImages/41-satin-stainless-steel.jpg',
                } );
                partsCreated.control.controlGroup.append(partsCreated.control.slidePanel_image);

        //rangeslide
            //rangeslide
                partsCreated.control.rangeslide = _canvas_.interface.part.builder('control', 'rangeslide', 'test_rangeslide', {x:460, y:0} );
                partsCreated.control.controlGroup.append(partsCreated.control.rangeslide);
            //rangeslide_image
                partsCreated.control.rangeslide_image = _canvas_.interface.part.builder('control', 'rangeslide_image', 'test_rangeslide_image', {
                    x:475, y:0,
                    handleURL:'/images/testImages/expanded-metal-1.jpg',
                    backingURL:'/images/testImages/41-satin-stainless-steel.jpg',
                    spanURL:'/images/testImages/dark-background_1048-3848.jpg',
                } );
                partsCreated.control.controlGroup.append(partsCreated.control.rangeslide_image);
                
        //list
            //list
                // partsCreated.control.list = _canvas_.interface.part.builder( 'control', 'list', 'test_list', {
                //     x:612.5, y:0, heightLimit:100, widthLimit:50,
                //     list:[
                //         { type:'space' },
                //         { type:'item', text_left:'item1', text_centre:'', text_right:'', function:function(){console.log('item1 function');} },
                //         { type:'text', text_left:'left', text_centre:'centre', text_right:'right' },
                //         { type:'list', text:'sublist', itemWidth:30,limitWidthTo:32.5, list:[
                //             { type:'space' },
                //             { type:'item', text_left:'item1', text_centre:'', text_right:'', function:function(){console.log('sublist item1 function');} },
                //             { type:'break' },
                //             { type:'item', text_left:'item2', text_centre:'', text_right:'', function:function(){console.log('sublist item2 function');} },
                //             { type:'textbreak', text:'break 1'},
                //             { type:'list', text:'sublist', list:[
                //                 { type:'space' },
                //                 { type:'item', text_left:'item1', text_centre:'', text_right:'', function:function(){console.log('sublist/sublist item1 function');} },
                //                 { type:'break' },
                //                 { type:'item', text_left:'item2', text_centre:'', text_right:'', function:function(){console.log('sublist/sublist item2 function');} },
                //                 { type:'textbreak', text:'break 1'},
                //                 { type:'item', text_left:'item3', text_centre:'', text_right:'', function:function(){console.log('sublist/sublist item3 function');} },
                //                 { type:'space' },
                //             ] },
                //             { type:'item', text_left:'item3', text_centre:'', text_right:'', function:function(){console.log('sublist item3 function');} },
                //             { type:'space' },
                //         ] },
                //         { type:'break' },
                //         { type:'item', text_left:'item2', text_centre:'', text_right:'', function:function(){console.log('item2 function');} },
                //         { type:'textbreak', text:'break 1'},
                //         { type:'item', text_left:'item3', text_centre:'', text_right:'', function:function(){console.log('item3 function');} },
                //         { type:'checkbox', text:'checkable', onclickFunction:function(val){console.log('checkbox:',val);} },
                //         { type:'item', text_left:'item4', text_centre:'', text_right:'', function:function(){console.log('item4 function');} },
                //         { type:'item', text_left:'item5', text_centre:'', text_right:'', function:function(){console.log('item5 function');} },
                //         { type:'textbreak', text:'break 1'},
                //         { type:'item', text_left:'item6', text_centre:'', text_right:'', function:function(){console.log('item6 function');} },
                //         { type:'item', text_left:'item7', text_centre:'', text_right:'', function:function(){console.log('item7 function');} },
                //         { type:'item', text_left:'item8', text_centre:'', text_right:'', function:function(){console.log('item8 function');} },
                //         { type:'item', text_left:'item9', text_centre:'', text_right:'', function:function(){console.log('item9 function');} },
                //         { type:'item', text_left:'item10', text_centre:'', text_right:'', function:function(){console.log('item10 function');} },
                //         { type:'break' },
                //         { type:'item', text_left:'item11', text_centre:'', text_right:'', function:function(){console.log('item11 function');} },
                //         { type:'item', text_left:'item12', text_centre:'', text_right:'', function:function(){console.log('item12 function');} },
                //         { type:'item', text_left:'item13', text_centre:'', text_right:'', function:function(){console.log('item13 function');} },
                //         { type:'item', text_left:'item14', text_centre:'', text_right:'', function:function(){console.log('item14 function');} },
                //         { type:'item', text_left:'item15', text_centre:'', text_right:'', function:function(){console.log('item15 function');} },
                //         { type:'space' },
                //     ]
                // } );
                // partsCreated.control.controlGroup.append(partsCreated.control.list);

            //list_image
        //needleOverlay
            //needleOverlay
        //grapherWaveWorkspace
            //grapher_waveWorkspace
        //sequencer
            //sequencer
















};