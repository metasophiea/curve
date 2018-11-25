this.noteRegistry = function(rightLimit=-1,bottomLimit=-1,blockLengthLimit=-1){
    var notes = [];
    var selectedNotes = [];
    var events = [];
    var events_byID = [];
    var events_byPosition = {};
    var positions = [];

    this.__dump = function(){
        console.log('---- noteRegistry dump ----');

        console.log('\tnotes');
        for(var a = 0; a < notes.length; a++){ 
            console.log( '\t\t', a, ' ' + JSON.stringify(notes[a]) );
        }

        console.log('\tselectedNotes');
        for(var a = 0; a < selectedNotes.length; a++){ 
            console.log( '\t\t', a, ' ' + JSON.stringify(selectedNotes[a]) );
        }

        console.log('\tevents');
        for(var a = 0; a < events.length; a++){ 
            console.log( '\t\t', a, ' ' + JSON.stringify(events[a]) );
        }

        console.log('\tevents_byID');
        for(var a = 0; a < events_byID.length; a++){ 
            console.log( '\t\t', a, ' ' + JSON.stringify(events_byID[a]) );
        }

        console.log('\tevents_byPosition');
        var keys = Object.keys(events_byPosition);
        for(var a = 0; a < keys.length; a++){ 
            console.log( '\t\t', keys[a], ' ' + JSON.stringify(events_byPosition[keys[a]]) );
        }

        console.log('\tpositions');
        for(var a = 0; a < positions.length; a++){ 
            console.log( '\t\t', a, ' ' + JSON.stringify(positions[a]) );
        }
    };

    this.export = function(){
        return JSON.parse(JSON.stringify(
            {
                notes:              notes,
                selectedNotes:      selectedNotes,
                events:             events,
                events_byID:        events_byID,
                events_byPosition:  events_byPosition,
                positions:          positions,
            }
        ));
    };
    this.import = function(data){
        notes =             JSON.parse(JSON.stringify(data.notes));
        selectedNotes =     JSON.parse(JSON.stringify(data.selectedNotes));
        events =            JSON.parse(JSON.stringify(data.events));
        events_byID =       JSON.parse(JSON.stringify(data.events_byID));
        events_byPosition = JSON.parse(JSON.stringify(data.events_byPosition));
        positions =         JSON.parse(JSON.stringify(data.positions));
    };

    this.getAllNotes = function(){ return JSON.parse(JSON.stringify(notes)); };
    this.getAllEvents = function(){ return JSON.parse(JSON.stringify(events)); };
    this.getNote = function(id){
        if( notes[id] == undefined ){return;}
        return JSON.parse(JSON.stringify(notes[id]));
    };
    this.eventsBetween = function(start,end){
        //depending on whether theres an end position or not; get all the events positions that 
        //lie on the start positions, or get all the events that how positions which lie between
        //the start and end positions
        var eventNumbers = end == undefined ? 
            Array.from(new Set(positions.filter(function(a){return a == start;}))) : 
            Array.from(new Set(positions.filter(function(a){return a >= start && a < end;}))) ;

        //for each position, convert the number to a string, and gather the associated event number arrays
        //then, for each array, get each event and place that into the output array
        var compiledEvents = [];
        for(var a = 0; a < eventNumbers.length; a++){
            eventNumbers[a] = events_byPosition[String(eventNumbers[a])];
            for(var b = 0; b < eventNumbers[a].length; b++){
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
        //clean up data
            if(data == undefined || !('line' in data) || !('position' in data) || !('length' in data)){return;}
            if(!('strength' in data)){data.strength = 1;}
        //check for and correct disallowed data
            if(data.line < 0){data.line = 0;}
            if(data.length < 0){data.length = 0;}
            if(data.position < 0){data.position = 0;}
            if(data.strength < 0){data.strength = 0;}

            if(bottomLimit > -1 && (data.line > bottomLimit-1)){data.line = bottomLimit-1;}
            if(blockLengthLimit > -1 && (data.length > blockLengthLimit)){data.length = blockLengthLimit;}
            if(rightLimit > -1 && (data.position > rightLimit) ){data.position = rightLimit-data.length;}
            if(rightLimit > -1 && (data.position+data.length > rightLimit)){ data.length = rightLimit-data.position; }
            if(rightLimit > -1 && (data.position+data.length > rightLimit)){data.position = rightLimit-data.length;}
            if(data.strength > 1){data.strength = 1;}

        //generate note ID
            var newID = 0;
            if(forceID == undefined){
                while(notes[newID] != undefined){newID++;}
            }else{newID = forceID;}

        //add note to storage
            notes[newID] = JSON.parse(JSON.stringify(data));

        //generate event data
            var newEvents = [
                {noteID:newID, line:data.line, position:data.position,               strength:data.strength},
                {noteID:newID, line:data.line, position:(data.position+data.length), strength:0}
            ];

        //add event data to storage
            var eventLocation = 0;
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
        if( notes[id] == undefined ){return;}

        delete notes[id];

        for(var a = 0; a < events_byID[id].length; a++){
            var tmp = events_byID[id][a];
            events_byPosition[events[tmp].position].splice( events_byPosition[events[tmp].position].indexOf(tmp) ,1);
            positions.splice(positions.indexOf(events[tmp].position),1);
            if( events_byPosition[events[tmp].position].length == 0 ){delete events_byPosition[events[tmp].position];}
            delete events[tmp];
        }

        delete events_byID[id];
    };
    this.update = function(id,data){
        //clean input
            if(data == undefined){return;}
            if(!('line' in data)){data.line = notes[id].line;}

            //Special cases where either by movement or lengthening, the note stretches further than the rightLimit
            //will allow. In these cases the note either has to be clipped, or prevented from moving further to the
            //right. In the case where a note is being lengthened and moved to the right; the system should opt to
            //clip it's length
            //Obviously, if there's no right limit don't bother
            if(rightLimit > -1){
                if('position' in data && 'length' in data){//clip length
                    if(data.length+data.position > rightLimit){ data.length = rightLimit-data.position; }
                }else{
                    if('position' in data){//prevent movement
                        if(notes[id].length+data.position >= rightLimit){ data.position = rightLimit - notes[id].length; }
                    }else{ data.position = notes[id].position; }
                    if('length' in data){//clip length
                        if(data.length+data.position > rightLimit){ data.length = rightLimit-data.position; }
                    }else{ data.length = notes[id].length; }
                }
            }

            if(!('strength' in data)){data.strength = notes[id].strength;}
        
        this.remove(id);
        this.add(data,id);
    };
    this.reset = function(){
        notes = [];
        selectedNotes = [];
        events = [];
        events_byID = [];
        events_byPosition = {};
        positions = [];
    };
};