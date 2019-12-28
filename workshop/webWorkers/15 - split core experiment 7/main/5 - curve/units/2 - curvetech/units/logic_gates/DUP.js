this.DUP = function(name,x,y,angle){
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
            model:'DUP',
            x:x, y:y, angle:angle,
            space:[
                { x:0,                             y:0                             },
                { x:unitStyle.drawingValue.width , y:0                             },
                { x:unitStyle.drawingValue.width , y:unitStyle.drawingValue.height },
                { x:0,                             y:unitStyle.drawingValue.height },
            ],
            elements:[
                {collection:'dynamic', type:'connectionNode_signal', name:'out_1', data:{ 
                    x:unitStyle.drawingValue.width*(1/4)-2.5, y:2.5+0.5, width:5, height:5, angle:-Math.PI/2-0.1, cableVersion:2, style:style.connectionNode.signal,
                }},
                {collection:'dynamic', type:'connectionNode_signal', name:'out_2', data:{ 
                    x:unitStyle.drawingValue.width*(1/4)+2.5, y:2.5, width:5, height:5, angle:-Math.PI/2+0.1, cableVersion:2, style:style.connectionNode.signal,
                }},
                {collection:'dynamic', type:'connectionNode_signal', name:'in', data:{ 
                    x:unitStyle.drawingValue.width/2+2.5, y:unitStyle.drawingValue.height, width:2.5, height:5, angle:Math.PI/2, cableVersion:2, style:style.connectionNode.signal,
                }},
                {collection:'basic', type:'image', name:'backing', 
                    data:{ x:0, y:0, width:unitStyle.drawingValue.width, height:unitStyle.drawingValue.height, url:unitStyle.imageStoreURL_localPrefix+'DUP.png' }
                },
            ]
        });
    
    //circuitry
        let currentInputValue = false;
        let delay = 1;
        function updateOutput(A){
            if(delay > 0){ 
                setTimeout(function(){
                    object.io.signal.out_1.set(A);
                    object.io.signal.out_2.set(A);
                },delay);
            }else{
                object.io.signal.out_1.set(A);
                object.io.signal.out_2.set(A);
            }
        }

    //wiring
        //io
            object.io.signal.in.onchange = function(value){
                if(value == currentInputValue){return;}
                currentInputValue = value;
                updateOutput(currentInputValue);
            };

    //setup
        updateOutput(currentInputValue);

    return object;
};
this.DUP.metadata = {
    name:'DUP',
    category:'logic_gates',
    helpURL:'/help/units/beta/DUP/'
};