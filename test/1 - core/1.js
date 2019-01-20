var grou1 = workspace.core.arrangement.createElement('group');
    grou1.name = 'testGroup1';
    grou1.x = 50; grou1.y = 50;
    grou1.angle = 0.3;
    workspace.core.arrangement.append(grou1);

var rect = workspace.core.arrangement.createElement('rectangle');
    rect.name = 'testRectangle1';
    rect.x = 0; rect.y = 0;
    rect.width = 30; rect.height = 30;
    rect.style.fill = 'rgba(0,255,0,0.3)';
    grou1.append(rect);

var rect = workspace.core.arrangement.createElement('rectangle');
    rect.name = 'testRectangle2';
    rect.x = 30; rect.y = 30;
    rect.width = 30; rect.height = 30;
    rect.style.fill = 'rgba(0,255,0,0.3)';
    grou1.append(rect);

var rect = workspace.core.arrangement.createElement('rectangle');
    rect.name = 'testRectangle3';
    rect.x = 10; rect.y = 100;
    rect.width = 30; rect.height = 30;
    rect.style.fill = 'rgba(255,0,0,0.4)';
    grou1.append(rect);
    rect.parent = grou1;
var text = workspace.core.arrangement.createElement('text');
    text.name = 'testText1';
    text.x = 10; text.y = 100;
    text.size = 2;
    text.dotFrame = true;
    grou1.append(text);

workspace.core.render.frame();