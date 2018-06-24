parts.audio.synthesizer1_gainWobble = function(
    context,
    waveType='sine', periodicWave={'sin':[0,1], 'cos':[0,0]}, 
    gain=1, 
    attack={time:0.01, curve:'linear'}, release={time:0.05, curve:'linear'},
    detune=0, octave=0,
    wobbleDepth=0, wobblePeriod=0
){
    //components
        var mainOut = context.createGain();
            mainOut.gain.setTargetAtTime(gain, context.currentTime, 0);
        var wobbleGain = context.createGain();
            wobbleGain.gain.setTargetAtTime(1, context.currentTime, 0);
        var oscAggregator = context.createGain();
            oscAggregator.gain.setTargetAtTime(1, context.currentTime, 0);

        oscAggregator.connect(wobbleGain);
        wobbleGain.connect(mainOut);

    //live oscillators
        var liveOscillators = {};

    //options
        this.waveType = function(a){if(a==null){return waveType;}waveType=a;};
        this.periodicWave = function(a){if(a==null){return periodicWave;}periodicWave=a;};
        this.gain = function(target,time,curve){
            return changeAudioParam(mainOut.gain,target,time,curve);
        };
        this.attack = function(time,curve){
            if(time==null&&curve==null){return attack;}
            attack.time = time ? time : attack.time;
            attack.curve = curve ? curve : attack.curve;
        };
        this.release = function(time,curve){
            if(time==null&&curve==null){return release;}
            release.time = time ? time : release.time;
            release.curve = curve ? curve : release.curve;
        };
        this.octave = function(a){if(a==null){return octave;}octave=a;};
        this.detune = function(target,time,curve){
            if(a==null){return detune;}detune=a;

            //change stored value for any new oscillators that are made
                var start = detune;
                var mux = target-start;
                var stepsPerSecond = Math.round(Math.abs(mux));
                var totalSteps = stepsPerSecond*time;

                var steps = [1];
                switch(curve){
                    case 'linear': steps = __globals.utility.math.curveGenerator.linear(totalSteps); break;
                    case 'exponential': steps = __globals.utility.math.curveGenerator.exponential(totalSteps); break;
                    case 's': steps = __globals.utility.math.curveGenerator.s(totalSteps,8); break;
                    case 'instant': default: break;
                }
                
                if(steps.length != 0){
                    var interval = setInterval(function(){
                        detune = start+(steps.shift()*mux);
                        if(steps.length == 0){clearInterval(interval);}
                    },1000/stepsPerSecond);
                }

            //instruct liveOscillators to adjust their values
                var OSCs = Object.keys(liveOscillators);
                for(var b = 0; b < OSCs.length; b++){ 
                    liveOscillators[OSCs[b]].osc.detune(target,time,curve);
                }
        };
        this.wobbleDepth = function(value){
            if(value==null){return wobble.high-wobble.low; }
            wobble.high = 1;
            wobble.low = 1 - value;
            this.stopWobble();
            this.startWobble();
        };
        this.wobblePeriod = function(value){
            if(value==null){return wobble.period; }

            wobble.period = value;

            this.stopWobble();
            this.startWobble();
        };

    //output node
        this.out = function(){return mainOut;}

    //oscillator generator
        function makeOSC(
            context, connection, midiNumber,
            type, periodicWave, 
            gain, attack, release,
            detune, octave
        ){
            return new function(){
                this.generator = context.createOscillator();
                    if(type == 'custom'){ 
                        this.generator.setPeriodicWave(
                            context.createPeriodicWave(new Float32Array(periodicWave.cos),new Float32Array(periodicWave.sin))
                        ); 
                    }else{ this.generator.type = type; }
                    this.generator.frequency.setTargetAtTime(__globals.audio.num2freq(midiNumber,octave), context.currentTime, 0);
                    this.generator.detune.setTargetAtTime(detune, context.currentTime, 0);
                    this.generator.start(0);

                this.gain = context.createGain();
                    this.generator.connect(this.gain);
                    this.gain.gain.setTargetAtTime(0, context.currentTime, 0);
                    changeAudioParam(this.gain.gain, gain, attack.time, attack.curve, false);
                    this.gain.connect(connection);

                this.detune = function(target,time,curve){
                    changeAudioParam(this.generator.detune,target,time,curve);
                };
                this.stop = function(){
                    changeAudioParam(this.gain.gain,0,release.time,release.curve, false);
                    setTimeout(function(that){
                        that.gain.disconnect(); 
                        that.generator.stop(); 
                        that.generator.disconnect(); 
                        that.gain=null; 
                        that.generator=null; 
                    }, release.time*1000, this);
                };
            };
        }

    //wobbling gain
        var wobble = {
            phase: true,
            high: 1,
            low: 1-wobbleDepth,
            period: wobblePeriod,
            wave: 's',
            interval : null
        };
        this.startWobble = function(){
            if(wobble.period < 0.01){return;}

            wobble.interval = setInterval(function(){
                if(wobble.phase){ changeAudioParam( wobbleGain.gain, wobble.high, 0.9*wobble.period, wobble.wave ); }
                else{             changeAudioParam( wobbleGain.gain, wobble.low,  0.9*wobble.period, wobble.wave ); }
                wobble.phase = !wobble.phase;
            }, 1000*wobble.period);
        };this.startWobble();
        this.stopWobble = function(){ clearInterval(wobble.interval); };

    //methods
        this.perform = function(note){
            if( !liveOscillators[note.num] && note.velocity == 0 ){/*trying to stop a non-existant tone*/return;}
            else if( !liveOscillators[note.num] ){ 
                //create new tone
                liveOscillators[note.num] = makeOSC(context, oscAggregator, note.num, waveType, periodicWave, note.velocity, attack, release, detune, octave);
            }
            else if( note.velocity == 0 ){ 
                //stop and destroy tone
                liveOscillators[note.num].stop();
                delete liveOscillators[note.num];
            }
            else{
                //adjust tone
                liveOscillators[note.num].osc.changeVelocity(note.velocity);
            }
        };
        this.panic = function(){
            var OSCs = Object.keys(liveOscillators);
            for(var a = 0; a < OSCs.length; a++){ this.perform( {'num':OSCs[a], 'velocity':0} ); }
        };

    //functions
        function changeAudioParam(audioParam,target,time,curve,cancelScheduledValues=true){
            if(target==null){return audioParam.value;}

            if(cancelScheduledValues){
                audioParam.cancelScheduledValues(context.currentTime);
            }
            
            switch(curve){
                case 'linear': 
                    audioParam.linearRampToValueAtTime(target, context.currentTime+time);
                break;
                case 'exponential':
                    console.warn('2018-4-18 - changeAudioParam:exponential doesn\'t work on chrome');
                    if(target == 0){target = 1/10000;}
                    audioParam.exponentialRampToValueAtTime(target, context.currentTime+time);
                break;
                case 's':
                    var mux = target - audioParam.value;
                    var array = __globals.utility.math.curveGenerator.s(10);
                    for(var a = 0; a < array.length; a++){
                        array[a] = audioParam.value + array[a]*mux;
                    }
                    audioParam.setValueCurveAtTime(new Float32Array(array), context.currentTime, time);
                break;
                case 'instant': default:
                    audioParam.setTargetAtTime(target, context.currentTime, 0.001);
                break;
            }
        }
};