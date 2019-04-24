/*
    a design
    {
        name: 'name of unit (unique to collection)',
        collection: 'name of the collection to which this unit belongs',
        x: 0, y: 0,
        space: [{x:0,y:0}, ...], //a collection of points, used to determine the unit's selection/collision area
        spaceOutline: true/false, //a helper graphic, which when set to true, will draw an outline of the space
        elements:[ //a list of all the parts
            {
                type:'part type name',
                name:'a unique name',
                grapple: true/false, //declare that this shape part should be used as an unit grapple
                data:{}, //data relevant to this part type
            }
        ] 
    }
*/
this.builder = function(creatorMethod,design){
    if(!creatorMethod){console.error("workspace unit builder:: creatorMethod missing");return;}

    //main group
        var unit = workspace.interface.part.builder('group',design.name,{x:design.x, y:design.y, angle:design.a});
        unit.model = design.name;
        unit.collection = design.collection;
        unit.creatorMethod = creatorMethod;

    //generate parts and append to main group
        unit.elements = {};
        for(var a = 0; a < design.elements.length; a++){
            //check for name collision
                if( unit.getChildByName(design.elements[a].name) != undefined ){
                    console.warn('error: part with the name "'+design.elements[a].name+'" already exists. Part:',design.elements[a],'will not be added');
                    continue;
                }    

            //produce and append part
                var newPart = workspace.interface.part.builder( design.elements[a].type, design.elements[a].name, design.elements[a].data );
                unit.append(newPart);

            //add part to element tree
                if( unit.elements[design.elements[a].type] == undefined ){ unit.elements[design.elements[a].type] = {}; }
                unit.elements[design.elements[a].type][design.elements[a].name] = newPart;
        }

    //gather together io ports
        unit.io = {};
        [
            {key:'_', name:'connectionNode'},
            {key:'signal', name:'connectionNode_signal'},
            {key:'voltage', name:'connectionNode_voltage'},
            {key:'data', name:'connectionNode_data'},
            {key:'audio', name:'connectionNode_audio'},
        ].forEach(function(type){
            if(!unit.elements[type.name]){return;}
            var keys = Object.keys(unit.elements[type.name]);
            for(var a = 0; a < keys.length; a++){
                var part = unit.elements[type.name][keys[a]];
                if( unit.io[type.key] == undefined ){ unit.io[type.key] = {}; }
                unit.io[type.key][part.name] = part;
            }
        });

        unit.disconnectEverything = function(){
            for(connectionType in unit.io){
                for(connectionName in unit.io[connectionType]){
                    unit.io[connectionType][connectionName].disconnect();
                }
            }
        };
        unit.allowIOConnections = function(bool){
            if(bool == undefined){return;}
            for(connectionType in unit.io){
                for(connectionName in unit.io[connectionType]){
                    unit.io[connectionType][connectionName].allowConnections(bool);
                }
            }
        };
        unit.allowIODisconnections = function(bool){
            if(bool == undefined){return;}
            for(connectionType in unit.io){
                for(connectionName in unit.io[connectionType]){
                    unit.io[connectionType][connectionName].allowDisconnections(bool);
                }
            }
        };

    //generate unit's personal space
        function generatePersonalSpace(){
            unit.space = {
                points: design.space.map(a => {
                    var tmp = workspace.library.math.cartesianAngleAdjust(a.x,a.y,unit.parameter.angle());
                    return { x:design.x+tmp.x, y:design.y+tmp.y };
                }),
            };
            unit.space.boundingBox = workspace.library.math.boundingBoxFromPoints(unit.space.points);
        }
        generatePersonalSpace();

        //create invisible shape
            //create name for the space shape that won't interfere with other names 
                var spaceName = 'spaceShape';
                while( unit.getChildByName(spaceName) != undefined ){ spaceName = spaceName + Math.floor(Math.random()*10); } //add random digits until it's unique
            //create invisible backing shape (with callbacks)
                var invisibleShape = workspace.interface.part.builder( 'polygon', spaceName, {points:design.space, style:{ fill:'rgba(0,0,0,0)' } } );
                unit.prepend(invisibleShape);

        //if requested, add an outline shape
            if( design.spaceOutline ){
                unit.append( workspace.interface.part.builder( 'polygon', spaceName+'Outline', {points:design.space, style:{ fill:'rgba(0,0,0,0)', stroke:'rgba(0,0,0,1)' } } ) );
            }

    //update unit x and y adjustment methods
        unit._parameter = {};
        unit._parameter.x = unit.parameter.x;
        unit._parameter.y = unit.parameter.y;
        unit._parameter.angle = unit.parameter.angle;
        unit.parameter.x = function(newX){
            if( unit._parameter.x(newX) != undefined ){ return unit.x; }
            design.x = newX;
            generatePersonalSpace();
        };
        unit.parameter.y = function(newY){
            if( unit._parameter.y(newY) != undefined ){ return unit.y; }
            design.y = newY;
            generatePersonalSpace();
        };
        unit.parameter.angle = function(newAngle){
            if( unit._parameter.angle(newAngle) != undefined ){ return unit.angle; }
            design.angle = newAngle;
            generatePersonalSpace();
        };


    //disable all control parts method
        unit.interactable = function(bool){
            if(bool == undefined){return;}
            for(partType in unit.elements){
                for(partName in unit.elements[partType]){
                    if( unit.elements[partType][partName].interactable ){
                        unit.elements[partType][partName].interactable(bool);
                    }
                }
            }
        };


    return unit;
};