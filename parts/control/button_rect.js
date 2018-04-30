this.button_rect = function(
    id='button_rect',
    x, y, width, height, angle=0,
    upStyle = 'fill:rgba(200,200,200,1)',
    hoverStyle = 'fill:rgba(220,220,220,1)',
    downStyle = 'fill:rgba(180,180,180,1)',
    glowStyle = 'fill:rgba(220,200,220,1)'
){

    // elements 
    var object = parts.basic.g(id, x, y);
    var rect = parts.basic.rect(null, 0, 0, width, height, angle, upStyle);
        object.appendChild(rect);

    //interactivity
    rect.onmouseenter = function(){ __globals.utility.element.setStyle(this, hoverStyle); };
    rect.onmouseleave = function(){ __globals.utility.element.setStyle(this, upStyle);    };
    rect.onmousedown =  function(){ __globals.utility.element.setStyle(this, downStyle);  };
    rect.onmouseup =    function(){ this.onmouseleave();                          };
    rect.glow =         function(){ __globals.utility.element.setStyle(this, glowStyle) };

    //callbacks
    object.onmouseup =    function(){ /*console.log('mouseup');    */ };
    object.onmousedown =  function(){ /*console.log('mousedown');  */ };
    object.onmouseenter = function(){ /*console.log('mouseenter'); */ };
    object.onmouseleave = function(){ /*console.log('mouseleave'); */ };
    object.onmousemove =  function(){ /*console.log('mousemove');  */ };
    object.onclick =      function(){ /*console.log('click');      */ };
    object.ondblclick =   function(){ /*console.log('doubleclick');*/ };

    //methods
    object.click = function(glow=false){ this.onclick(); this.onmousedown(); if(glow){rect.glow();}else{rect.onmousedown();} setTimeout(function(){rect.onmouseup();this.onmouseup();},250); };
    object.hover = function(){ this.onmouseenter(); rect.onmouseenter(); };
    object.unhover = function(){this.onmouseleave(); rect.onmouseleave();};

    return object;
};