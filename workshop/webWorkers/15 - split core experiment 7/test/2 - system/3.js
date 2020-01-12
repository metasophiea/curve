_canvas_.system.go.add( function(){
    _canvas_.system.keyboard.functionList.onkeydown.push(
        {
            requiredKeys:[],
            function:function(data){
                console.log('>',data.event.code, JSON.stringify(data.event));
                return false; 
            }
        }
    );
    _canvas_.system.keyboard.functionList.onkeyup.push(
        {
            requiredKeys:[],
            function:function(data){
                console.log('<',data.event.code, JSON.stringify(data.event));
                return false; 
            }
        }
    );


    _canvas_.system.keyboard.functionList.onkeydown.push(
        {
            requiredKeys:[['control','KeyV'],['command','KeyV']],
            function:function(data){
                _canvas_.system.keyboard.releaseAll();
                console.log('paste!',JSON.stringify(data),JSON.stringify(_canvas_.system.keyboard.pressedKeys));
                return true; 
            }
        }
    );
} );