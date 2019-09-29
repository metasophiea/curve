this.signal_duplicator = function(x,y,angle){
    //style data
        var unitStyle = new function(){
            //image store location URL
                this.imageStoreURL_localPrefix = imageStoreURL+'signal_duplicator/';

            //calculation of measurements
                var div = 6;
                var measurement = { 
                    file: { width:260, height:260 },
                    design: { width:4, height:4 },
                };

                this.offset = 20/div;
                this.drawingValue = { 
                    width: measurement.file.width/div, 
                    height: measurement.file.height/div
                };
        };

    //main object creation
        var object = _canvas_.interface.unit.builder({
            name:'signal_duplicator',
            x:x, y:y, angle:angle,
            space:[
                { x:0,                                              y:0                                                      },
                { x:unitStyle.drawingValue.width -unitStyle.offset, y:(unitStyle.drawingValue.height -unitStyle.offset)*0.25 },
                { x:unitStyle.drawingValue.width -unitStyle.offset, y:(unitStyle.drawingValue.height -unitStyle.offset)*0.75 },
                { x:0,                                              y:unitStyle.drawingValue.height -unitStyle.offset        },
            ],
            elements:[
                {collection:'dynamic', type:'connectionNode_signal', name:'input', data:{ 
                    x:unitStyle.drawingValue.width-10/3, y:(unitStyle.drawingValue.height-unitStyle.offset)/2 - 5, width:5, height:10, cableVersion:2, style:style.connectionNode.signal,
                }},
                {collection:'dynamic', type:'connectionNode_signal', name:'output_1', data:{ 
                    x:0, y:(unitStyle.drawingValue.height-unitStyle.offset)/2 - 2.5, width:5, height:10, angle:Math.PI, cableVersion:2, style:style.connectionNode.signal,
                }},
                {collection:'dynamic', type:'connectionNode_signal', name:'output_2', data:{
                    x:0, y:(unitStyle.drawingValue.height-unitStyle.offset)/2 - 2.5 + 15, width:5, height:10, angle:Math.PI, cableVersion:2, style:style.connectionNode.signal,
                }},
                {collection:'basic', type:'image', name:'backing', 
                    data:{ 
                        x:-unitStyle.offset/2, y:-unitStyle.offset/2, 
                        width:unitStyle.drawingValue.width, height:unitStyle.drawingValue.height, 
                        url:unitStyle.imageStoreURL_localPrefix+'backing.png'
                    }
                },
            ]
        });

        //wiring
            //io
                object.io.signal.input.onchange = function(value){ object.io.signal.output_1.set(value); object.io.signal.output_2.set(value); };

    return object;
};
this.signal_duplicator.metadata = {
    name:'Signal Duplicator',
    category:'misc',
    helpURL:'/help/units/beta/signal_duplicator/'
};