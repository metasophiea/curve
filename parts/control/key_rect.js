this.key_rect = function(
    id='key_rect',
    x, y, width, height, angle=0,
    style_off = 'fill:rgba(200,200,200,1)',
    style_press = 'fill:rgba(180,180,180,1)',
    style_glow = 'fill:rgba(220,200,220,1)',
    style_pressAndGlow = 'fill:rgba(200,190,200,1)'
){

    // elements 
    var object = parts.basic.g(id, x, y);
    var rect = parts.basic.rect(null, 0, 0, width, height, angle, style_off);
        object.appendChild(rect);

    //state
    object.state = 0;
    object.activateState = function(state){
        // 0 - off
        // 1 - pressed
        // 2 - glowing
        // 3 - pressed and glowing
        switch(state){
            case 0: __globals.utility.element.setStyle(rect, style_off); break;
            case 1: __globals.utility.element.setStyle(rect, style_press); break;
            case 2: __globals.utility.element.setStyle(rect, style_glow); break;
            case 3: __globals.utility.element.setStyle(rect, style_pressAndGlow); break;
            default: /*console.error('Unknown state reached:', state);*/ return; break;
        }
        object.state = state;
    };

    //interactivity
    rect.onmousedown =  function(){ object.press();   };
    rect.onmouseup =    function(){ object.release(); };
    rect.onmouseleave = function(){ object.release(); };
    rect.onmouseenter = function(event){ if(event.buttons == 1){object.press();} };

    //callbacks
    object.onkeyup =    function(){ /*console.log('mouseup');    */ };
    object.onkeydown =  function(){ /*console.log('mousedown');  */ };

    //methods;
    object.press =   function(){
        if( this.state%2 != 0 ){return;} //key already pressed 
        this.activateState(this.state+1);
        if(this.onkeydown){this.onkeydown();}
    };
    object.release = function(){ 
        if( this.state%2 == 0 ){return;} //key not pressed 
        this.activateState(object.state-1); 
        if(this.onkeyup){this.onkeyup();}
    };
    object.glow = function(){ this.activateState(this.state+2); };
    object.dim  = function(){ this.activateState(this.state-2); };

    return object;
};