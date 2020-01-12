let group_1;
let group_2;
let rectangle_1;
let rectangle_2;
let rectangle_3;

_canvas_.core.go.add( function(){ 

    group_1 = _canvas_.core.element.create('group','group_1');
    group_1.unifiedAttribute({ x:100, y:100 });
    _canvas_.core.arrangement.append(group_1);

    group_2 = _canvas_.core.element.create('group','group_2');
    group_2.unifiedAttribute({ x:50 });
    group_1.append(group_2);

    rectangle_1 = _canvas_.core.element.create('rectangle','rectangle_1');
    rectangle_1.unifiedAttribute({ width:30, height:30, colour:{r:1,g:0,b:0,a:1} });
    group_1.append(rectangle_1);

    rectangle_2 = _canvas_.core.element.create('rectangle','rectangle_2');
    rectangle_2.unifiedAttribute({ width:30, height:30, colour:{r:0,g:1,b:0,a:1} });
    group_2.append(rectangle_2);

    rectangle_3 = _canvas_.core.element.create('rectangle','rectangle_1');
    rectangle_3.unifiedAttribute({ x:50, width:30, height:30, colour:{r:0,g:0,b:1,a:1} });
    group_2.append(rectangle_3);

    let tick = 0;
    setInterval(function(){
        group_1.angle(group_1.angle()+0.04);
        group_1.scale(1 + 0.5*Math.sin( 2*Math.PI*tick ));

        group_2.angle(group_2.angle()+0.04);
        group_2.scale(1 + 0.5*Math.sin( 2*Math.PI*tick ));

        rectangle_3.angle(rectangle_3.angle()+0.04);
        rectangle_3.scale(1 + 0.5*Math.sin( 2*Math.PI*tick + Math.PI/2));

        tick += 0.01;
    },1000/40);
} );

_canvas_.core.render.active(true);

setTimeout(()=>{_canvas_.core.arrangement.printTree()},500);