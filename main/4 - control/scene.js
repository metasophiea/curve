this.new = function(askForConfirmation=false){
    if(askForConfirmation){
        if( !confirm("This will clear the current scene! Are you sure?") ){ return; }
    }

    control.selection.selectEverything();
    control.selection.delete();

    IDcounter = 0;
    control.viewport.position(0,0);
    control.viewport.scale(0);
};
this.documentUnits = function(units){
    // position             -   the X, Y and angle of the original object
    // details              -   data on the unit's type
    //      collection
    //      model
    // data                 -   the exported data from the original object
    // connections          -   an array of where to connect what
    //      typeAndNameOfSourcePort
    //      indexOfDestinationUnit
    //      typeAndNameOfDestinationPort

    var outputData = [];

    //cycle through this array, and create the scene data
        for(var a = 0; a < units.length; a++){
            var unit = units[a];
            var entry = {};

            //get the units position
                entry.position = {
                    x: unit.parameter.x(),
                    y: unit.parameter.y(),
                    angle: unit.parameter.angle(),
                };

            //unitDetails
                entry.details = {
                    collection: unit.collection,
                    model: unit.model,
                };

            //export the unit's state
                entry.data = unit.exportData ? unit.exportData() : null;

            //log all connections
                entry.connections = [];
                    for(var connectionType in unit.io){
                        for(var connection in unit.io[connectionType]){
                            var foreignNode = unit.io[connectionType][connection].getForeignNode();
                            if(foreignNode == undefined){continue;} //this node isn't connected to anything, so just bail
                    
                            var newConnectionEntry = {};

                            //typeAndNameOfSourcePort
                                newConnectionEntry.typeAndNameOfSourcePort = { type:connectionType, name:connection };

                            //indexOfDestinationUnit
                                newConnectionEntry.indexOfDestinationUnit = units.indexOf(foreignNode.parent);

                            //typeAndNameOfDestinationPort
                                newConnectionEntry.typeAndNameOfDestinationPort = { type:connectionType, name:foreignNode.name };

                            entry.connections.push(newConnectionEntry);
                        }
                    }

            //add this entry to the save data list
                outputData.push(entry);
        }

    return outputData;  
};
this.printUnits = function(units){
    var printedUnits = [];

    for(var a = 0; a < units.length; a++){
        var item = units[a];

        //create the object with its new position adding it to the pane
            var unit = control.scene.addUnit(item.position.x, item.position.y,  item.position.angle, item.details.model, item.details.collection);
            printedUnits.push(unit);

        //import data and select unit
            if(unit.importData){unit.importData(item.data);}
            control.selection.selectUnit(unit);

        //go through its connections, and attempt to connect them to everything they should be connected to
        // (don't worry if a object isn't available yet, just skip that one. Things will work out in the end)
            for(var b = 0; b < item.connections.length; b++){
                var connection = item.connections[b];

                var destinationUnit = control.selection.selectedUnits[connection.indexOfDestinationUnit];
                if(destinationUnit == undefined){continue;}

                var sourceNode = unit.io[connection.typeAndNameOfSourcePort.type][connection.typeAndNameOfSourcePort.name];
                var destinationNode = destinationUnit.io[connection.typeAndNameOfDestinationPort.type][connection.typeAndNameOfDestinationPort.name];
                
                sourceNode.connectTo(destinationNode);
            }
    }

    return printedUnits;
};
this.export = function(){
    //creating an array of all units to be saved (strip out all the cable units)
    //document all units in the main pane
    return this.documentUnits( Array.from(pane.children).filter(a => !a._isCable) );
};
this.import = function(data){ this.printUnits( data ); };
this.save = function(filename='project',compress=true){
    //control switch
        if(!workspace.control.interaction.enableSceneSave()){return;}
    


    //gather some initial data
        var outputData = {
            filename: filename,
            viewportLocation: {
                xy: workspace.control.viewport.position(),
                scale: workspace.control.viewport.scale(),
            },
        };

    //stopping audio
        workspace.library.audio.destination.masterGain(0);

    //gather the scene data
        outputData.units = this.export();

    //serialize data
        outputData = workspace.library.misc.serialize(outputData,compress);

    //wrap serialized scene
        outputData = {
            compressed: compress,
            data: outputData
        };

    //serialize again
        outputData = workspace.library.misc.serialize(outputData,false);

    //print to file
        workspace.library.misc.printFile(filename,outputData);

    //restarting audio
        workspace.library.audio.destination.masterGain(1);
};
this.load = function(url,callback,askForConfirmation=false){
    //control switch
        if(!workspace.control.interaction.enableSceneLoad()){return;}



    if(askForConfirmation){
        if( !confirm("This will clear the current scene! Are you sure?") ){ return; }
    }

    //procedure for loading in a .crv file
        function procedure(data,callback){
            //stopping audio
                workspace.library.audio.destination.masterGain(0);

            //deserialize first layer
                try{
                    var data = workspace.library.misc.unserialize(data,false);
                }catch(e){
                    console.error( "Major error unserializing first layer of file" );
                    console.error(e);
                    return;
                }

            //determine if this data is compressed or not
                var compressed = data.compressed;

            //deserialize second layer (knowing now whether it's compressed or not)
                try{
                    var data = workspace.library.misc.unserialize(data.data,compressed);
                }catch(e){
                    console.error( "Major error unserializing second layer of file" );
                    console.error(e);
                    return;
                }

            //clear scene
                control.scene.new();

            //print to scene
                control.scene.import(data.units);
            
            //reposition viewport
                control.viewport.position( data.viewportLocation.xy.x, data.viewportLocation.xy.y );
                control.viewport.scale( data.viewportLocation.scale );

            //restarting audio
                workspace.library.audio.destination.masterGain(1);

            //deselect all units
                control.selection.deselectEverything();

            //callback
                if(callback){callback(metadata);}
        }

    //depending on whether a url has been provided or not, perform the appropiate load
        if(url == undefined){ //load from file
            workspace.library.misc.openFile(function(data){procedure(data,callback);});
        }else{  //load from url
            var request = new XMLHttpRequest();
            request.open('GET', url, true);
            request.responseType = 'text';
            request.onload = function(){ procedure(this.response,callback); };
            request.send();
        }
};

