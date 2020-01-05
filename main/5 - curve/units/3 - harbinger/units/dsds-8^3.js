this['dsds-8^3'] = function(name,x,y,angle){
    //audio sample URLs
        const samples = [
            [
                // - bass
                '/sounds/78/bass_1.wav',
                '/sounds/78/bass_2.wav',
                '/sounds/808/bass_1.wav',
                '/sounds/808/bass_2.wav',
                '/sounds/808/bass_3.wav',
                '/sounds/SP12/bass_1.wav',
                '/sounds/SP12/bass_2.wav',
                '/sounds/SP12/bass_3.wav',
            ],[
                // - snare
                '/sounds/78/snare_1.wav',
                '/sounds/78/snare_2.wav',
                '/sounds/808/snare_1.wav',
                '/sounds/808/snare_2.wav',
                '/sounds/808/snare_3.wav',
                '/sounds/SP12/snare_1.wav',
                '/sounds/SP12/snare_2.wav',
                '/sounds/SP12/snare_3.wav',
            ],[
                // - hat_closed
                '/sounds/78/hat_closed_1.wav',
                '/sounds/808/hat_closed_1.wav',
                '/sounds/808/hat_closed_2.wav',
                '/sounds/SP12/hat_closed_1.wav',
                '/sounds/SP12/hat_closed_2.wav',
                '/sounds/RetroMachines/hat_closed_1.wav',
                '/sounds/RetroMachines/hat_closed_2.wav',
                '/sounds/ModernMachines/hat_closed_1.wav',
            ],[
                // - hat_open
                '/sounds/78/hat_open_1.wav',
                '/sounds/78/hat_open_2.wav',
                '/sounds/808/hat_open_1.wav',
                '/sounds/808/hat_open_2.wav',
                '/sounds/SP12/hat_open_1.wav',
                '/sounds/SP12/hat_open_2.wav',
                '/sounds/RetroMachines/hat_open_1.wav',
                '/sounds/ModernMachines/hat_open_1.wav',
            ],[
                // misc 1 - 8
                '/sounds/ElectroBump/ride.wav',
                '/sounds/HitMachine/ride.wav',
                '/sounds/808/cowbell.wav',
                '/sounds/SP12/cowbell.wav',
                '/sounds/78/rim.wav',
                '/sounds/808/rim.wav',
                '/sounds/SP12/rim_1.wav',
                '/sounds/SP12/rim_2.wav',
            ],[
                // misc 9 - 16
                '/sounds/SP12/tom_low.wav',
                '/sounds/SP12/tom_mid.wav',
                '/sounds/SP12/tom_high.wav',
                '/sounds/78/maraca.wav',
                '/sounds/808/maraca.wav',
                '/sounds/78/tamb_1.wav',
                '/sounds/78/tamb_2.wav',
                '/sounds/78/tamb_3.wav',
            ],[
                // misc 17 - 24
                '/sounds/78/bongo_low.wav',
                '/sounds/78/bongo_mid.wav',
                '/sounds/78/bongo_high.wav',
                '/sounds/78/gulro_long.wav',
                '/sounds/78/gulro_short.wav',
                '/sounds/78/gulro_high.wav',
                '/sounds/78/clave.wav',
                '/sounds/78/metal.wav',
            ],[
                // misc 25 - 32
                '/sounds/808/clap.wav',
                '/sounds/Grimy909/crash.wav',
                '/sounds/808/conga_low.wav',
                '/sounds/808/conga_mid.wav',
                '/sounds/808/conga_high.wav',
                '/sounds/SP12/conga_low.wav',
                '/sounds/SP12/conga_mid.wav',
                '/sounds/SP12/conga_high.wav',
            ]
        ];
    //style data
        const unitStyle = new function(){
            //image store location URL
                this.imageStoreURL_localPrefix = imageStoreURL+'dsds-8^3/';

            //calculation of measurements
                const div = 10;
                const measurement = { 
                    file: { width:1925, height:820 },
                    design: { width:18.75, height:8 },
                };

                this.offset = {x:2.5,y:1};
                this.drawingValue = { 
                    width: measurement.file.width/div, 
                    height: measurement.file.height/div
                };

            //colours
                this.LED = {
                    glow:{r:1,g:0,b:0,a:1},
                    dim:{r:0.48,g:0.21,b:0.19,a:1},
                };
        };

    //main object creation
        const object = _canvas_.interface.unit.builder({
            name:name,
            model:'dsds-8^3',
            x:x, y:y, angle:angle,
            space:[
                {x:-unitStyle.offset.x,                               y:-unitStyle.offset.y},
                {x:unitStyle.drawingValue.width - unitStyle.offset.x, y:-unitStyle.offset.y},
                {x:unitStyle.drawingValue.width - unitStyle.offset.x, y:unitStyle.drawingValue.height - unitStyle.offset.y},
                {x:-unitStyle.offset.x,                               y:unitStyle.drawingValue.height - unitStyle.offset.y},
            ],
            elements:
                (new Array(8)).fill().flatMap((item,index) => {
                    return [
                        {collection:'dynamic', type:'connectionNode_audio', name:'audio_out_'+index, data:{ 
                            x:10 + index*20, y:0, width:5, height:10, angle:-Math.PI/2, isAudioOutput:true, cableVersion:2, style:style.connectionNode.audio,
                        }},
                        {collection:'dynamic', type:'connectionNode_signal', name:'signal_in_'+index, data:{ 
                            x:20 + index*20, y:80, width:5, height:10, angle:Math.PI/2, cableVersion:2, style:style.connectionNode.signal,
                        }},
                        {collection:'dynamic', type:'connectionNode_voltage', name:'voltage_in_'+index, data:{ 
                            x:20 + index*20, y:75, width:5, height:10, angle:Math.PI/2, cableVersion:2, style:style.connectionNode.voltage,
                        }},
                    ];
                }).concat(
                    [
                        {collection:'dynamic', type:'connectionNode_audio', name:'audio_out_master', data:{ 
                            x:170, y:0, width:5, height:10, angle:-Math.PI/2, isAudioOutput:true, cableVersion:2, style:style.connectionNode.audio,
                        }},
                        {collection:'basic', type:'image', name:'backing', 
                            data:{ x:-unitStyle.offset.x, y:-unitStyle.offset.y, width:unitStyle.drawingValue.width, height:unitStyle.drawingValue.height, url:unitStyle.imageStoreURL_localPrefix+'guide.png' }
                        },
                        {collection:'control', type:'dial_continuous_image', name:'masterVolume', data:{
                            x:175, y:18.5, radius:14/2, startAngle:2.5, maxAngle:4.4, value:0.5, resetValue:0.5,
                            handleURL:unitStyle.imageStoreURL_localPrefix+'dial_large.png',
                        }},
                        {collection:'control', type:'button_image', name:'signal', data:{
                            x:168, y:63, width:6, height:15, hoverable:false,
                            backingURL__up:unitStyle.imageStoreURL_localPrefix+'signal_off.png',
                            backingURL__press:unitStyle.imageStoreURL_localPrefix+'signal_off.png',
                            backingURL__glow:unitStyle.imageStoreURL_localPrefix+'signal_on.png',
                            backingURL__glow_press:unitStyle.imageStoreURL_localPrefix+'signal_on.png',
                        }},
                        {collection:'control', type:'button_image', name:'voltage', data:{
                            x:176, y:63, width:6, height:15, hoverable:false,
                            backingURL__up:unitStyle.imageStoreURL_localPrefix+'voltage_off.png',
                            backingURL__press:unitStyle.imageStoreURL_localPrefix+'voltage_off.png',
                            backingURL__glow:unitStyle.imageStoreURL_localPrefix+'voltage_on.png',
                            backingURL__glow_press:unitStyle.imageStoreURL_localPrefix+'voltage_on.png',
                        }},

                        {collection:'control', type:'button_image', name:'preset_1', data:{
                            x:168, y:27, width:14, height:6.25, hoverable:false,
                            backingURL__up:unitStyle.imageStoreURL_localPrefix+'preset_1_off.png',
                            backingURL__press:unitStyle.imageStoreURL_localPrefix+'preset_1_off.png',
                            backingURL__glow:unitStyle.imageStoreURL_localPrefix+'preset_1_on.png',
                            backingURL__glow_press:unitStyle.imageStoreURL_localPrefix+'preset_1_on.png',
                        }},
                        {collection:'control', type:'button_image', name:'preset_2', data:{
                            x:168, y:34.2, width:14, height:6.25, hoverable:false,
                            backingURL__up:unitStyle.imageStoreURL_localPrefix+'preset_2_off.png',
                            backingURL__press:unitStyle.imageStoreURL_localPrefix+'preset_2_off.png',
                            backingURL__glow:unitStyle.imageStoreURL_localPrefix+'preset_2_on.png',
                            backingURL__glow_press:unitStyle.imageStoreURL_localPrefix+'preset_2_on.png',
                        }},
                        {collection:'control', type:'button_image', name:'preset_3', data:{
                            x:168, y:41.4, width:14, height:6.25, hoverable:false,
                            backingURL__up:unitStyle.imageStoreURL_localPrefix+'preset_3_off.png',
                            backingURL__press:unitStyle.imageStoreURL_localPrefix+'preset_3_off.png',
                            backingURL__glow:unitStyle.imageStoreURL_localPrefix+'preset_3_on.png',
                            backingURL__glow_press:unitStyle.imageStoreURL_localPrefix+'preset_3_on.png',
                        }},
                        {collection:'control', type:'button_image', name:'preset_4', data:{
                            x:168, y:48.6, width:14, height:6.25, hoverable:false,
                            backingURL__up:unitStyle.imageStoreURL_localPrefix+'preset_4_off.png',
                            backingURL__press:unitStyle.imageStoreURL_localPrefix+'preset_4_off.png',
                            backingURL__glow:unitStyle.imageStoreURL_localPrefix+'preset_4_on.png',
                            backingURL__glow_press:unitStyle.imageStoreURL_localPrefix+'preset_4_on.png',
                        }},
                        {collection:'control', type:'button_image', name:'preset_5', data:{
                            x:168, y:55.8, width:14, height:6.25, hoverable:false,
                            backingURL__up:unitStyle.imageStoreURL_localPrefix+'preset_5_off.png',
                            backingURL__press:unitStyle.imageStoreURL_localPrefix+'preset_5_off.png',
                            backingURL__glow:unitStyle.imageStoreURL_localPrefix+'preset_5_on.png',
                            backingURL__glow_press:unitStyle.imageStoreURL_localPrefix+'preset_5_on.png',
                        }},
                    ]
                ).concat(
                    (new Array(8)).fill().flatMap((item,index) => {
                        return [
                            {collection:'control', type:'dial_continuous_image', name:'volume_'+index, data:{
                                x:11 + index*20, y:16.5, radius:9/2, startAngle:2.5, maxAngle:4.4, value:0.5, resetValue:0.5,
                                handleURL:unitStyle.imageStoreURL_localPrefix+'dial_small.png',
                            }},
                            {collection:'control', type:'dial_continuous_image', name:'rate_'+index, data:{
                                x:19 + index*20, y:23.5, radius:9/2, startAngle:2.5, maxAngle:4.4, value:0.5, resetValue:0.5,
                                handleURL:unitStyle.imageStoreURL_localPrefix+'dial_small.png',
                            }},
                            {collection:'control', type:'dial_discrete_image', name:'bank_'+index, data:{
                                x:15 + index*20, y:40, radius:14/2, startAngle:2.5, maxAngle:4.4, value:0, optionCount:8, 
                                handleURL:unitStyle.imageStoreURL_localPrefix+'dial_large.png',
                            }},
                            {collection:'display', type:'glowbox_circle', name:'channelStatusLED_'+index, data:{
                                x:20 + index*20, y:49, radius:2/2, capType:'round', style:unitStyle.LED
                            }},
                            {collection:'control', type:'dial_discrete_image', name:'sample_'+index, data:{
                                x:15 + index*20, y:60, radius:14/2, startAngle:2.5, maxAngle:4.4, value:0, optionCount:8, 
                                handleURL:unitStyle.imageStoreURL_localPrefix+'dial_large.png',
                            }},
                            {collection:'display', type:'glowbox_path', name:'channelFireLED_'+index, data:{
                                x:10 + index*20, y:69.5, points:[{x:0,y:0},{x:10,y:0}], capType:'round', style:unitStyle.LED
                            }},
                            {collection:'control', type:'button_image', name:'fire_'+index, data:{
                                x:8 + index*20, y:72, width:14, height:6, hoverable:false,
                                backingURL__up:unitStyle.imageStoreURL_localPrefix+'fire_up.png',
                                backingURL__press:unitStyle.imageStoreURL_localPrefix+'fire_down.png',
                            }},
                        ];
                    })
                )
        });

    //circuitry
        const state = {
            presetSettingTimeout:1000,
            inputMode:'signal',
            presets:[
                [
                    {bank:0,sample:0,rate:0.5,volume:0.5},
                    {bank:1,sample:0,rate:0.5,volume:0.5},
                    {bank:2,sample:0,rate:0.5,volume:0.5},
                    {bank:3,sample:0,rate:0.5,volume:0.5},
                    {bank:4,sample:0,rate:0.5,volume:0.5},
                    {bank:5,sample:0,rate:0.5,volume:0.5},
                    {bank:6,sample:0,rate:0.5,volume:0.5},
                    {bank:7,sample:0,rate:0.5,volume:0.5},
                ],
                [
                    {bank:0,sample:1,rate:0.5,volume:0.5},
                    {bank:1,sample:1,rate:0.5,volume:0.5},
                    {bank:2,sample:1,rate:0.5,volume:0.5},
                    {bank:3,sample:1,rate:0.5,volume:0.5},
                    {bank:4,sample:1,rate:0.5,volume:0.5},
                    {bank:5,sample:1,rate:0.5,volume:0.5},
                    {bank:6,sample:1,rate:0.5,volume:0.5},
                    {bank:7,sample:1,rate:0.5,volume:0.5},
                ],
                [
                    {bank:0,sample:2,rate:0.5,volume:0.5},
                    {bank:1,sample:2,rate:0.5,volume:0.5},
                    {bank:2,sample:2,rate:0.5,volume:0.5},
                    {bank:3,sample:2,rate:0.5,volume:0.5},
                    {bank:4,sample:2,rate:0.5,volume:0.5},
                    {bank:5,sample:2,rate:0.5,volume:0.5},
                    {bank:6,sample:2,rate:0.5,volume:0.5},
                    {bank:7,sample:2,rate:0.5,volume:0.5},
                ],
                [
                    {bank:0,sample:3,rate:0.5,volume:0.5},
                    {bank:1,sample:3,rate:0.5,volume:0.5},
                    {bank:2,sample:3,rate:0.5,volume:0.5},
                    {bank:3,sample:3,rate:0.5,volume:0.5},
                    {bank:4,sample:3,rate:0.5,volume:0.5},
                    {bank:5,sample:3,rate:0.5,volume:0.5},
                    {bank:6,sample:3,rate:0.5,volume:0.5},
                    {bank:7,sample:3,rate:0.5,volume:0.5},
                ],
                [
                    {bank:0,sample:4,rate:0.5,volume:0.5},
                    {bank:1,sample:4,rate:0.5,volume:0.5},
                    {bank:2,sample:4,rate:0.5,volume:0.5},
                    {bank:3,sample:4,rate:0.5,volume:0.5},
                    {bank:4,sample:4,rate:0.5,volume:0.5},
                    {bank:5,sample:4,rate:0.5,volume:0.5},
                    {bank:6,sample:4,rate:0.5,volume:0.5},
                    {bank:7,sample:4,rate:0.5,volume:0.5},
                ],
            ],
        };

        const channelData = (new Array(8)).fill().map((item,index) => {
            return { bank:0, sample:0, rate:1, volume:1 }
        });

        const samplePlayers = (new Array(8)).fill().map((item,index) => {
            const player = new _canvas_.interface.circuit.player(_canvas_.library.audio.context);
            player.concurrentPlayCountLimit(-1);
            player.out_right().connect( object.io.audio['audio_out_'+index].in() );
            player.out_left().connect( object.io.audio['audio_out_master'].in() );
            return player;
        });

        function fire(channel){
            samplePlayers[channel].start();
            object.elements.glowbox_path['channelFireLED_'+channel].on();
            setTimeout(object.elements.glowbox_path['channelFireLED_'+channel].off, 100);
        }
        function loadSample(channel,bank,sample){
            setChannelStatusLED(channel,'loading');
            samplePlayers[channel].load(
                'url',
                () => { setChannelStatusLED(channel,'ready'); }, 
                samples[bank][sample],
                () => { setChannelStatusLED(channel,'error'); }, 
            );
        }
        function setOutputConnectionNodes(mode){
            if(mode != 'signal' && mode != 'voltage'){return;}
            if(state.inputMode == mode){return;}
            state.inputMode = mode;

            const duration = 500;
            const detail = 30;
            const zero2five = _canvas_.library.math.curveGenerator.s(detail,0,5);
            const five2zero = _canvas_.library.math.curveGenerator.s(detail,5,0);

            if(mode == 'signal'){
                for(let a = 0; a < 8; a++){
                    object.elements.connectionNode_voltage['voltage_in_'+a].disconnect();
                    object.elements.connectionNode_voltage['voltage_in_'+a].set(0);
                    
                    for(let b = 0; b < detail; b++){
                        setTimeout(()=>{
                            object.elements.connectionNode_signal['signal_in_'+a].y(80 - five2zero[b]);
                            object.elements.connectionNode_voltage['voltage_in_'+a].y(80 - zero2five[b]);
                        },
                        (duration/detail)*b);
                    }
                }
            }else if(mode == 'voltage'){
                for(let a = 0; a < 8; a++){
                    object.elements.connectionNode_signal['signal_in_'+a].disconnect();
                    object.elements.connectionNode_signal['signal_in_'+a].set(false);
                    for(let b = 0; b < detail; b++){
                        setTimeout(()=>{
                            object.elements.connectionNode_signal['signal_in_'+a].y(80 - zero2five[b]);
                            object.elements.connectionNode_voltage['voltage_in_'+a].y(80 - five2zero[b]);
                        },
                        (duration/detail)*b);
                    }
                }
            }

            if(state.inputMode == 'signal'){
                object.elements.button_image.signal.glow(true);
                object.elements.button_image.voltage.glow(false);
            }else if(state.inputMode == 'voltage'){
                object.elements.button_image.signal.glow(false);
                object.elements.button_image.voltage.glow(true);
            }
        }
        const intervals = [];
        function setChannelStatusLED(channel,status){
            if( intervals[channel] != undefined && intervals[channel].interval != undefined ){
                clearInterval(intervals[channel].interval);
            }
            const led = object.elements.glowbox_circle['channelStatusLED_'+channel];

            switch(status){
                case 'ready':
                    led.on();
                break;
                case 'loading':
                    intervals[channel] = {};
                    intervals[channel].flip = true;
                    intervals[channel].interval = setInterval(() => {
                        intervals[channel].flip ? led.on() : led.off();
                        intervals[channel].flip = !intervals[channel].flip;
                    },250);
                break;
                case 'error':
                    led.off();
                break;
            }
        }
        function selectPreset(preset){
            for(let a = 1; a <= 5; a++){
                object.elements.button_image['preset_'+a].glow(false);
            }
            object.elements.button_image['preset_'+preset].glow(true);

            state.presets[preset-1].forEach((set,index) => {
                object.elements.dial_continuous_image['volume_'+index].set(set.volume);
                object.elements.dial_continuous_image['rate_'+index].set(set.rate);
                object.elements.dial_discrete_image['bank_'+index].set(set.bank);
                object.elements.dial_discrete_image['sample_'+index].set(set.sample);
            });
        }
        function savePreset(block){
            state.presets[block] = [
                {
                    bank:object.elements.dial_discrete_image['bank_'+0].get(), 
                    sample:object.elements.dial_discrete_image['sample_'+0].get(), 
                    rate:object.elements.dial_continuous_image['rate_'+0].get(), 
                    volume:object.elements.dial_continuous_image['volume_'+0].get()
                },
                {
                    bank:object.elements.dial_discrete_image['bank_'+1].get(), 
                    sample:object.elements.dial_discrete_image['sample_'+1].get(), 
                    rate:object.elements.dial_continuous_image['rate_'+1].get(), 
                    volume:object.elements.dial_continuous_image['volume_'+1].get()
                },
                {
                    bank:object.elements.dial_discrete_image['bank_'+2].get(), 
                    sample:object.elements.dial_discrete_image['sample_'+2].get(), 
                    rate:object.elements.dial_continuous_image['rate_'+2].get(), 
                    volume:object.elements.dial_continuous_image['volume_'+2].get()
                },
                {
                    bank:object.elements.dial_discrete_image['bank_'+3].get(), 
                    sample:object.elements.dial_discrete_image['sample_'+3].get(), 
                    rate:object.elements.dial_continuous_image['rate_'+3].get(), 
                    volume:object.elements.dial_continuous_image['volume_'+3].get()
                },
                {
                    bank:object.elements.dial_discrete_image['bank_'+4].get(), 
                    sample:object.elements.dial_discrete_image['sample_'+4].get(), 
                    rate:object.elements.dial_continuous_image['rate_'+4].get(), 
                    volume:object.elements.dial_continuous_image['volume_'+4].get()
                },
                {
                    bank:object.elements.dial_discrete_image['bank_'+5].get(), 
                    sample:object.elements.dial_discrete_image['sample_'+5].get(), 
                    rate:object.elements.dial_continuous_image['rate_'+5].get(), 
                    volume:object.elements.dial_continuous_image['volume_'+5].get()
                },
                {
                    bank:object.elements.dial_discrete_image['bank_'+6].get(), 
                    sample:object.elements.dial_discrete_image['sample_'+6].get(), 
                    rate:object.elements.dial_continuous_image['rate_'+6].get(), 
                    volume:object.elements.dial_continuous_image['volume_'+6].get()
                },
                {
                    bank:object.elements.dial_discrete_image['bank_'+7].get(), 
                    sample:object.elements.dial_discrete_image['sample_'+7].get(), 
                    rate:object.elements.dial_continuous_image['rate_'+7].get(), 
                    volume:object.elements.dial_continuous_image['volume_'+7].get()
                },
            ];

            object.elements.button_image['preset_'+(block+1)].glow(false);
            setTimeout(() => { object.elements.button_image['preset_'+(block+1)].glow(true); },200);
            setTimeout(() => { object.elements.button_image['preset_'+(block+1)].glow(false); },400);
            setTimeout(() => { object.elements.button_image['preset_'+(block+1)].glow(true); },600);
            setTimeout(() => { object.elements.button_image['preset_'+(block+1)].glow(false); },800);
        }

    //wiring
        //hid
            object.elements.button_image.signal.onpress = function(){
                setOutputConnectionNodes('signal');
            };
            object.elements.button_image.voltage.onpress = function(){
                setOutputConnectionNodes('voltage');
            };
            for(let a = 0; a < 8; a++){
                object.elements.dial_continuous_image['volume_'+a].onchange = function(value){
                    channelData[a].volume = value;
                };
                object.elements.dial_continuous_image['rate_'+a].onchange = function(value){
                    channelData[a].rate = value;
                    if(channelData[a].rate <= 0.1){ channelData[a].rate = 0.1; }
                    samplePlayers[a].rate( 2*channelData[a].rate );
                };
                object.elements.dial_discrete_image['bank_'+a].onchange = function(value){
                    channelData[a].bank = value;
                    loadSample(a,channelData[a].bank,channelData[a].sample);
                };
                object.elements.dial_discrete_image['sample_'+a].onchange = function(value){
                    channelData[a].sample = value;
                    loadSample(a,channelData[a].bank,channelData[a].sample);
                };
                object.elements.button_image['fire_'+a].onpress = function(){
                    fire(a);
                };
            }

            object.elements.button_image.preset_1.onpress = function(){
                object.elements.button_image.preset_1.pressed = true;
                setTimeout(() => { if(object.elements.button_image.preset_1.pressed){savePreset(0);} }, state.presetSettingTimeout);
            };
            object.elements.button_image.preset_1.onrelease = function(){
                object.elements.button_image.preset_1.pressed = false;
                selectPreset(1);
            };
            object.elements.button_image.preset_2.onpress = function(){ 
                object.elements.button_image.preset_2.pressed = true;
                setTimeout(() => { if(object.elements.button_image.preset_2.pressed){savePreset(1);} }, state.presetSettingTimeout);
            };
            object.elements.button_image.preset_2.onrelease = function(){ 
                object.elements.button_image.preset_2.pressed = false;
                selectPreset(2);
            };
            object.elements.button_image.preset_3.onpress = function(){ 
                object.elements.button_image.preset_3.pressed = true;
                setTimeout(() => { if(object.elements.button_image.preset_3.pressed){savePreset(2);} }, state.presetSettingTimeout);
            };
            object.elements.button_image.preset_3.onrelease = function(){ 
                object.elements.button_image.preset_3.pressed = false;
                selectPreset(3);
            };
            object.elements.button_image.preset_4.onpress = function(){ 
                object.elements.button_image.preset_4.pressed = true;
                setTimeout(() => { if(object.elements.button_image.preset_4.pressed){savePreset(4);} }, state.presetSettingTimeout);
            };
            object.elements.button_image.preset_4.onrelease = function(){ 
                object.elements.button_image.preset_4.pressed = false;
                selectPreset(4);
            };
            object.elements.button_image.preset_5.onpress = function(){ 
                object.elements.button_image.preset_5.pressed = true;
                setTimeout(() => { if(object.elements.button_image.preset_5.pressed){savePreset(5);} }, state.presetSettingTimeout);
            };
            object.elements.button_image.preset_5.onrelease = function(){ 
                object.elements.button_image.preset_5.pressed = false;
                selectPreset(5);
            };

        //keycapture
            // object.elements.image.backing.attachCallback('onkeydown', function(x,y,event){
            // });
            // object.elements.image.backing.attachCallback('onkeyup', function(x,y,event){
            // });

        //io
            for(let a = 0; a < 8; a++){
                object.io.signal['signal_in_'+a].onchange = function(value){
                    if(!value){return}
                    fire(a);
                } 
            }

    //interface
        object.i = {
        };

    //import/export
        object.exportData = function(){
        };
        object.importData = function(data){
        };

    //setup/tearDown
        object.oncreate = function(){
            loadSample(0,0,0);
            for(let a = 1; a < 8; a++){
                object.elements.dial_discrete_image['bank_'+a].set(a);
            }
            object.elements.button_image.signal.glow(true);
            selectPreset(1);
        };
        object.ondelete = function(){
            intervals.forEach(interval => {
                clearInterval(interval.interval);
            });
        };

    return object;
};
this['dsds-8^3'].metadata = {
    name:'DSDS-8^3',
    category:'',
    helpURL:'/help/units/harbinger/dsds-8^3/'
};