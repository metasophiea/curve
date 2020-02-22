this.stableAmplitudeGenerator = function(
    context
){
    //flow
        //flow chain
            const flow = {
                stableAmplitudeGeneratorNode:{}
            };

    //stableAmplitudeGeneratorNode
        flow.stableAmplitudeGeneratorNode = {
            amplitude: 0,
            node: new _canvas_.library.audio.audioWorklet.stableAmplitudeGenerator(context),
        };
        
    //input/output node
        this.out = function(a){return flow.stableAmplitudeGeneratorNode.node;}

    //controls
        this.amplitude = function(value){
            if(value == undefined){ return flow.amplitudeModifierNode.amplitude; }
            flow.amplitudeModifierNode.amplitude = value;
            _canvas_.library.audio.changeAudioParam(context, flow.amplitudeModifierNode.node.amplitude, value, 0.01, 'instant', true);
        };
};