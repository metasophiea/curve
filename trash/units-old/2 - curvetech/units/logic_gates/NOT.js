this.NOT = function(name,x,y,angle){
    //unitStyle
        const unitStyle = new function(){
            //image store location URL
                this.imageStoreURL_localPrefix = imageStoreURL+'logic_gates/';

            //calculation of measurements
                const div = 10;
                const measurement = {
                    file: { width:100, height:100 },
                    design: { width:1, height:1 },
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
            model:'NOT',
            x:x, y:y, angle:angle,
            space:[
                { x:0,                             y:0                             },
                { x:unitStyle.drawingValue.width , y:0                             },
                { x:unitStyle.drawingValue.width , y:unitStyle.drawingValue.height },
                { x:0,                             y:unitStyle.drawingValue.height },
            ],
            elements:[
                {collection:'dynamic', type:'connectionNode_signal', name:'out', data:{ 
                    x:unitStyle.drawingValue.width/2-2.5, y:0, width:2.5, height:5, angle:-Math.PI/2, cableVersion:2, style:style.connectionNode.signal,
                }},
                {collection:'dynamic', type:'connectionNode_signal', name:'in', data:{ 
                    x:unitStyle.drawingValue.width/2+2.5, y:unitStyle.drawingValue.height, width:2.5, height:5, angle:Math.PI/2, cableVersion:2, style:style.connectionNode.signal,
                }},
                {collection:'basic', type:'image', name:'backing', 
                    data:{ x:0, y:0, width:unitStyle.drawingValue.width, height:unitStyle.drawingValue.height, url:unitStyle.imageStoreURL_localPrefix+'NOT.png' }
                },
            ]
        });
    
    //circuitry
        let currentInputValue = false;
        // const loopProtection = {
        //     maxChangesPerSecond:100,
        //     changeCount:0,
        //     interval:setInterval(function(){ 
        //         loopProtection.changeCount = 0;
        //         object.io.signal.out.set(!object.io.signal.in.read());
        //     },1000),
        // };
        let delay = 1;
        function updateOutput(A){
            if(delay > 0){ 
                setTimeout(function(){
                    object.io.signal.out.set(!A);
                },delay);
            }else{
                object.io.signal.out.set(!A);
            }
        }

    //wiring
        //io
            object.io.signal.in.onchange = function(value){
                if(value == currentInputValue){return;}
                currentInputValue = value;
                updateOutput(currentInputValue);

                // if(loopProtection.changeCount > loopProtection.maxChangesPerSecond ){return;}
                // loopProtection.changeCount++;
                // updateOutput();
            };

    //setup
        updateOutput(currentInputValue);

    return object;
};
this.NOT.metadata = {
    name:'NOT',
    category:'logic_gates',
    helpURL:'/help/units/curvetech/NOT/'
};