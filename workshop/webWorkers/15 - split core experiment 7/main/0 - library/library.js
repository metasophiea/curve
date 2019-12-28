this.versionInformation = { tick:0, lastDateModified:{y:'????',m:'??',d:'??'} };
const library = this;

{{include:dev.js}}

this.math = new function(){
    {{include:modules/math/main.js}}
};
this.glsl = new function(){
    {{include:modules/glsl.js}}
};
this.structure = new function(){
    {{include:modules/structure.js}}
};
this.audio = new function(){
    {{include:modules/audio.js}}
};
this.font = new function(){
    {{include:modules/font.js}}
};
this.misc = new function(){
    {{include:modules/misc.js}}
};
const _thirdparty = new function(){
    const thirdparty = this;
    {{include:modules/thirdparty/*}} /**/
};