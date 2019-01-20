this.dial_image_discrete = function(
    name='dial_image_discrete',
    x, y, r=15, angle=0, interactable=true,
    value=0, resetValue=0, optionCount=5,
    startAngle=(3*Math.PI)/4, maxAngle=1.5*Math.PI,

    handleUrl = 'https://pbs.twimg.com/profile_images/927920625347383297/-ksNZr-Z_400x400.jpg',
    slotUrl = 'https://blueblots.com/wp-content/uploads/2009/07/space1.jpg',
    needleUrl = 'https://i.ytimg.com/vi/kpFryXQbVEA/hqdefault.jpg',

    onchange=function(){},
    onrelease=function(){},
){
    //elements 
        //main
            var object = interfacePart.builder('group',name,{x:x, y:y, angle:angle});
        
        //dial
            var dial = interfacePart.builder('dial_image_continuous',name,{
                x:0, y:0, r:r, angle:0, interactable:interactable,
                startAngle:startAngle, maxAngle:maxAngle,
                handleUrl:handleUrl, slotUrl:slotUrl, needleUrl:needleUrl,
            });
            //clean out built-in interaction
            dial.getChildByName('handle').ondblclick = undefined;
            dial.getChildByName('handle').onwheel = undefined;
            dial.getChildByName('handle').onmousedown = undefined;

            object.append(dial);
        





    //graphical adjust
        function set(a,update=true){ 
            a = (a>(optionCount-1) ? (optionCount-1) : a);
            a = (a<0 ? 0 : a);

            if(update && object.onchange != undefined){object.onchange(a);}

            a = Math.round(a);
            value = a;
            dial.set( value/(optionCount-1) );
        };




    //methods
        var grappled = false;

        object.set = function(value,update){
            if(grappled){return;}
            set(value,update);
        };
        object.get = function(){return value;};
        object.interactable = function(bool){
            if(bool==undefined){return interactable;}
            interactable = bool;
        };




    //interaction
        var acc = 0;

        dial.getChildByName('handle').ondblclick = function(){
            if(!interactable){return;}
            if(resetValue<0){return;}
            if(grappled){return;}
            
            set(resetValue);

            if(object.onrelease != undefined){object.onrelease(value);}
        };
        dial.getChildByName('handle').onwheel = function(x,y,event){
            if(!interactable){return;}
            if(grappled){return;}

            var move = event.deltaY/100;

            acc += move;
            if( Math.abs(acc) >= 1 ){
                set( value -1*Math.sign(acc) );
                acc = 0;
                if(object.onrelease != undefined){object.onrelease(value);}
            }
        };
        dial.getChildByName('handle').onmousedown = function(x,y,event){
            if(!interactable){return;}
            var initialValue = value;
            var initialY = event.y;

            grappled = true;
            workspace.system.mouse.mouseInteractionHandler(
                function(event){
                    var diff = Math.round( (event.y - initialY)/25 );
                    set( initialValue - diff );
                    if(object.onchange != undefined){object.onchange(value);}
                },
                function(event){
                    grappled = false;
                    if(object.onrelease != undefined){object.onrelease(value);}
                }
            );
        };




    //callbacks
        object.onchange = onchange; 
        object.onrelease = onrelease;

    //setup
        set(value);

    return object;
};