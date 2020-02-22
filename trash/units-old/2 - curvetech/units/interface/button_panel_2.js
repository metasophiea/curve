this.button_panel_2 = function(name,x,y,angle){
    //unitStyle
        const unitStyle = new function(){
            //image store location URL
                this.imageStoreURL_localPrefix = imageStoreURL+'button_panel/';

            //calculation of measurements
                const div = 10;
                const measurement = { 
                    file: { width:310, height:300 },
                    design: { width:3.1, height:3 },
                };

                this.offset = 20/div;
                this.drawingValue = { 
                    width: measurement.file.width/div, 
                    height: measurement.file.height/div
                };
        };

    //main object creation
        const object = _canvas_.interface.unit.builder({
            name:name,
            model:'button_panel_2',
            x:x, y:y, angle:angle,
            space:[
                { x:0,                             y:0                             },
                { x:unitStyle.drawingValue.width , y:0                             },
                { x:unitStyle.drawingValue.width , y:unitStyle.drawingValue.height },
                { x:0,                             y:unitStyle.drawingValue.height },
            ],
            elements:[
                {collection:'dynamic', type:'connectionNode_signal', name:'out_1', data:{ 
                    x:5, y:0, width:5, height:10, angle:-Math.PI/2, cableVersion:2, style:style.connectionNode.signal,
                }},
                {collection:'dynamic', type:'connectionNode_signal', name:'out_2', data:{ 
                    x:5 + 11, y:0, width:5, height:10, angle:-Math.PI/2, cableVersion:2, style:style.connectionNode.signal,
                }},
                {collection:'basic', type:'image', name:'backing', 
                    data:{ x:0, y:0, width:unitStyle.drawingValue.width, height:unitStyle.drawingValue.height, url:unitStyle.imageStoreURL_localPrefix+'2_backing.png' }
                },
                {collection:'control', type:'button_image', name:'button_1', data:{
                    x:5, y:10, width:10, height:15, hoverable:false, 
                    backingURL__up:unitStyle.imageStoreURL_localPrefix+'key_up.png',
                    backingURL__press:unitStyle.imageStoreURL_localPrefix+'key_down.png',
                }},
                {collection:'control', type:'button_image', name:'button_2', data:{
                    x:5 + 11, y:10, width:10, height:15, hoverable:false, 
                    backingURL__up:unitStyle.imageStoreURL_localPrefix+'key_up.png',
                    backingURL__press:unitStyle.imageStoreURL_localPrefix+'key_down.png',
                }},
            ]
        });

    //wiring
        //hid
            object.elements.button_image.button_1.onpress = function(){   object.io.signal.out_1.set(true);  };
            object.elements.button_image.button_1.onrelease = function(){ object.io.signal.out_1.set(false); };
            object.elements.button_image.button_2.onpress = function(){   object.io.signal.out_2.set(true);  };
            object.elements.button_image.button_2.onrelease = function(){ object.io.signal.out_2.set(false); };
        //keycapture
            const keyCodes = [ 49, 50 ];
            object.elements.image.backing.attachCallback('onkeydown', function(x,y,event){
                if( keyCodes.includes(event.keyCode) ){
                    object.elements.button_image['button_'+(keyCodes.indexOf(event.keyCode)+1)].press();
                }
            });
            object.elements.image.backing.attachCallback('onkeyup', function(x,y,event){
                if( keyCodes.includes(event.keyCode) ){
                    object.elements.button_image['button_'+(keyCodes.indexOf(event.keyCode)+1)].release();
                }
            });

    //interface
        object.i = {
            press:function(button){ object.elements.button_image['button_'+button].press(); },
            release:function(button){ object.elements.button_image['button_'+button].release(); },
        };

    return object;
};
this.button_panel_2.metadata = {
    name:'Button Panel - Type B',
    category:'interface',
    helpURL:'/help/units/curvetech/button_panel_2/'
};