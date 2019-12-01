_canvas_.interface = new function(){
    this.versionInformation = { tick:0, lastDateModified:{y:'????',m:'??',d:'??'} };
    const interface = this;

    const dev = {
        prefix:'interface',
        channels:{
            circuit:{       prefix:'circuit',                   active:false,   fontStyle:'color:rgb(195, 81, 172); font-style:italic;' },
            part:{          prefix:'part',                      active:false,  fontStyle:'color:rgb(81, 178, 223); font-style:italic;' },
            partBasic:{     prefix:'part.collection.basic',     active:false,  fontStyle:'color:rgb(229, 96, 83); font-style:italic;'  },
            partDisplay:{   prefix:'part.collection.display',   active:false,  fontStyle:'color:rgb(99, 196, 129); font-style:italic;' },
            partControl:{   prefix:'part.collection.control',   active:false,  fontStyle:'color:rgb(243, 194, 95); font-style:italic;' },
            partDynamic:{   prefix:'part.collection.display',   active:false,  fontStyle:'color:rgb(24, 53, 157); font-style:italic;'  },
            unit:{          prefix:'unit',                      active:false,   fontStyle:'color:rgb(66, 145, 115); font-style:italic;' },
        },
        log: {},
    };
    Object.keys(dev.channels).forEach(channel => {
        dev.log[channel]  = function(data){
            if(!dev.channels[channel].active){return;}
            console.log('%c'+dev.prefix+'.'+dev.channels[channel].prefix+(new Array(...arguments).join(' ')), dev.channels[channel].fontStyle );
        }
    });
    dev.testLoggers = function(){
        Object.keys(dev.channels).forEach(channel => {
            const temp = dev.circuit[channel];
            dev.channels[channel].active = true;
            dev.log[channel]('.testLoggers -> '+channel);
            dev.channels[channel].active = temp;
        });
    };

    this.circuit = new function(){
        {{include:circuit/main.js}}
    };
    this.part = new function(){
        {{include:part/main.js}}
    };
    this.unit = new function(){
        // {{include:unit/main.js}}
    };
};

_canvas_.system.go = function(){
    _canvas_.layers.registerLayerLoaded('interface',_canvas_.interface);
    if(_canvas_.interface.go){_canvas_.interface.go();}
};