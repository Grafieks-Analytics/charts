// const isVowel = (letter) => "AEIOU".indexOf(letter) !== -1;
const data = [
    {
        letter: "Henderson",
        frequency: 120
    },
    {
        letter: "Los Angeles",
        frequency: 20
    },
    // {
    //     letter: "Fort Lauderdale",
    //     frequency: 30
    // },
    // {
    //     letter: "Concord",
    //     frequency: 0.04253
    // },
    // {
    //     letter: "Seattle",
    //     frequency: 0.12702
    // },
    // {
    //     letter: "Fort Worth",
    //     frequency: 0.02288
    // },
    // {
    //     letter: "Madison",
    //     frequency: 0.02015
    // },
    // {
    //     letter: "West Jordan",
    //     frequency: 0.06094
    // },
    // {
    //     letter: "San Francisco",
    //     frequency: 0.06966
    // },
    // {
    //     letter: "Fremont",
    //     frequency: 0.00153
    // },
    // {
    //     letter: "Philadelphia",
    //     frequency: 0.00772
    // },
    // {
    //     letter: "Orem",
    //     frequency: 0.04025
    // },
    // {
    //     letter: "M",
    //     frequency: 0.02406
    // },
    // {
    //     letter: "N",
    //     frequency: 0.06749
    // },
    // {
    //     letter: "O",
    //     frequency: 0.07507
    // },
    // {
    //     letter: "P",
    //     frequency: 0.01929
    // },
    // {
    //     letter: "Q",
    //     frequency: 0.00095
    // },
    // {
    //     letter: "R",
    //     frequency: 0.05987
    // },
    // {
    //     letter: "S",
    //     frequency: 0.06327
    // },
    // {
    //     letter: "T",
    //     frequency: 0.09056
    // },
    // {
    //     letter: "U",
    //     frequency: 0.02758
    // },
    // {
    //     letter: "V",
    //     frequency: 0.00978
    // },
    // {
    //     letter: "W",
    //     frequency: 0.0236
    // },
    // {
    //     letter: "X",
    //     frequency: 0.0015
    // },
    // {
    //     letter: "Y",
    //     frequency: 0.01974
    // },
    // {
    //     letter: "Z",
    //     frequency: 0.00074
    // }
];
// const data = [
//     {'Furniture': 120},
//     {'Furniture2': 20},
//     {'Furniture3': 30}
// ]
// const ctx = container.querySelector('canvas').getContext('webgl');
var barSeries = fc
    .autoBandwidth(fc.seriesCanvasBar())
    .crossValue((d) => d.letter)
    .align("left")
    .mainValue((d) => d.frequency)
    .decorate((context, datum) => {
        context.textAlign = "center";
        context.fillStyle = "#000";
        context.font = "12px Arial";
        // context.fillText(d3.format(".1%")(datum.frequency), 0, -8);
        // context.fillText((datum.frequency), 0, -8);
        // context.fillStyle = "steelblue";
        context.fillStyle = "red";
        
        // context.fillStyle = isVowel(datum.letter) ? "indianred" : "steelblue";
    })
    // .context(ctx);
    
    // const barSeries = fc
    // .seriesWebglBar()
    // .xScale(xScale)
    // .yScale(yScale)
    // .crossValue(d => d.data.group)
    // .mainValue(d => d[1])
    // .baseValue(d => d[0])
    // .bandwidth(8)
    // .context(ctx);


    console.log("data", data);

    var yExtent = fc
        .extentLinear()
        .accessors([(d) => d.frequency])
        // .pad([0, 0.1])
        .include([0]);

    var chart = fc
        .chartCartesian(d3.scaleBand(), d3.scaleLinear())
        .xDomain(data.map((d) => d.letter))
        .xPadding(0.1)
        .yDomain(yExtent(data))
        // .yTicks(10, "%")
        .yOrient("left")
        .canvasPlotArea(barSeries);
        

    d3.select("#chart").datum(data).call(chart);
