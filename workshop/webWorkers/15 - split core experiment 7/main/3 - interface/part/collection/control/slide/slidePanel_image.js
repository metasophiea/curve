this.slidePanel_image = function(
    name='slidePanel_image', 
    x, y, width=80, height=95, angle=0, interactable=true,
    handleHeight=0.1, count=8, startValue=0, resetValue=0.5,

    handleURL, backingURL, slotURL, overlayURL,

    onchange=function(){},
    onrelease=function(){},
){
    dev.log.partControl('.slidePanel_image(...)'); //#development

    //elements 
        //main
            const object = interfacePart.builder('basic','group',name,{x:x, y:y, angle:angle});
        //slides
            for(let a = 0; a < count; a++){
                const temp = interfacePart.builder(
                    'control', 'slide_continuous_image', 'slide_'+a, {
                        x:a*(width/count), y:0,
                        width:width/count, height:height, interactable:interactable, handleHeight:handleHeight,
                        value:startValue, resetValue:resetValue,
                        handleURL:handleURL, backingURL:backingURL, slotURL:slotURL,
                        onchange:function(value){ if(!object.onchange){return;} object.onchange(this.id,value); },
                        onrelease:function(value){ if(!object.onrelease){return;} object.onrelease(this.id,value); },
                    }
                );
                temp.__calculationAngle = angle;
                object.append(temp);
            }
        //overlay
            if(overlayURL != undefined){
                const overlay = interfacePart.builder('basic','image','overlay',{width:width, height:height, url:overlayURL});
                object.append(overlay);
            }

        object.interactable = function(bool){
            if(bool==undefined){return interactable;}
            interactable = bool;

            for(let a = 0; a < count; a++){
                object.children[a].interactable(bool);
            }
        };

    return object;
};

interfacePart.partLibrary.control.slidePanel_image = function(name,data){ return interfacePart.collection.control.slidePanel_image(
    name, data.x, data.y, data.width, data.height, data.angle, data.interactable, data.handleHeight, data.count, data.value, data.resetValue, 
    data.handleURL, data.backingURL, data.overlayURL, data.style.invisibleHandle,
    data.onchange, data.onrelease
); };