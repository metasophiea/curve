this.amplitudeModifier = function(
    context
){
    //flow
        //flow chain
            const flow = {
                amplitudeModifierNode:{}
            };

    //amplitudeModifierNode
        flow.amplitudeModifierNode = {
            invert: false,
            offset: 0,
            divisor: 1,
            ceiling:10,
            floor:-10,
            node: context.createAmplitudeModifier(),
        };

    //input/output node
        this.in = function(){return flow.amplitudeModifierNode.node;}
        this.out = function(a){return flow.amplitudeModifierNode.node;}

    //controls
        this.invert = function(value){
            if(value == undefined){ return flow.amplitudeModifierNode.invert; }
            flow.amplitudeModifierNode.invert = value;
            flow.amplitudeModifierNode.node.parameters.get('invert').setValueAtTime(value?1:0,0);
        };
        this.offset = function(value){
            if(value == undefined){ return flow.amplitudeModifierNode.offset; }
            flow.amplitudeModifierNode.offset = value;
            flow.amplitudeModifierNode.node.parameters.get('offset').setValueAtTime(value,0);
        };
        this.divisor = function(value){
            if(value == undefined){ return flow.amplitudeModifierNode.divisor; }
            flow.amplitudeModifierNode.divisor = value;
            flow.amplitudeModifierNode.node.parameters.get('divisor').setValueAtTime(value,0);
        };
        this.ceiling = function(value){
            if(value == undefined){ return flow.amplitudeModifierNode.ceiling; }
            flow.amplitudeModifierNode.ceiling = value;
            flow.amplitudeModifierNode.node.parameters.get('ceiling').setValueAtTime(value,0);
        };
        this.floor = function(value){
            if(value == undefined){ return flow.amplitudeModifierNode.floor; }
            flow.amplitudeModifierNode.floor = value;
            flow.amplitudeModifierNode.node.parameters.get('floor').setValueAtTime(value,0);
        };
};