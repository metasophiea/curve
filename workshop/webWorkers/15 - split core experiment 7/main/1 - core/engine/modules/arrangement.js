const arrangement = new function(){
    let design = element.create_skipDatabase('group','root');

    this.new = function(){ 
        dev.log.arrangement('.new()'); //#development
        design = core.shape.create('group');
    };
    this.get = function(){
        dev.log.arrangement('.get()'); //#development
        return design; 
    };
    this.set = function(arrangement){ 
        dev.log.arrangement('.set('+JSON.stringify(arrangement)+')'); //#development
        design = arrangement;
    };
    this.prepend = function(element){
        dev.log.arrangement('.prepend('+JSON.stringify(element)+')'); //#development
        design.prepend(element);
    };
    this.append = function(element){
        dev.log.arrangement('.append('+JSON.stringify(element)+')'); //#development
        design.append(element);
    };
    this.remove = function(element){ 
        dev.log.arrangement('.remove('+JSON.stringify(element)+')'); //#development
        design.remove(element); 
    };
    this.clear = function(){ 
        dev.log.arrangement('.clear()'); //#development
        design.clear(); 
    };

    this.getElementByAddress = function(address){
        dev.log.arrangement('.getElementByAddress('+JSON.stringify(address)+')'); //#development

        var route = address.split('/'); 
        route.shift(); 
        route.shift(); 

        var currentObject = design;
        route.forEach(function(a){
            currentObject = currentObject.getChildByName(a);
        });

        return currentObject;
    };
    this.getElementsUnderPoint = function(x,y){
        dev.log.arrangement('.getElementsUnderPoint('+x+','+y+')'); //#development
        return design.getElementsUnderPoint(x,y);
    };
    this.getElementsUnderArea = function(points){ 
        dev.log.arrangement('.getElementByAddress('+JSON.stringify(points)+')'); //#development
        return design.getElementsUnderArea(points); 
    };
        
    this.printTree = function(mode='spaced'){ //modes: spaced / tabular / address
        function recursivePrint(grouping,prefix=''){
            grouping.children.forEach(function(a){
                if(mode == 'spaced'){
                    console.log(prefix+'- '+a.name);
                    if(a.type == 'group'){ recursivePrint(a, prefix+'- ') }
                }else if(mode == 'tabular'){
                    console.log(prefix+'- \t'+a.name);
                    if(a.type == 'group'){ recursivePrint(a, prefix+'-\t') }
                }else if(mode == 'address'){
                    console.log(prefix+'/'+a.name);
                    if(a.type == 'group'){ recursivePrint(a, prefix+'/'+a.name) }
                }
            });
        }

        recursivePrint(design.getTree(), '/root');
    };

    this._dump = function(){ design._dump(); };
};