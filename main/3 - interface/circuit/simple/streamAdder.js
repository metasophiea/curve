this.streamAdder = function(
    context
){
    //flow
        //flow chain
            const flow = {
                input_1:{},
                input_2:{},
                mixControl:{},
                streamAdder:{}
            };

        //inputs
            flow.input_1 = {
                node: new _canvas_.library.audio.audioWorklet.production.only_js.nothing(context),
            };
            flow.input_2 = {
                node: new _canvas_.library.audio.audioWorklet.production.only_js.nothing(context),
            };

        //mixControl
            flow.mixControl = {
                node: new _canvas_.library.audio.audioWorklet.production.only_js.nothing(context),
            };
            
        //gain
            flow.streamAdder = {
                mode: false,
                mix: 1,
                node: new _canvas_.library.audio.audioWorklet.production.wasm.streamAdder(context),
            };

        flow.input_1.node.connect(flow.streamAdder.node, undefined, 0);
        flow.input_2.node.connect(flow.streamAdder.node, undefined, 1);
        flow.mixControl.node.connect(flow.streamAdder.node, undefined, 2);

    //input/output
        this.in_1 = function(){return flow.input_1.node;}
        this.in_2 = function(){return flow.input_2.node;}
        this.mixControl = function(){return flow.mixControl.node;}
        this.out = function(){return flow.streamAdder.node;}

    //shutdown
        this.shutdown = function(){
            flow.input_1.node.shutdown();
            flow.input_2.node.shutdown();
            flow.mixControl.node.shutdown();
            flow.streamAdder.node.shutdown();

            flow.input_1.node.disconnect(flow.streamAdder.node);
            flow.input_2.node.disconnect(flow.streamAdder.node);
            flow.mixControl.node.disconnect(flow.streamAdder.node);
        }

    //controls
        this.mode = function(value){
            if(value == undefined){ return flow.streamAdder.mode; }
            flow.streamAdder.mode = value;
            flow.streamAdder.node.mode = value;
        };
        this.mix = function(value){
            if(value == undefined){ return flow.streamAdder.mix; }
            flow.streamAdder.mix = value;
            _canvas_.library.audio.changeAudioParam(context, flow.streamAdder.node.mix, value, 0.01, 'instant', true);
        };
};