class oscillator_type_1 extends AudioWorkletNode {
    static wasm_url = 'wasm/audio_processing/oscillator_type_1.production.wasm';
    // static wasm_url = 'wasm/audio_processing/oscillator_type_1.development.wasm';
    static fetch_promise;
    static compiled_wasm;

    constructor(context, options={}){
        //populate options
            options.numberOfInputs = 3;
            options.numberOfOutputs = 1;
            options.channelCount = 1;

        //generate class instance
            super(context, 'oscillator_type_1', options);

        //load wasm processor
            audio.audioWorklet.requestWasm(oscillator_type_1, this);

        //instance state
            this._state = {
                gain_useControl: false,
                detune_useControl: false,
                dutyCycle_useControl: false,

                waveform: 'sine',
            };

        //shutdown
            this.shutdown = function(){
                this.port.postMessage({command:'shutdown', value:undefined});
                this.port.close();
            };
    }

    //frequency
        get frequency(){
            return this.parameters.get('frequency');
        }
    
    //gain
        get gain(){
            return this.parameters.get('gain');
        }
        get gain_useControl(){
            return this._state.gain_useControl;
        }
        set gain_useControl(bool){
            this._state.gain_useControl = bool;
            this.port.postMessage({command:'gain_useControl', value:bool});
        }

    //detune
        get detune(){
            return this.parameters.get('detune');
        }
        get detune_useControl(){
            return this._state.detune_useControl;
        }
        set detune_useControl(bool){
            this._state.detune_useControl = bool;
            this.port.postMessage({command:'detune_useControl', value:bool});
        }

    //dutyCycle
        get dutyCycle(){
            return this.parameters.get('dutyCycle');
        }
        get dutyCycle_useControl(){
            return this._state.dutyCycle_useControl;
        }
        set dutyCycle_useControl(bool){
            this._state.dutyCycle_useControl = bool;
            this.port.postMessage({command:'dutyCycle_useControl', value:bool});
        }

    //waveform
        get waveform(){
            return this._state.waveform;
        }
        set waveform(value){ // sine / square / triangle / noise
            this._state.waveform = value;
            this.port.postMessage({command:'waveform', value:value});
        }
}