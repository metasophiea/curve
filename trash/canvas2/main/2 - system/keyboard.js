//utility functions
    function activateShapeFunctions(listenerName, x,y,event,shape){
        //starting with the shape under this point and climbing through all it's parents; look
        //for 'listenerName' listeners. If one is found, activate it, stop climbing and return 'true'
        //if no shape has a listener, return 'false'

            var tmp = shape;
            if(tmp == undefined){return false;}
            do{
                if( tmp[listenerName] != undefined ){ tmp[listenerName](x,y,event); return true; }
            }while( (tmp = tmp.parent) != undefined )

            return false;
    }
    function customKeyInterpreter(event,press){
        var pressedKeys = canvas.system.keyboard.pressedKeys;
        if(event.code == 'ControlLeft' || event.code == 'ControlRight'){  pressedKeys.control = press; }
        else if(event.code == 'AltLeft' || event.code == 'AltRight'){     pressedKeys.alt = press;     }
        else if(event.code == 'MetaLeft' || event.code == 'MetaRight'){   pressedKeys.meta = press;    }
        else if(event.code == 'ShiftLeft' || event.code == 'ShiftRight'){ pressedKeys.shift = press;   }
    }


canvas.core.callback.onkeydown = function(x,y,event,shape){
    //if key is already pressed, don't press it again
        if(canvas.system.keyboard.pressedKeys[event.code]){ return; }
        canvas.system.keyboard.pressedKeys[event.code] = true;
        customKeyInterpreter(event,true);
    
    //perform action
        if(activateShapeFunctions('onkeydown',x,y,event,shape)){return;}
        canvas.library.structure.functionListRunner(canvas.system.keyboard.functionList.onkeydown)(event,{x:x,y:y});
};
canvas.core.callback.onkeyup = function(x,y,event,shape){
    //if key isn't pressed, don't release it
        if(!canvas.system.keyboard.pressedKeys[event.code]){return;}
        delete canvas.system.keyboard.pressedKeys[event.code];
        customKeyInterpreter(event,false);
    
    //perform action
        if(activateShapeFunctions('onkeyup',x,y,event,shape)){return;}
        canvas.library.structure.functionListRunner(canvas.system.keyboard.functionList.onkeyup)(event,{x:x,y:y});
};

this.releaseAll = function(){
    for(var a = 0; a < this.pressedKeys.length; a++){
        this.releaseKey(this.pressedKeys[a]);
    }
};
this.releaseKey = function(keyCode){
    canvas.onkeyup( new KeyboardEvent('keyup',{'key':keyCode}) );
}

this.pressedKeys = {
    control:false,
    alt:false,
    meta:false,
};

this.functionList = {};
this.functionList.onkeydown = [
    {
        'specialKeys':[],
        'function':function(event,data){}
    }
];
this.functionList.onkeyup = [
    {
        'specialKeys':[],
        'function':function(event,data){}
    }
];