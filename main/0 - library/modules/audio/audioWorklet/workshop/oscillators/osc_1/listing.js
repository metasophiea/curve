//oscillatorWithMultiLevelPhaseModulation
{
    name:'osc_1',
    worklet:new Blob([`
        {{include:worklet.js}}
    `], { type: "text/javascript" }),
    class:
        {{include:node.js}}
    ,
},