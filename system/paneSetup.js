__globals.panes = {'global':null, 'background':null, 'middleground':null, 'foreground':null, 'menu':null};

if( __globals.svgElement.children ){
    //go through SVG and see if the 'global', 'background', 'middleground', 'foreground' and 'menu' elements have already been made
    for(var a = 0; a < __globals.svgElement.children.length; a++){
        if( __globals.svgElement.children[a].hasAttribute('pane') ){
            switch(__globals.svgElement.children[a].getAttribute('pane')){
                case 'global': __globals.panes.global = __globals.svgElement.children[a]; break;
                case 'background': __globals.panes.background = __globals.svgElement.children[a]; break;
                case 'middleground': __globals.panes.middleground = __globals.svgElement.children[a]; break;
                case 'foreground': __globals.panes.foreground = __globals.svgElement.children[a]; break;
                case 'menu': __globals.panes.menu = __globals.svgElement.children[a]; break;
            }
        }
    }

    //if the 'background', 'middleground' or 'menu' elements were not made, create them
    if(__globals.panes.global == null){ __globals.panes.global = document.createElementNS('http://www.w3.org/2000/svg','g'); }
    if(__globals.panes.background == null){ 
        __globals.panes.background = document.createElementNS('http://www.w3.org/2000/svg','g');
        __globals.panes.background.setAttribute('pane','background');
    }
    if(__globals.panes.middleground == null){ 
        __globals.panes.middleground = document.createElementNS('http://www.w3.org/2000/svg','g');
        __globals.panes.middleground.setAttribute('pane','middleground');
    }
    if(__globals.panes.foreground == null){ 
        __globals.panes.foreground = document.createElementNS('http://www.w3.org/2000/svg','g');
        __globals.panes.foreground.setAttribute('pane','foreground');
    }
    if(__globals.panes.menu == null){ 
        __globals.panes.menu = document.createElementNS('http://www.w3.org/2000/svg','g');
        __globals.panes.menu.setAttribute('pane','menu'); 
    }
}

//make panes unselectable
__globals.utility.makeUnselectable(__globals.panes.background );
__globals.utility.makeUnselectable(__globals.panes.middleground );
__globals.utility.makeUnselectable(__globals.panes.foreground );


//setup global
if(!__globals.panes.global.style.transform){ __globals.panes.global.style.transform = 'translate(0px,0px) scale(1) rotate(0rad)'; }
__globals.panes.global.setAttribute('global',true);

//clear out svg element
__globals.svgElement.innerHTML = '';

//add __globals.panes to svg element
__globals.svgElement.append(__globals.panes.global);
__globals.panes.global.append(__globals.panes.background);
__globals.panes.global.append(__globals.panes.middleground);
__globals.panes.global.append(__globals.panes.foreground);
__globals.svgElement.append(__globals.panes.menu);