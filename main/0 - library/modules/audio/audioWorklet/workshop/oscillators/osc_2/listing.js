//oscillatorWithMultiLevelPhaseModulation
{
    name:'osc_2',
    worklet:new Blob([`
        {{include:worklet.js}}
    `], { type: "text/javascript" }),
    class:
        {{include:node.js}}
    ,
},