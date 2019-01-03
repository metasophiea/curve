# [curve](http://metasophiea.com/curve)

## A Project In Three Parts
- **_Curve_** is a musical workstation designed to be like real-world music making machines. There's synthesizers and effect units and keyboards and all sorts of stuff you can plug together and play with. 

- **_Workspace_** is a interface framework that is being written alongside Curve. With it, one can create graphical objects and have them interact with one another and the user, in a visual and natural way. All the basic and common stuff is taken care of, so you can focus on making what you actually want to make. It's not useful for all situations, but if you know that networking objects together will be a real factor in whatever you're doing; Workspace will be your friend. Just play around with Curve and you'll understand.

- **_Core_** is a canvas-based graphical framework written to replace the project's reliance on SVG. It's a bit shakey, and is certianly not the best replacement of SVG, but for the needs of the project it works just fine, and has already allowed the system to work on more browsers and machines. In future, I hope to re-write more of this part to utilise webGL, hopefully increasing the speed of the render and the system overall. Core also comes with the ability to render single frames, so I'm also looking into it being used as a full-webpage display tool, for regular websites.


None of these things are anyway near finished yet, but have developed far enough that I feel confident in putting them online. They're also all intertwined pretty strongly; Core is being developed to make Workspace, and Workspace is being developed to make Curve.

I write elsewhere, so updates will probably come in sudden bundles. Check the [log](docs/notes/log) to see what's been happening

## Structure
- __main__ is where the program itself is stored, seperated into five folders (which are also the five main globals) Theoretically; there is an order of dependency keeping things kinda clean, which goes "library -> core -> system -> interface -> control" however nothing is perfect and things are still forming into that dream. You can probably guess by the names what each part does and how they fit together.
- __workshop__ is where most experimentation, development and testing of new sections happens
- __test__ is where you can find test code for all the sections of the main system. Some of these codes are snazzy code testing code with pass/fail tests and stuff; other parts are more hand-wavy and require a person to determine whether something is working correctly or not.
- __compliation__ contains all the tools necessary to put the program together into a single js file which is stored in 'docs'. (There's also closure in there for packing things into the "deployment" edition (workspace.min.js) but it's not working right now)
- __docs__ consists of all the other stuff; the help files, notes, demo files, gifs, etc. Along with the html files for the website and the produced program files.

## Compiling
You can use the 'comp' function (./compliation/comp.sh) in the compliation folder to quickly build together the latest version of Curve and play around with whatever I was working on last by opening the 'docs/test.html' file in a browser.
The command uses a little JavaScript compiler written in Python3 called Gravity, which goes through JS files looking for commands and execute them, ultimatly producing a single JS file. So far there's only one command - a straightforward include - but that's all I really need right now. The 'heavyComp' is used to produce "production" versions of the code. This version uses gravity to build together the program, then Clousure to pack it all up. (not working right now, as Clousure is having trouble with variables named 'static' in Core.. apparently this has been a bug since 2016, so, I'm working on a way around it. Probably renaming)

## Compatibility
Reciently (3/1/2019) I finished my overhaul of the graphical backend of the project, taking out the SVG aspect and replacing it with Core (a custom written Canvas backend). So far it's been pretty happy working on most browsers, but more testing is needed. Safari is still unable to handle WebAudio, so I recommend just sticking with Chrome (and maybe Firefox) for now.

## Demos
- [Demo 1](https://curve.metasophiea.com?demo=1) 