this.generateUnitName = function(){ return IDcounter++; };
this.addUnit = function(x,y,a,model,collection='alpha'){
    //control switch
        if(!workspace.control.interaction.enableUnitAdditionRemoval()){return;}



    //generate new name for unit
        var name = this.generateUnitName();

    //produce unit, assign its name and add grapple code
        if( workspace.interface.unit.collection[collection] == undefined ){
            console.warn('unknown unit collection "'+collection+'" (workspace.interface.unit.collection['+collection+'])'); 
            return;
        }
        if( workspace.interface.unit.collection[collection][model] == undefined ){
            console.warn('unknown unit model "'+model+'" (workspace.interface.unit.collection['+collection+']['+model+'])'); 
            return;
        }

        var tmp = workspace.interface.unit.collection[collection][model](x,y,a);
        tmp.name = ''+name;
        tmp = workspace.control.grapple.declare(tmp);

    //check if this new position is possible, and if not find the closest one that is and adjust the unit's position accordingly
        this.rectifyUnitPosition(tmp);

    //add it to the main pane
        pane.append( tmp );

    return tmp;
};
this.removeUnit = function(unit){
    //control switch
        if(!workspace.control.interaction.enableUnitAdditionRemoval()){return;}
        
        pane.remove(unit);
};

this.getAllUnits = function(){ return pane.children.filter( a => !a._isCable ); };
this.getUnitByName = function(name){ return pane.getChildByName(name); };
// this.getUnitsByType = function(type){ return pane.children.filter( a => a.unitType == type ); };
this.getUnitUnderPoint = function(x,y){
    for( var a = 0; a < pane.children.length; a++){
        if( workspace.library.math.detectOverlap.boundingBoxes({bottomRight:{x:x,y:y},topLeft:{x:x,y:y}}, pane.children[a].space.box) ){
            if( workspace.library.math.detectOverlap.pointWithinPoly({x:x,y:y}, pane.children[a].space.points) ){
                return pane.children[a];
            }
        }
    }
};
this.getUnitsWithinPoly = function(points){
    var box = workspace.library.math.boundingBoxFromPoints(points);
    return pane.children.filter(function(a){ return !a._isCable && workspace.library.math.detectOverlap.boundingBoxes(box, a.space.boundingBox) && workspace.library.math.detectOverlap.overlappingPolygons(points, a.space.points); });
};

this.rectifyUnitPosition = function(unit){
    //control switch
        if(!workspace.control.interaction.enableUnitCollision()){return;}

    //discover if there's an overlap; if not skip all this
        var allOtherUnits = control.scene.getAllUnits().filter(a => a != unit).map(a => { return a.space; });
        if( !workspace.library.math.detectOverlap.overlappingPolygonWithPolygons( unit.space, allOtherUnits ) ){return false;}

    //get the offset which will allow this unit to fit
        var offset = workspace.library.math.fitPolyIn( unit.space, allOtherUnits );
        
    //apply offset
        unit.parameter.x( unit.parameter.x() + offset.x);
        unit.parameter.y( unit.parameter.y() + offset.y);
    
    return true; //false: no change was made - true: a change was made
};