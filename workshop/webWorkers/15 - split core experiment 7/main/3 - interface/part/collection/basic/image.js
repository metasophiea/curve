this.image = function(name=null, x=0, y=0, width=10, height=10, angle=0, anchor={x:0,y:0}, ignored=false, url=''){
    dev.log.partBasic('.image('+name+','+x+','+y+','+width+','+height+','+angle+','+JSON.stringify(anchor)+','+ignored+','+url+')'); //#development

    const element = _canvas_.core.element.create('image',name);
    element.unifiedAttribute({
        x:x, 
        y:y, 
        width:width, 
        height:height, 
        angle:angle, 
        anchor:anchor, 
        ignored:ignored, 
        url:url,
    });
    return element;
};

interfacePart.partLibrary.basic.image = function(name,data){ 
    return interfacePart.collection.basic.image(
        name, data.x, data.y, data.width, data.height, data.angle, data.anchor, data.ignored, data.url
    );
};