var rect = canvas.core.arrangement.createElement('rectangle');
    rect.name = 'testRectangle1';
    rect.x = 0; rect.y = 0;
    rect.width = 30; rect.height = 30;
    rect.style.fill = 'rgba(0,255,0,0.3)';
    canvas.system.pane.mm.append(rect);
var rect = canvas.core.arrangement.createElement('rectangle');
    rect.name = 'testRectangle2';
    rect.x = 200; rect.y = 0;
    rect.width = 30; rect.height = 30;
    rect.angle = 0.2;
    rect.anchor = {x:0.5,y:0.5};
    rect.style.fill = 'rgba(0,255,0,0.3)';
    canvas.system.pane.mm.append(rect);

var img = canvas.core.arrangement.createElement('image');
    img.name = 'testImage1';
    img.x = 50; img.y = 10;
    img.width = 100; img.height = 100;
    img.angle = -0.2;
    img.url = 'https://t2.genius.com/unsafe/300x300/https%3A%2F%2Fimages.genius.com%2F72ee0b753f056baa410c17a6ad9fea70.588x588x1.jpg';
    canvas.system.pane.mm.append(img);

var g = canvas.core.arrangement.createElement('group');
    g.name = 'testGroup1';
    g.x = 50; g.y = 10;
    g.angle = 0.2;
    canvas.system.pane.mm.append(g);
var rect = canvas.core.arrangement.createElement('rectangle');
    rect.name = 'testRectangle1';
    rect.x = 0; rect.y = 0;
    rect.width = 30; rect.height = 30;
    rect.style.fill = 'rgba(0,255,0,0.9)';
    g.append(rect);
var rect = canvas.core.arrangement.createElement('rectangle');
    rect.name = 'testRectangle2';
    rect.x = 40; rect.y = 0;
    rect.width = 30; rect.height = 30;
    rect.style.fill = 'rgba(0,255,0,0.9)';
    g.append(rect);
var poly = canvas.core.arrangement.createElement('polygon');
    poly.name = 'testPolygon1';
    poly.points = [{x:0,y:0}, {x:50,y:0}, {x:50,y:50}, {x:40,y:50}, {x:40,y:20}, {x:20,y:20}, {x:20,y:50}, {x:0,y:50}];
    g.append(poly);

var circ = canvas.core.arrangement.createElement('circle');
    circ.name = 'testCircle1';
    circ.x = 100; circ.y = 30;
    circ.r = 15;
    canvas.system.pane.mm.append(circ);

var text = canvas.core.arrangement.createElement('text');
    text.name = 'testText1';
    text.x = 200; text.y = 50;
    text.angle = 0.4;
    canvas.system.pane.mm.append(text);