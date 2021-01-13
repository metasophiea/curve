this.functionListRunner = function(list,activeKeys){
    dev.log.structure('.functionListRunner(',list,activeKeys); //#development
    dev.count('.structure.functionListRunner'); //#development

    //function builder for working with the 'functionList' format

    return function(event,data){
        //return a bool saying whether something in the list was activated
            let somethingWasRun = false;

        //run through function list, and activate functions where necessary
            for(let a = 0; a < list.length; a++){
                let shouldRun = true;

                //determine if the requirements of this function are met
                    for(let b = 0; b < list[a].requiredKeys.length; b++){
                        shouldRun = true;
                        for(let c = 0; c < list[a].requiredKeys[b].length; c++){
                            shouldRun = shouldRun && activeKeys[ list[a].requiredKeys[b][c] ];
                            if(!shouldRun){ break; } //(one is already not a match, so save time and just skip to the next one)
                        }
                        if(shouldRun){ break; } //one of the collections worked, so save time and skip the rest
                    }

                //if requirements were met, run the function
	            if(shouldRun){  
                    somethingWasRun = true;

                    //if the function returns 'false', continue with the list; otherwise stop here
        	            if( list[a].function(event,data) ){ break; }
                }
            }

        return somethingWasRun;
    }
};

this.signalRegistry = function(rightLimit=-1,bottomLimit=-1,signalLengthLimit=-1){
    dev.log.structure('.signalRegistry(',rightLimit,bottomLimit,signalLengthLimit); //#development
    dev.count('.structure.signalRegistry'); //#development

    let signals = [];
    let selectedSignals = [];
    let events = [];
    let events_byID = [];
    let events_byPosition = {};
    let positions = [];

    this.__dump = function(){
        dev.log.structure('.signalRegistry.__dump()'); //#development
        dev.count('.structure.signalRegistry.__dump'); //#development
    
        console.log('---- signalRegistry dump ----');

        console.log('\tsignals');
        for(let a = 0; a < signals.length; a++){ 
            console.log( '\t\t', a, ' ' + JSON.stringify(signals[a]) );
        }

        console.log('\tselectedSignals');
        for(let a = 0; a < tselectedSignals.length; a++){ 
            console.log( '\t\t', a, ' ' + JSON.stringify(tselectedSignals[a]) );
        }

        console.log('\tevents');
        for(let a = 0; a < events.length; a++){ 
            console.log( '\t\t', a, ' ' + JSON.stringify(events[a]) );
        }

        console.log('\tevents_byID');
        for(let a = 0; a < events_byID.length; a++){ 
            console.log( '\t\t', a, ' ' + JSON.stringify(events_byID[a]) );
        }

        console.log('\tevents_byPosition');
        const keys = Object.keys(events_byPosition);
        for(let a = 0; a < keys.length; a++){ 
            console.log( '\t\t', keys[a], ' ' + JSON.stringify(events_byPosition[keys[a]]) );
        }

        console.log('\tpositions');
        for(let a = 0; a < positions.length; a++){ 
            console.log( '\t\t', a, ' ' + JSON.stringify(positions[a]) );
        }
    };

    this.export = function(){
        dev.log.structure('.signalRegistry.export()'); //#development
        dev.count('.structure.signalRegistry.export'); //#development
    
        return JSON.parse(JSON.stringify(
            {
                signals:            signals,
                selectedSignals:    selectedSignals,
                events:             events,
                events_byID:        events_byID,
                events_byPosition:  events_byPosition,
                positions:          positions,
            }
        ));
    };
    this.import = function(data){
        dev.log.structure('.signalRegistry.import(',data); //#development
        dev.count('.structure.signalRegistry.import'); //#development
    
        signals =           JSON.parse(JSON.stringify(data.signals));
        selectedSignals =   JSON.parse(JSON.stringify(data.selectedSignals));
        events =            JSON.parse(JSON.stringify(data.events));
        events_byID =       JSON.parse(JSON.stringify(data.events_byID));
        events_byPosition = JSON.parse(JSON.stringify(data.events_byPosition));
        positions =         JSON.parse(JSON.stringify(data.positions));
    };

    this.getAllSignals = function(){ 
        dev.log.structure('.signalRegistry.getAllSignals()'); //#development
        dev.count('.structure.signalRegistry.getAllSignals'); //#development
    
        return JSON.parse(JSON.stringify(signals));
    };
    this.getAllEvents = function(){ 
        dev.log.structure('.signalRegistry.getAllEvents()'); //#development
        dev.count('.structure.signalRegistry.getAllEvents'); //#development
    
        return JSON.parse(JSON.stringify(events));
    };
    this.getSignal = function(id){
        dev.log.structure('.signalRegistry.getSignal(',id); //#development
        dev.count('.structure.signalRegistry.getSignal'); //#development
    
        if( signals[id] == undefined ){return;}
        return JSON.parse(JSON.stringify(signals[id]));
    };
    this.eventsBetween = function(start,end){
        dev.log.structure('.signalRegistry.eventsBetween(',start,end); //#development
        dev.count('.structure.signalRegistry.eventsBetween'); //#development
    
        //depending on whether theres an end position or not; get all the events positions that 
        //lie on the start positions, or get all the events that how positions which lie between
        //the start and end positions
        const eventNumbers = end == undefined ? 
            Array.from(new Set(positions.filter(function(a){return a == start;}))) : 
            Array.from(new Set(positions.filter(function(a){return a >= start && a < end;}))) ;

        //for each position, convert the number to a string, and gather the associated event number arrays
        //then, for each array, get each event and place that into the output array
        const compiledEvents = [];
        for(let a = 0; a < eventNumbers.length; a++){
            eventNumbers[a] = events_byPosition[String(eventNumbers[a])];
            for(let b = 0; b < eventNumbers[a].length; b++){
                compiledEvents.push(events[eventNumbers[a][b]]);
            }
        }

        //sort array by position (soonest first)
        return compiledEvents.sort(function(a, b){
            if(a.position < b.position) return -1;
            if(a.position > b.position) return 1;
            return 0;
        });
    };
    this.add = function(data,forceID){
        dev.log.structure('.signalRegistry.add(',data,forceID); //#development
        dev.count('.structure.signalRegistry.add'); //#development
    
        //clean up data
            if(data == undefined || !('line' in data) || !('position' in data) || !('length' in data)){return;}
            if(!('strength' in data)){data.strength = 1;}
        //check for and correct disallowed data
            if(data.line < 0){data.line = 0;}
            if(data.length < 0){data.length = 0;}
            if(data.position < 0){data.position = 0;}
            if(data.strength < 0){data.strength = 0;}

            if(bottomLimit > -1 && (data.line > bottomLimit-1)){data.line = bottomLimit-1;}
            if(signalLengthLimit > -1 && (data.length > signalLengthLimit)){data.length = signalLengthLimit;}
            if(rightLimit > -1 && (data.position > rightLimit) ){data.position = rightLimit-data.length;}
            if(rightLimit > -1 && (data.position+data.length > rightLimit)){ data.length = rightLimit-data.position; }
            if(rightLimit > -1 && (data.position+data.length > rightLimit)){data.position = rightLimit-data.length;}
            if(data.strength > 1){data.strength = 1;}

        //generate signal ID
            let newID = 0;
            if(forceID == undefined){
                while(signals[newID] != undefined){newID++;}
            }else{newID = forceID;}

        //add signal to storage
            signals[newID] = JSON.parse(JSON.stringify(data));

        //generate event data
            const newEvents = [
                {signalID:newID, line:data.line, position:data.position,               strength:data.strength},
                {signalID:newID, line:data.line, position:(data.position+data.length), strength:0}
            ];

        //add event data to storage
            let eventLocation = 0;
            //start event
                while(events[eventLocation] != undefined){eventLocation++;}
                events[eventLocation] = newEvents[0];
                events_byID[newID] = [eventLocation];
                if( events_byPosition[newEvents[0].position] == undefined ){
                    events_byPosition[newEvents[0].position] = [eventLocation];
                }else{
                    events_byPosition[newEvents[0].position].push(eventLocation);
                }
                positions.push(newEvents[0].position);
            //end event
                while(events[eventLocation] != undefined){eventLocation++;}
                events[eventLocation] = newEvents[1];
                events_byID[newID] = events_byID[newID].concat(eventLocation);
                if( events_byPosition[newEvents[1].position] == undefined ){
                    events_byPosition[newEvents[1].position] = [eventLocation];
                }else{
                    events_byPosition[newEvents[1].position].push(eventLocation);
                }
                positions.push(newEvents[1].position);

        return newID;
    };
    this.remove = function(id){
        dev.log.structure('.signalRegistry.remove(',id); //#development
        dev.count('.structure.signalRegistry.remove'); //#development
    
        if( signals[id] == undefined ){return;}

        delete signals[id];

        for(let a = 0; a < events_byID[id].length; a++){
            const tmp = events_byID[id][a];
            events_byPosition[events[tmp].position].splice( events_byPosition[events[tmp].position].indexOf(tmp) ,1);
            positions.splice(positions.indexOf(events[tmp].position),1);
            if( events_byPosition[events[tmp].position].length == 0 ){delete events_byPosition[events[tmp].position];}
            delete events[tmp];
        }

        delete events_byID[id];
    };
    this.update = function(id,data){
        dev.log.structure('.signalRegistry.update(',id,data); //#development
        dev.count('.structure.signalRegistry.update'); //#development
    
        //clean input
            if(data == undefined){return;}
            if(!('line' in data)){data.line = signals[id].line;}

            //Special cases where either by movement or lengthening, the signal stretches further than the rightLimit
            //will allow. In these cases the signal either has to be clipped, or prevented from moving further to the
            //right. In the case where a signal is being lengthened and moved to the right; the system should opt to
            //clip it's length
            //Obviously, if there's no right limit don't bother
            if(rightLimit > -1){
                if('position' in data && 'length' in data){//clip length
                    if(data.length+data.position > rightLimit){ data.length = rightLimit-data.position; }
                }else{
                    if('position' in data){//prevent movement
                        if(signals[id].length+data.position >= rightLimit){ data.position = rightLimit - signals[id].length; }
                    }else{ data.position = signals[id].position; }
                    if('length' in data){//clip length
                        if(data.length+data.position > rightLimit){ data.length = rightLimit-data.position; }
                    }else{ data.length = signals[id].length; }
                }
            }

            if(!('strength' in data)){data.strength = signals[id].strength;}
        
        this.remove(id);
        this.add(data,id);
    };
    this.reset = function(){
        dev.log.structure('.signalRegistry.reset()'); //#development
        dev.count('.structure.signalRegistry.reset'); //#development
    
        signals = [];
        selectedSignals = [];
        events = [];
        events_byID = [];
        events_byPosition = {};
        positions = [];
    };
};