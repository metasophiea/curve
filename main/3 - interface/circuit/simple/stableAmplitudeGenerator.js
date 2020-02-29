this.stableAmplitudeGenerator = function(
    context
){
    //flow
        //flow chain
            const flow = {
                stableAmplitudeGenerator:{}
            };

    //stableAmplitudeGenerator
        flow.stableAmplitudeGenerator = {
            amplitude: 0,
            node: new _canvas_.library.audio.audioWorklet.stableAmplitudeGenerator(context),
        };
        
    //input/output node
        this.out = function(){ return flow.stableAmplitudeGenerator.node; }

    //controls
        this.amplitude = function(value){
            if(value == undefined){ return flow.stableAmplitudeGenerator.amplitude; }
            flow.stableAmplitudeGenerator.amplitude = value;
            _canvas_.library.audio.changeAudioParam(context, flow.stableAmplitudeGenerator.node.amplitude, value, 0.01, 'instant', true);
        };
};