const communicationModuleMaker = function(communicationObject,callerName){
    const self = this;
    const devMode = false;
    this.log = function(){
        if(!devMode){return;}
        let prefix = 'communicationModule['+callerName+']';
        console.log('%c'+prefix+(new Array(...arguments).join(' ')),'color:rgb(235, 52, 131); font-style:italic;' );
    };
    this.function = {};

    let messageId = 0;
    const messagingCallbacks = {};

    function generateMessageID(){
        self.log('::generateMessageID()');
        return messageId++;
    }

    communicationObject.onmessage = function(encodedPacket){
        self.log('::communicationObject.onmessage('+JSON.stringify(encodedPacket)+')');
        let message = encodedPacket.data;

        if(message.outgoing){
            self.log('::communicationObject.onmessage -> message is an outgoing one');
            if(message.cargo.function in self.function){
                self.log('::communicationObject.onmessage -> function "'+message.cargo.function+'" found');
                self.log('::communicationObject.onmessage -> function arguments: '+JSON.stringify(message.cargo.arguments));
                if(message.cargo.arguments == undefined){message.cargo.arguments = [];}
                if(message.id == null){
                    self.log('::communicationObject.onmessage -> message ID missing; will not return any data');
                    self.function[message.cargo.function](...message.cargo.arguments);
                }else{
                    self.log('::communicationObject.onmessage -> message ID found; "'+message.id+'", will return any data');
                    communicationObject.postMessage({
                        id:message.id,
                        outgoing:false,
                        cargo:self.function[message.cargo.function](...message.cargo.arguments),
                    });
                }
            }else{
                self.log('::communicationObject.onmessage -> function "'+message.cargo.function+'" not found');
            }
        }else{
            self.log('::communicationObject.onmessage -> message is an incoming one');
            self.log('::communicationObject.onmessage -> message ID: '+message.id+' cargo: '+JSON.stringify(message.cargo));
            messagingCallbacks[message.id](message.cargo);
            delete messagingCallbacks[message.id];
        }
    };
    this.run = function(functionName,argumentList=[],callback,transferables){
        self.log('.run('+functionName+','+JSON.stringify(argumentList)+','+callback+','+JSON.stringify(transferables)+')');
        let id = null;
        if(callback != undefined){
            self.log('.run -> callback was defined; generating message ID');
            id = generateMessageID();
            self.log('.run -> message ID:',id);
            messagingCallbacks[id] = callback;
        }
        communicationObject.postMessage({ id:id, outgoing:true, cargo:{function:functionName,arguments:argumentList} },transferables);
    };
};