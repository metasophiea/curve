var group_1 = _canvas_.core.shape.create('group');
group_1.name = 'group_1';
    group_1.x(100);
    group_1.y(100);
    _canvas_.core.arrangement.append(group_1);
var rectangle_1 = _canvas_.core.shape.create('rectangle');
    rectangle_1.name = 'rectangle_1';
    rectangle_1.width(30);
    rectangle_1.height(30);
    rectangle_1.colour = {r:1,g:0,b:0,a:1};
    group_1.append(rectangle_1);
var group_2 = _canvas_.core.shape.create('group');
    group_2.name = 'group_2';
    group_2.x(50);
    group_1.append(group_2);
    var rectangle_2 = _canvas_.core.shape.create('rectangle');
        rectangle_2.name = 'rectangle_2';
        rectangle_2.width(30);
        rectangle_2.height(30);
        rectangle_2.colour = {r:0,g:1,b:0,a:1};
        group_2.append(rectangle_2);
    var rectangle_3 = _canvas_.core.shape.create('rectangle');
        rectangle_3.name = 'rectangle_3';
        rectangle_3.x(50);
        rectangle_3.width(30);
        rectangle_3.height(30);
        rectangle_3.colour = {r:0,g:0,b:1,a:1};
        group_2.append(rectangle_3);

var tick = 0;
setInterval(function(){
    group_2.angle( group_2.angle() + 0.01 );
    group_1.scale( 1 + 0.5*Math.sin( 2*Math.PI*tick ) );
    group_2.scale( 1 + 0.5*Math.sin( 2*Math.PI*tick + Math.PI/4 ) );
    rectangle_3.scale( 1 + 0.5*Math.sin( 2*Math.PI*tick + Math.PI/2 ) );
    tick += 0.01;
},1000/40);

_canvas_.core.render.active(true);