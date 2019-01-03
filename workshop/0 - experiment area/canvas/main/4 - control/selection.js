this.selectedUnits = [];
this.lastSelectedUnits = null;
this.clipboard = [];

this.selectUnit = function(unit,shiftToFront=true){
    //control switch
        if(!workspace.control.switch.enableUnitSelection){return;}

    //check if object is already selected
        if( this.selectedUnits.indexOf(unit) != -1 ){return;}

    //shift object to front of view, (within it's particular pane)
        if(shiftToFront){
            var pane = workspace.system.pane.getMiddlegroundPane(unit);
            pane.remove(unit);
            pane.append(unit);
        }

    //colourize space
        var tmp = workspace.interface.part.alpha.builder( 
            'polygon', 'selectionGlow-'+unit.getAddress(), 
            { 
                points:unit.space.points.map(function(a){ return {x:a.x-unit.x,y:a.y-unit.y};}), 
                style:{ fill:'rgba(244, 226, 66, 0.25)', stroke:'rgba(244, 226, 66, 1)' } 
            } 
        );
        unit.append(tmp);

    //perform selection
        if(unit.onselect){object.onselect();}
        this.selectedUnits.push(unit);
        this.lastSelectedUnits = unit;
};
this.selectUnits = function(unitList){
    for(var a = 0; a < unitList.length; a++){
        this.selectUnit(unitList[a]);
    }
};
this.deselectUnit = function(unit){
    // console.log('deselecting unit',unit);

    //decolourize space
        unit.remove( unit.getChildByName('selectionGlow-'+unit.getAddress()) );
    
    //remove unit from selectedUnits list, and activate it's "ondeselect" function
        this.selectedUnits.splice(this.selectedUnits.indexOf(unit),1);
        if(unit.ondeselect){unit.ondeselect();}
};
this.selectEverything = function(){
    // console.log('selecting everything');
    
    this.deselectEverything();
    for(var a = 0; a < workspace.system.pane.mm.children.length; a++){
        if( !workspace.system.pane.mm.children[a]._isCable ){
            this.selectUnit(workspace.system.pane.mm.children[a],false);
        }
    }
};
this.deselectEverything = function(){
    // console.log('deselecting everything');

    while(this.selectedUnits.length > 0){
        this.deselectUnit( this.selectedUnits[0] );
    }
};

this.cut = function(){
    //control switch
        if(!workspace.control.switch.enableSceneModification){return;}


        
    this.copy();
    this.delete();
};
this.copy = function(){
    //control switch
        if(!workspace.control.switch.enableSceneModification){return;}



    this.clipboard = workspace.control.scene.documentUnits(this.selectedUnits);
};
this.paste = function(position){
    //control switch
        if(!workspace.control.switch.enableSceneModification){return;}



    //if clipboard is empty, don't bother
        if(this.clipboard.length == 0){return;}

    //deselect everything
        this.deselectEverything();

    //position manipulation
    //if position is not set to 'duplicate'; calculate new positions for the objects
        if(position != 'duplicate'){
            //collect all positions
                var points = [];
                this.clipboard.forEach( element => points.push(element.position) );

            //get the bounding box of this selection, and then the top left point of that
                var topLeft = workspace.library.math.boundingBoxFromPoints(points).topLeft;

            //if no position has been provided at all; calculate a new one from the mouse position
                if(position == undefined){
                    position = workspace.core.viewport.mousePosition();
                    if(position.x == undefined || position.y == undefined){
                        position = workspace.core.viewport.windowPoint2workspacePoint(0, 0);
                    }
                }

            //combine this topLeft point with the provided (or calculated) position, 
            //then add this to the mouses' position
                this.clipboard.forEach( function(element){
                    element.position.x += position.x - topLeft.x;
                    element.position.y += position.y - topLeft.y;
                } );
        }

    //unit printing
        workspace.control.scene.printUnits( this.clipboard );

};
this.duplicate = function(){
    //control switch
        if(!workspace.control.switch.enableSceneModification){return;}



    this.copy();
    this.paste('duplicate');
    this.clipboard = [];
};
this.delete = function(){
    //control switch
        if(!workspace.control.switch.enableSceneModification){return;}



    while(this.selectedUnits.length > 0){
        var unit = this.selectedUnits[0];
        //delete object
            //run the unit's onDelete method
                if(unit.ondelete){unit.ondelete();}
            //run disconnect on every connection node of this unit
                unit.disconnectEverything();
            //remove the object from the pane it's in
                workspace.system.pane.getMiddlegroundPane(unit).remove(unit);
        //remove object from selected array
            this.selectedUnits.shift();
    }
    this.lastSelectedUnits = null;
};