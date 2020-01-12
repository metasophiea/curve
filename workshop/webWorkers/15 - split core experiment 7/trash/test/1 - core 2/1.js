const randomRectangleCount = 5000;

_canvas_.core.meta.go = function(){
    _canvas_.core.render.getCanvasSize().then(canvasSize => {
        let promiseArray = [];
        for(let a = 0; a < randomRectangleCount; a++){
            _canvas_.core.element.create('rectangle','rect_'+a).then(rectangle => {
                rectangle.unifiedAttribute({
                    x:canvasSize.width*Math.random(), y:canvasSize.height*Math.random(),
                    width:Math.random()*50, height:Math.random()*50,
                    anchor:{x:Math.random(),y:Math.random()},
                    angle:Math.PI*2*Math.random(),
                    colour:{r:Math.random(),g:Math.random(),b:Math.random(),a:1}
                });
                _canvas_.core.arrangement.append(rectangle);
            });
        }

        setTimeout(_canvas_.core.render.frame,500);
    });
};