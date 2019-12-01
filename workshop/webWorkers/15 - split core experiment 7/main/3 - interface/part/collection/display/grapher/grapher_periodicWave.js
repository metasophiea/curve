this.grapher_periodicWave = function(
    name='grapher_periodicWave',
    x, y, width=120, height=60, angle=0, static=false, resolution=5, 

    foregroundStyle={colour:{r:0,g:1,b:0,a:1}, thickness:0.5},
    foregroundTextStyle={colour:{r:0.39,g:1,b:0.39,a:1}, size:7.5, font:'Helvetica'},

    backgroundStyle_colour={r:0,g:0.39,b:0,a:1},
    backgroundStyle_lineThickness=0.25,
    backgroundTextStyle_fill={r:0,g:0.59,b:0,a:1},
    backgroundTextStyle_size=0.1,
    backgroundTextStyle_font='Helvetica',

    backingStyle={r:0.2,g:0.2,b:0.2,a:1},
){
    let wave = {'sin':[],'cos':[]};
    let waveResolution = 50;

    //elements 
        //main
            var object = interfacePart.builder('basic','group',name,{x:x, y:y, angle:angle});
        //grapher
            var grapher = interfacePart.builder('display','grapher',name,{
                x:0, y:0, width:width, height:height, static:static, resolution:resolution,
                foregroundStyles:[foregroundStyle], foregroundTextStyles:[foregroundTextStyle],
                backgroundStyle_colour:backgroundStyle_colour, 
                backgroundStyle_lineThickness:backgroundStyle_lineThickness,
                backgroundTextStyle_fill:backgroundTextStyle_fill, 
                backgroundTextStyle_size:backgroundTextStyle_size,
                backgroundTextStyle_font:backgroundTextStyle_font,
                backingStyle:backingStyle,
            });
            object.append(grapher);

    //controls
        object.wave = function(a=null,type=null){
            if(a==null){
                while(wave.sin.length < wave.cos.length){ wave.sin.push(0); }
                while(wave.sin.length > wave.cos.length){ wave.cos.push(0); }
                for(var a = 0; a < wave['sin'].length; a++){
                    if( !wave['sin'][a] ){ wave['sin'][a] = 0; }
                    if( !wave['cos'][a] ){ wave['cos'][a] = 0; }
                }
                return wave;
            }

            if(type==null){
                wave = a;
            }
            switch(type){
                case 'sin': wave.sin = a; break;
                case 'cos': wave.cos = a; break;
                default: break;
            }
        };
        object.waveElement = function(type, mux, a){
            if(a==null){return wave[type][mux];}
            wave[type][mux] = a;
        };
        object.waveResolution = function(a=null){
            if(a==null){return waveResolution;}
            waveResolution = a;
        };
        object.updateBackground = function(){
            grapher.viewbox( {bottom:-1.1,top:1.1, left:0} );
            grapher.horizontalMarkings({points:[1,0.75,0.5,0.25,0,-0.25,-0.5,-0.75,-1],printText:true});
            grapher.verticalMarkings({points:[0,1/4,1/2,3/4],printText:true});
            grapher.drawBackground();
        };
        object.draw = function(){
            var data = [];
            var temp = 0;
            for(var a = 0; a <= waveResolution; a++){
                temp = 0;
                for(var b = 0; b < wave['sin'].length; b++){
                    if(!wave['sin'][b]){wave['sin'][b]=0;} //cover missing elements
                    temp += Math.sin(b*(2*Math.PI*(a/waveResolution)))*wave['sin'][b]; 
                }
                for(var b = 0; b < wave['cos'].length; b++){
                    if(!wave['cos'][b]){wave['cos'][b]=0;} //cover missing elements
                    temp += Math.cos(b*(2*Math.PI*(a/waveResolution)) )*wave['cos'][b]; 
                }
                data.push(temp);
            }
    
            grapher.drawForeground( data );
        };
        object.reset = function(){
            this.wave({'sin':[],'cos':[]});
            this.waveResolution(50);
            this.updateBackground();
        };
        
    return object;
};

interfacePart.partLibrary.display.grapher_periodicWave = function(name,data){ 
    return interfacePart.collection.display.grapher_periodicWave(
        name, data.x, data.y, data.width, data.height, data.angle, data.static, data.resolution,
        data.style.foregrounds, data.style.foregroundText,
        data.style.background_colour, data.style.background_lineThickness,
        data.style.backgroundText_colour, data.style.backgroundText_size, data.style.backgroundText_font,
        data.style.backing,
    ); 
};