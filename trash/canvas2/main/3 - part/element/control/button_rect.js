this.button_rect = function(
    name='button_rect',
    x, y, width=30, height=20, angle=0,
    text_centre='', text_left='', text_right='',
    textVerticalOffsetMux=0.5, textHorizontalOffsetMux=0.05,
    
    active=true, hoverable=true, selectable=false, pressable=true,

    text_font = '5pt Arial',
    text_textBaseline = 'alphabetic',
    text_fill = 'rgba(0,0,0,1)',
    text_stroke = 'rgba(0,0,0,0)',
    text_lineWidth = 1,

    backing__off__fill=                          'rgba(180,180,180,1)',
    backing__off__stroke=                        'rgba(0,0,0,0)',
    backing__off__lineWidth=                     0,
    backing__up__fill=                           'rgba(200,200,200,1)',
    backing__up__stroke=                         'rgba(0,0,0,0)',
    backing__up__lineWidth=                      0,
    backing__press__fill=                        'rgba(230,230,230,1)',
    backing__press__stroke=                      'rgba(0,0,0,0)',
    backing__press__lineWidth=                   0,
    backing__select__fill=                       'rgba(200,200,200,1)',
    backing__select__stroke=                     'rgba(120,120,120,1)',
    backing__select__lineWidth=                  0.75,
    backing__select_press__fill=                 'rgba(230,230,230,1)',
    backing__select_press__stroke=               'rgba(120,120,120,1)',
    backing__select_press__lineWidth=            0.75,
    backing__glow__fill=                         'rgba(220,220,220,1)',
    backing__glow__stroke=                       'rgba(0,0,0,0)',
    backing__glow__lineWidth=                    0,
    backing__glow_press__fill=                   'rgba(250,250,250,1)',
    backing__glow_press__stroke=                 'rgba(0,0,0,0)',
    backing__glow_press__lineWidth=              0,
    backing__glow_select__fill=                  'rgba(220,220,220,1)',
    backing__glow_select__stroke=                'rgba(120,120,120,1)',
    backing__glow_select__lineWidth=             0.75,
    backing__glow_select_press__fill=            'rgba(250,250,250,1)',
    backing__glow_select_press__stroke=          'rgba(120,120,120,1)',
    backing__glow_select_press__lineWidth=       0.75,
    backing__hover__fill=                        'rgba(220,220,220,1)',
    backing__hover__stroke=                      'rgba(0,0,0,0)',
    backing__hover__lineWidth=                   0,
    backing__hover_press__fill=                  'rgba(240,240,240,1)',
    backing__hover_press__stroke=                'rgba(0,0,0,0)',
    backing__hover_press__lineWidth=             0,
    backing__hover_select__fill=                 'rgba(220,220,220,1)',
    backing__hover_select__stroke=               'rgba(120,120,120,1)',
    backing__hover_select__lineWidth=            0.75,
    backing__hover_select_press__fill=           'rgba(240,240,240,1)',
    backing__hover_select_press__stroke=         'rgba(120,120,120,1)',
    backing__hover_select_press__lineWidth=      0.75,
    backing__hover_glow__fill=                   'rgba(240,240,240,1)',
    backing__hover_glow__stroke=                 'rgba(0,0,0,0)',
    backing__hover_glow__lineWidth=              0,
    backing__hover_glow_press__fill=             'rgba(250,250,250,1)',
    backing__hover_glow_press__stroke=           'rgba(0,0,0,0)',
    backing__hover_glow_press__lineWidth=        0,
    backing__hover_glow_select__fill=            'rgba(240,240,240,1)',
    backing__hover_glow_select__stroke=          'rgba(120,120,120,1)',
    backing__hover_glow_select__lineWidth=       0.75,
    backing__hover_glow_select_press__fill=      'rgba(250,250,250,1)',
    backing__hover_glow_select_press__stroke=    'rgba(120,120,120,1)',
    backing__hover_glow_select_press__lineWidth= 0.75,

    onenter = function(event){},
    onleave = function(event){},
    onpress = function(event){},
    ondblpress = function(event){},
    onrelease = function(event){},
    onselect = function(event){},
    ondeselect = function(event){},
){
    //elements 
        //main
            var object = canvas.part.builder('group',name,{x:x, y:y, angle:angle});
        
        //backing
            var backing = canvas.part.builder('rectangle','backing',{width:width, height:height, style:{
                fill:backing__off__fill,
                stroke:backing__off__stroke,
                lineWidth:backing__off__lineWidth,
            }});
            object.append(backing);

        //text
            var text_centre = canvas.part.builder('text','centre', {
                x:width/2, 
                y:height*textVerticalOffsetMux, 
                text:text_centre, 
                style:{
                    font:text_font,
                    testBaseline:text_textBaseline,
                    fill:text_fill,
                    stroke:text_stroke,
                    lineWidth:text_lineWidth,
                    textAlign:'center',
                    textBaseline:'middle',
                }
            });
            object.append(text_centre);
            var text_left = canvas.part.builder('text','left',     {
                x:width*textHorizontalOffsetMux, 
                y:height*textVerticalOffsetMux, 
                text:text_left, 
                style:{
                    font:text_font,
                    testBaseline:text_textBaseline,
                    fill:text_fill,
                    stroke:text_stroke,
                    lineWidth:text_lineWidth,
                    textAlign:'left',
                    textBaseline:'middle',
                }
            });
            object.append(text_left);
            var text_right = canvas.part.builder('text','right',   {
                x:width-(width*textHorizontalOffsetMux), 
                y:height*textVerticalOffsetMux, 
                text:text_right, 
                style:{
                    font:text_font,
                    testBaseline:text_textBaseline,
                    fill:text_fill,
                    stroke:text_stroke,
                    lineWidth:text_lineWidth,
                    textAlign:'right',
                    textBaseline:'middle',
                }
            });
            object.append(text_right);

        //cover
            var cover = canvas.part.builder('rectangle','cover',{width:width, height:height, style:{fill:'rgba(0,0,0,0)'}});
            object.append(cover);




    //state
        object.state = {
            hovering:false,
            glowing:false,
            selected:false,
            pressed:false,
        };

        function activateGraphicalState(){
            if(!active){ 
                backing.style.fill = backing__off__fill;
                backing.style.stroke = backing__off__stroke;
                backing.style.lineWidth = backing__off__lineWidth;
                return;
            }

            var styles = [
                { fill:backing__up__fill,                      stroke:backing__up__stroke,                      lineWidth:backing__up__lineWidth                      },
                { fill:backing__press__fill,                   stroke:backing__press__stroke,                   lineWidth:backing__press__lineWidth                   },
                { fill:backing__select__fill,                  stroke:backing__select__stroke,                  lineWidth:backing__select__lineWidth                  },
                { fill:backing__select_press__fill,            stroke:backing__select_press__stroke,            lineWidth:backing__select_press__lineWidth            },
                { fill:backing__glow__fill,                    stroke:backing__glow__stroke,                    lineWidth:backing__glow__lineWidth                    },
                { fill:backing__glow_press__fill,              stroke:backing__glow_press__stroke,              lineWidth:backing__glow_press__lineWidth              },
                { fill:backing__glow_select__fill,             stroke:backing__glow_select__stroke,             lineWidth:backing__glow_select__lineWidth             },
                { fill:backing__glow_select_press__fill,       stroke:backing__glow_select_press__stroke,       lineWidth:backing__glow_select_press__lineWidth       },
                { fill:backing__hover__fill,                   stroke:backing__hover__stroke,                   lineWidth:backing__hover__lineWidth                   },
                { fill:backing__hover_press__fill,             stroke:backing__hover_press__stroke,             lineWidth:backing__hover_press__lineWidth             },
                { fill:backing__hover_select__fill,            stroke:backing__hover_select__stroke,            lineWidth:backing__hover_select__lineWidth            },
                { fill:backing__hover_select_press__fill,      stroke:backing__hover_select_press__stroke,      lineWidth:backing__hover_select_press__lineWidth      },
                { fill:backing__hover_glow__fill,              stroke:backing__hover_glow__stroke,              lineWidth:backing__hover_glow__lineWidth              },
                { fill:backing__hover_glow_press__fill,        stroke:backing__hover_glow_press__stroke,        lineWidth:backing__hover_glow_press__lineWidth        },
                { fill:backing__hover_glow_select__fill,       stroke:backing__hover_glow_select__stroke,       lineWidth:backing__hover_glow_select__lineWidth       },
                { fill:backing__hover_glow_select_press__fill, stroke:backing__hover_glow_select_press__stroke, lineWidth:backing__hover_glow_select_press__lineWidth },
            ];

            if(!hoverable && object.state.hovering ){ object.state.hovering = false; }
            if(!selectable && object.state.selected ){ object.state.selected = false; }

            var i = object.state.hovering*8 + object.state.glowing*4 + object.state.selected*2 + (pressable && object.state.pressed)*1;
            backing.style.fill =       styles[i].fill;
            backing.style.stroke =     styles[i].stroke;
            backing.style.lineWidth =  styles[i].lineWidth;
        };
        activateGraphicalState();




    //control
        object.press = function(event){
            if(!active){return;}

            if( pressable ){
                if(this.state.pressed){return;}
                this.state.pressed = true;
                if(this.onpress){this.onpress(this, event);}
            }
            
            this.select( !this.select(), event );

            activateGraphicalState();
        };
        object.release = function(event){
            if(!active || !pressable){return;}

            if(!this.state.pressed){return;}
            this.state.pressed = false;
            activateGraphicalState();
            if(this.onrelease){this.onrelease(this, event);}
        };
        object.active = function(bool){ if(bool == undefined){return active;} active = bool; activateGraphicalState(); };
        object.glow = function(bool){   if(bool == undefined){return this.state.glowing;}  this.state.glowing = bool;  activateGraphicalState(); };
        object.select = function(bool,event,callback=true){ 
            if(!active){return;}

            if(bool == undefined){return this.state.selected;}
            if(!selectable){return;}
            if(this.state.selected == bool){return;}
            this.state.selected = bool; activateGraphicalState();
            if(callback){ if( this.state.selected ){ this.onselect(this,event); }else{ this.ondeselect(this,event); } }
        };




    //interactivity
        cover.onmouseenter = function(x,y,event){
            object.state.hovering = true;  
            activateGraphicalState();
            if(object.onenter){object.onenter(event);}
            if(event.buttons == 1){cover.onmousedown(event);} 
        };
        cover.onmouseleave = function(x,y,event){ 
            object.state.hovering = false; 
            object.release(event); 
            activateGraphicalState(); 
            if(object.onleave){object.onleave(event);}
        };
        cover.onmouseup = function(x,y,event){   object.release(event); };
        cover.onmousedown = function(x,y,event){ object.press(event); };
        cover.ondblclick = function(x,y,event){ if(!active){return;} if(object.ondblpress){object.ondblpress(event);} };
        



    //callbacks
        object.onenter = onenter;
        object.onleave = onleave;
        object.onpress = onpress;
        object.ondblpress = ondblpress;
        object.onrelease = onrelease;
        object.onselect = onselect;
        object.ondeselect = ondeselect;

    return object;
};