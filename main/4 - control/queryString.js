control.interaction.devMode( (new URL(window.location.href)).searchParams.get("dev") != null );




var modsBeingLoaded = 0;

this.modParameterKey = 'mod';
this.controlModListPostfix = 'cml';
this.demoParameterKey = 'demo';
this.defaultDemoUrlPrefix =  'https://curve.metasophiea.com/demos/';

this.modsBeingLoaded = function(){return modsBeingLoaded;};
this.modLoader = function(loadingCompleteCallback){
    function loadMod(modURL){
        modsBeingLoaded++;

        _canvas_.library.misc.loadFileFromURL(modURL,function(responseText){
            var modListFileExtension = '.'+_canvas_.control.queryString.controlModListPostfix;
            if( modURL.slice(-modListFileExtension.length) == modListFileExtension ){
                responseText.split('\n').forEach(url => loadMod(url));
            }else{
                var newScript = document.createElement('script');
                newScript.innerHTML = responseText;
                newScript.id = modURL;
                document.body.append(newScript);
            }
            modsBeingLoaded--;

            if(modsBeingLoaded == 0 && loadingCompleteCallback){loadingCompleteCallback();}
        },'text');
    }
    
    var tmp = (new URL(window.location.href)).searchParams.get(_canvas_.control.queryString.modParameterKey);
    if(tmp != undefined){ loadMod(tmp); }

    var counter = 1;
    do{
        tmp = (new URL(window.location.href)).searchParams.get(_canvas_.control.queryString.modParameterKey+counter++);
        if(tmp != undefined){ loadMod(tmp); }
    }while(tmp != undefined)
};
this.demoLoader = function(loadingCompleteCallback,beDumbAboutIt=false){
    function loadDemo(){
        var demoURL = (new URL(window.location.href)).searchParams.get(_canvas_.control.queryString.demoParameterKey);
    
        if(demoURL == undefined){
            return;
        }else if( !isNaN(parseInt(demoURL)) ){
            document.getElementById('workspaceCanvas').control.scene.load(_canvas_.control.queryString.defaultDemoUrlPrefix+parseInt(demoURL)+'.crv',loadingCompleteCallback);
        }else{ 
            document.getElementById('workspaceCanvas').control.scene.load(demoURL,loadingCompleteCallback);
        }
    }
    function waiter(){
        if(modsBeingLoaded > 0){ setTimeout(waiter,1000); return; }
        loadDemo();
    }

    beDumbAboutIt ? loadDemo() : waiter();
};