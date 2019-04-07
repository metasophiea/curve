this.button_rectangle = function(
    name='button_rectangle',
    x, y, width=30, height=20, angle=0, interactable=true,
    text_centre='', text_left='', text_right='',
    textVerticalOffsetMux=0.5, textHorizontalOffsetMux=0.05,
    
    active=true, hoverable=true, selectable=false, pressable=true,

    text_font = 'Arial',
    text_size=2.5,
    text_colour = {r:0/255,g:0/255,b:0/255,a:1},
    text_spacing=0.1,

    backing__off__colour=                            {r:180/255,g:180/255,b:180/255,a:1},
    backing__off__lineColour=                        {r:0/255,g:0/255,b:0/255,a:0},
    backing__off__lineThickness=                     0,
    backing__up__colour=                             {r:200/255,g:200/255,b:200/255,a:1},
    backing__up__lineColour=                         {r:0/255,g:0/255,b:0/255,a:0},
    backing__up__lineThickness=                      0,
    backing__press__colour=                          {r:230/255,g:230/255,b:230/255,a:1},
    backing__press__lineColour=                      {r:0/255,g:0/255,b:0/255,a:0},
    backing__press__lineThickness=                   0,
    backing__select__colour=                         {r:200/255,g:200/255,b:200/255,a:1},
    backing__select__lineColour=                     {r:120/255,g:120/255,b:120/255,a:1},
    backing__select__lineThickness=                  0.75,
    backing__select_press__colour=                   {r:230/255,g:230/255,b:230/255,a:1},
    backing__select_press__lineColour=               {r:120/255,g:120/255,b:120/255,a:1},
    backing__select_press__lineThickness=            0.75,
    backing__glow__colour=                           {r:220/255,g:220/255,b:220/255,a:1},
    backing__glow__lineColour=                       {r:0/255,g:0/255,b:0/255,a:0},
    backing__glow__lineThickness=                    0,
    backing__glow_press__colour=                     {r:250/255,g:250/255,b:250/255,a:1},
    backing__glow_press__lineColour=                 {r:0/255,g:0/255,b:0/255,a:0},
    backing__glow_press__lineThickness=              0,
    backing__glow_select__colour=                    {r:220/255,g:220/255,b:220/255,a:1},
    backing__glow_select__lineColour=                {r:120/255,g:120/255,b:120/255,a:1},
    backing__glow_select__lineThickness=             0.75,
    backing__glow_select_press__colour=              {r:250/255,g:250/255,b:250/255,a:1},
    backing__glow_select_press__lineColour=          {r:120/255,g:120/255,b:120/255,a:1},
    backing__glow_select_press__lineThickness=       0.75,
    backing__hover__colour=                          {r:220/255,g:220/255,b:220/255,a:1},
    backing__hover__lineColour=                      {r:0/255,g:0/255,b:0/255,a:0},
    backing__hover__lineThickness=                   0,
    backing__hover_press__colour=                    {r:240/255,g:240/255,b:240/255,a:1},
    backing__hover_press__lineColour=                {r:0/255,g:0/255,b:0/255,a:0},
    backing__hover_press__lineThickness=             0,
    backing__hover_select__colour=                   {r:220/255,g:220/255,b:220/255,a:1},
    backing__hover_select__lineColour=               {r:120/255,g:120/255,b:120/255,a:1},
    backing__hover_select__lineThickness=            0.75,
    backing__hover_select_press__colour=             {r:240/255,g:240/255,b:240/255,a:1},
    backing__hover_select_press__lineColour=         {r:120/255,g:120/255,b:120/255,a:1},
    backing__hover_select_press__lineThickness=      0.75,
    backing__hover_glow__colour=                     {r:240/255,g:240/255,b:240/255,a:1},
    backing__hover_glow__lineColour=                 {r:0/255,g:0/255,b:0/255,a:0},
    backing__hover_glow__lineThickness=              0,
    backing__hover_glow_press__colour=               {r:250/255,g:250/255,b:250/255,a:1},
    backing__hover_glow_press__lineColour=           {r:0/255,g:0/255,b:0/255,a:0},
    backing__hover_glow_press__lineThickness=        0,
    backing__hover_glow_select__colour=              {r:240/255,g:240/255,b:240/255,a:1},
    backing__hover_glow_select__lineColour=          {r:120/255,g:120/255,b:120/255,a:1},
    backing__hover_glow_select__lineThickness=       0.75,
    backing__hover_glow_select_press__colour=        {r:250/255,g:250/255,b:250/255,a:1},
    backing__hover_glow_select_press__lineColour=    {r:120/255,g:120/255,b:120/255,a:1},
    backing__hover_glow_select_press__lineThickness= 0.75,

    onenter = function(event){},
    onleave = function(event){},
    onpress = function(event){},
    ondblpress = function(event){},
    onrelease = function(event){},
    onselect = function(event){},
    ondeselect = function(event){},
){
    //adding on the specific shapes
        //main
            var subject = interfacePart.builder('group',name+'__subGroup');
        //backing
            var backing = interfacePart.builder('rectangleWithOutline','backing',{width:width, height:height, colour:backing__off__colour, thickness:5 });
            subject.append(backing);
        //text
            var text_centre = interfacePart.builder('text','centre', {
                x:width/2, 
                y:height*textVerticalOffsetMux, 
                text:text_centre, 
                width:text_size,
                height:text_size,
                colour:text_colour,
                font:text_font,
                printingMode:{widthCalculation:'absolute',horizontal:'middle',vertical:'middle'},
                spacing:text_spacing,
            });
            subject.append(text_centre);
            var text_left = interfacePart.builder('text','left', {
                x:width*textHorizontalOffsetMux, 
                y:height*textVerticalOffsetMux, 
                text:text_left, 
                width:text_size,
                height:text_size,
                colour:text_colour,
                font:text_font,
                printingMode:{widthCalculation:'absolute',horizontal:'left',vertical:'middle'},
                spacing:text_spacing,
            });
            subject.append(text_left);
            var text_right = interfacePart.builder('text','right',{
                x:width-(width*textHorizontalOffsetMux), 
                y:height*textVerticalOffsetMux, 
                text:text_right, 
                width:text_size,
                height:text_size,
                colour:text_colour,
                font:text_font,
                printingMode:{widthCalculation:'absolute',horizontal:'right',vertical:'middle'},
                spacing:text_spacing,
            });
            subject.append(text_right);
        //cover
            subject.cover = interfacePart.builder('rectangle','cover',{width:width, height:height, colour:{r:0,g:0,b:0,a:0} });
            subject.append(subject.cover);

    //generic button part
        var object = interfacePart.builder(
            'button_', name, {
                x:x, y:y, angle:angle, interactable:interactable,
                active:active, hoverable:hoverable, selectable:selectable, pressable:pressable,

                onenter:onenter,
                onleave:onleave,
                onpress:onpress,
                ondblpress:ondblpress,
                onrelease:onrelease,
                onselect:onselect,
                ondeselect:ondeselect,

                subject:subject,
            }
        );

    //graphical state adjust
        object.activateGraphicalState = function(state){
            if(!active){ 
                backing.colour = backing__off__colour;
                backing.lineColour = backing__off__lineColour;
                backing.thickness( backing__off__lineThickness );
                return;
            }

            var styles = [
                { colour:backing__up__colour,                      lineColour:backing__up__lineColour,                      lineThickness:backing__up__lineThickness                      },
                { colour:backing__press__colour,                   lineColour:backing__press__lineColour,                   lineThickness:backing__press__lineThickness                   },
                { colour:backing__select__colour,                  lineColour:backing__select__lineColour,                  lineThickness:backing__select__lineThickness                  },
                { colour:backing__select_press__colour,            lineColour:backing__select_press__lineColour,            lineThickness:backing__select_press__lineThickness            },
                { colour:backing__glow__colour,                    lineColour:backing__glow__lineColour,                    lineThickness:backing__glow__lineThickness                    },
                { colour:backing__glow_press__colour,              lineColour:backing__glow_press__lineColour,              lineThickness:backing__glow_press__lineThickness              },
                { colour:backing__glow_select__colour,             lineColour:backing__glow_select__lineColour,             lineThickness:backing__glow_select__lineThickness             },
                { colour:backing__glow_select_press__colour,       lineColour:backing__glow_select_press__lineColour,       lineThickness:backing__glow_select_press__lineThickness       },
                { colour:backing__hover__colour,                   lineColour:backing__hover__lineColour,                   lineThickness:backing__hover__lineThickness                   },
                { colour:backing__hover_press__colour,             lineColour:backing__hover_press__lineColour,             lineThickness:backing__hover_press__lineThickness             },
                { colour:backing__hover_select__colour,            lineColour:backing__hover_select__lineColour,            lineThickness:backing__hover_select__lineThickness            },
                { colour:backing__hover_select_press__colour,      lineColour:backing__hover_select_press__lineColour,      lineThickness:backing__hover_select_press__lineThickness      },
                { colour:backing__hover_glow__colour,              lineColour:backing__hover_glow__lineColour,              lineThickness:backing__hover_glow__lineThickness              },
                { colour:backing__hover_glow_press__colour,        lineColour:backing__hover_glow_press__lineColour,        lineThickness:backing__hover_glow_press__lineThickness        },
                { colour:backing__hover_glow_select__colour,       lineColour:backing__hover_glow_select__lineColour,       lineThickness:backing__hover_glow_select__lineThickness       },
                { colour:backing__hover_glow_select_press__colour, lineColour:backing__hover_glow_select_press__lineColour, lineThickness:backing__hover_glow_select_press__lineThickness },
            ];

            if(!hoverable && state.hovering ){ state.hovering = false; }
            if(!selectable && state.selected ){ state.selected = false; }

            var i = state.hovering*8 + state.glowing*4 + state.selected*2 + (pressable && state.pressed)*1;
            backing.colour = styles[i].colour;
            backing.lineColour = styles[i].lineColour;
            backing.thickness( styles[i].lineThickness );
        };
        object.activateGraphicalState({ hovering:false, glowing:false, selected:false, pressed:false });

    return object;
};