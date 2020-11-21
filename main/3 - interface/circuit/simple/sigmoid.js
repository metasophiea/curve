this.sigmoid = function(
    context
){
    //flow
        //flow chain
            const flow = {
                sigmoid:{}
            };

    //sigmoid
        flow.sigmoid = {
            gain: 1,
            sharpness: 0,
            node: new _canvas_.library.audio.audioWorklet.production.wasm.sigmoid(context),
        };

    //input/output node
        this.in = function(){return flow.sigmoid.node;}
        this.out = function(a){return flow.sigmoid.node;}

    //shutdown
        this.shutdown = function(){
            flow.sigmoid.node.shutdown();
        }

    //controls
        this.gain = function(value){
            if(value == undefined){ return flow.sigmoid.gain; }
            if(value > 1){value = 1;}
            if(value < 0){value = 0;}
            flow.sigmoid.gain = value;
            _canvas_.library.audio.changeAudioParam(context, flow.sigmoid.node.gain, value, 0.01, 'instant', true);
        };
        this.sharpness = function(value){
            if(value == undefined){ return flow.sigmoid.sharpness; }
            if(value > 1){value = 1;}
            if(value < 0){value = 0;}
            flow.sigmoid.sharpness = value;
            _canvas_.library.audio.changeAudioParam(context, flow.sigmoid.node.sharpness, value, 0.01, 'instant', true);
        };
};