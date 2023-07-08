const CONSTANTS = require("../constants");
const drawD3FCLineCharts = (datas) => {
    console.log("datafrom d3fc line", grafieks.dataUtils.dataValues);
    // data = grafieks.dataUtils.dataValues;
    data = window.transformedDataValues;

    // Assuming you have the data for the multiline chart

    // const data = [
    //     ["Furniture", "Henderson", 2250],
    //     ["Furniture", "Los Angeles", 4310],
    //     ["Furniture", "Fort Lauderdale", 1916],
    //     ["Furniture", "Concord", 0],
    //     ["Furniture", "Seattle", 1576],
    //     ["Furniture", "Fort Worth", 0],
    //     ["Furniture", "Madison", 0],
    //     ["Furniture", "West Jordan", 0],
    //     ["Furniture", "San Francisco", 0],
    //     ["Furniture", "Fremont", 0],
    //     ["Furniture", "Philadelphia", 6556],
    //     ["Furniture", "Orem", 2090],
    //     ["Furniture", "Houston", 2748],
    //     ["Furniture", "Richardson", 382],
    //     ["Furniture", "Naperville", 0],
    //     ["Furniture", "Melbourne", 0],
    //     ["Furniture", "Eagan", 0],
    //     ["Furniture", "Westland", 0],
    //     ["Furniture", "Dover", 0],
    //     ["Furniture", "New Albany", 192],
    //     ["Furniture", "New York City", 278],
    //     ["Furniture", "Troy", 638],
    //     ["Furniture", "Chicago", 426],
    //     ["Furniture", "Gilbert", 0],
    //     ["Furniture", "Springfield", 0],
    //     ["Furniture", "Jackson", 0],
    //     ["Furniture", "Memphis", 1858],
    //     ["Furniture", "Decatur", 0],
    //     ["Furniture", "Durham", 0],
    //     ["Furniture", "Columbia", 604],
    //     ["Furniture", "Rochester", 0],
    //     ["Furniture", "Minneapolis", 106],
    //     ["Furniture", "Portland", 0],
    //     ["Furniture", "Saint Paul", 0],
    //     ["Furniture", "Aurora", 204],
    //     ["Furniture", "Charlotte", 0],
    //     ["Furniture", "Urbandale", 0],
    //     ["Furniture", "Columbus", 0],
    //     ["Furniture", "Bristol", 0],
    //     ["Furniture", "Wilmington", 94],
    //     ["Furniture", "Bloomington", 1236],
    //     ["Furniture", "Phoenix", 0],
    //     ["Furniture", "Roseville", 86],
    //     ["Office Supplies", "Henderson", 0],
    //     ["Office Supplies", "Los Angeles", 890],
    //     ["Office Supplies", "Fort Lauderdale", 44],
    //     ["Office Supplies", "Concord", 32],
    //     ["Office Supplies", "Seattle", 816],
    //     ["Office Supplies", "Fort Worth", 144],
    //     ["Office Supplies", "Madison", 1332],
    //     ["Office Supplies", "West Jordan", 112],
    //     ["Office Supplies", "San Francisco", 238],
    //     ["Office Supplies", "Fremont", 158],
    //     ["Office Supplies", "Philadelphia", 244],
    //     ["Office Supplies", "Orem", 0],
    //     ["Office Supplies", "Houston", 656],
    //     ["Office Supplies", "Richardson", 0],
    //     ["Office Supplies", "Naperville", 0],
    //     ["Office Supplies", "Melbourne", 192],
    //     ["Office Supplies", "Eagan", 34],
    //     ["Office Supplies", "Westland", 424],
    //     ["Office Supplies", "Dover", 0],
    //     ["Office Supplies", "New Albany", 226],
    //     ["Office Supplies", "New York City", 40],
    //     ["Office Supplies", "Troy", 612],
    //     ["Office Supplies", "Chicago", 594],
    //     ["Office Supplies", "Gilbert", 2226],
    //     ["Office Supplies", "Springfield", 152],
    //     ["Office Supplies", "Jackson", 38],
    //     ["Office Supplies", "Memphis", 146],
    //     ["Office Supplies", "Decatur", 450],
    //     ["Office Supplies", "Durham", 402],
    //     ["Office Supplies", "Columbia", 0],
    //     ["Office Supplies", "Rochester", 60],
    //     ["Office Supplies", "Minneapolis", 92],
    //     ["Office Supplies", "Portland", 12],
    //     ["Office Supplies", "Saint Paul", 156],
    //     ["Office Supplies", "Aurora", 74],
    //     ["Office Supplies", "Charlotte", 6],
    //     ["Office Supplies", "Urbandale", 206],
    //     ["Office Supplies", "Columbus", 596],
    //     ["Office Supplies", "Bristol", 316],
    //     ["Office Supplies", "Wilmington", 746],
    //     ["Office Supplies", "Bloomington", 0],
    //     ["Office Supplies", "Phoenix", 492],
    //     ["Office Supplies", "Roseville", 426],
    //     ["Technology", "Henderson", 0],
    //     ["Technology", "Los Angeles", 1990],
    //     ["Technology", "Fort Lauderdale", 0],
    //     ["Technology", "Concord", 0],
    //     ["Technology", "Seattle", 0],
    //     ["Technology", "Fort Worth", 0],
    //     ["Technology", "Madison", 0],
    //     ["Technology", "West Jordan", 0],
    //     ["Technology", "San Francisco", 426],
    //     ["Technology", "Fremont", 0],
    //     ["Technology", "Philadelphia", 0],
    //     ["Technology", "Orem", 0],
    //     ["Technology", "Houston", 742],
    //     ["Technology", "Richardson", 2196],
    //     ["Technology", "Naperville", 294],
    //     ["Technology", "Melbourne", 0],
    //     ["Technology", "Eagan", 92],
    //     ["Technology", "Westland", 0],
    //     ["Technology", "Dover", 44],
    //     ["Technology", "New Albany", 0],
    //     ["Technology", "New York City", 2060],
    //     ["Technology", "Troy", 0],
    //     ["Technology", "Chicago", 192],
    //     ["Technology", "Gilbert", 336],
    //     ["Technology", "Springfield", 0],
    //     ["Technology", "Jackson", 0],
    //     ["Technology", "Memphis", 0],
    //     ["Technology", "Decatur", 0],
    //     ["Technology", "Durham", 0],
    //     ["Technology", "Columbia", 0],
    //     ["Technology", "Rochester", 0],
    //     ["Technology", "Minneapolis", 0],
    //     ["Technology", "Portland", 0],
    //     ["Technology", "Saint Paul", 0],
    //     ["Technology", "Aurora", 478],
    //     ["Technology", "Charlotte", 204],
    //     ["Technology", "Urbandale", 0],
    //     ["Technology", "Columbus", 120],
    //     ["Technology", "Bristol", 0],
    //     ["Technology", "Wilmington", 136],
    //     ["Technology", "Bloomington", 0],
    //     ["Technology", "Phoenix", 0],
    //     ["Technology", "Roseville", 0]
    // ];

    // Extract unique names and locations
    const names = Array.from(new Set(data.map((d) => d[1])));
    const locations = Array.from(new Set(data.map((d) => d[0])));

    let chartName = grafieks.plotConfiguration.chartName;

    // Create an empty object to store the formatted data
    const formattedData = {};

    // Initialize the formatted data object with empty arrays for each name
    names.forEach((name) => {
        formattedData[name] = [];
    });

    // Populate the formatted data object with values for each name and location
    data.forEach((d) => {
        const name = d[1];
        const location = d[0];
        const value = d[2];

        formattedData[name].push({ location, value });
    });
    var heightGrid = document.getElementsByClassName("domain")[2].getBBox().height;
    var widthGrid = document.getElementsByClassName("x-axis")[0].getBBox().width - 10;
    console.log("formattedData", formattedData);
    // Set up the dimensions and margins
    const margin = { top: 20, right: 20, bottom: 30, left: 40 };
    const width = widthGrid;
    const height = heightGrid;

    // Create the canvas
    const canvas = document.getElementById("chartline");
    const ctx = canvas.getContext("2d");
    canvas.width = width + margin.left + margin.right;
    canvas.height = height + margin.top + margin.bottom;
    ctx.translate(margin.left, margin.top);
    const xScale = d3
        .scaleLinear()
        .domain([-0.61, locations.length - 0.43])
        .range([0, width]);

    const yScale = d3
        .scaleLinear()
        .domain([0, d3.max(Object.values(formattedData), (d) => d3.max(d, (v) => v.value))])
        .range([height, 0]);
    // Set colors for each name
    const colorScale = d3.scaleOrdinal().domain(names).range(d3.schemeCategory10);
    if (chartName == CONSTANTS.MULTIPLE_AREA_CHART) {
        // Set up scales

        // Create the line generator
        const area = d3
            .area()
            .x((d, i) => xScale(i))
            .y0(height)
            .y1((d) => yScale(d.value));

        // Draw the multiline chart
        names.forEach((name) => {
            ctx.beginPath();
            area.context(ctx)(formattedData[name]);
            ctx.globalAlpha = 0.5; // Set the opacity using ctx.globalAlpha
            ctx.fillStyle = colorScale(name); // Use fillStyle instead of strokeStyle
            ctx.fill(); // Fill the area instead of stroking the line

            // Add markers at each data point
            ctx.fillStyle = colorScale(name);
            formattedData[name].forEach((d) => {
                ctx.beginPath();
                ctx.arc(xScale(locations.indexOf(d.location)), yScale(d.value), 4, 0, Math.PI * 2);
                ctx.fill();
                ctx.stroke();
            });
        });
    } else {
        // Set up scales

        // Create the line generator
        const line = d3
            .line()
            .x((_, i) => xScale(i))
            .y((d) => yScale(d.value));

        // Set colors for each name

        // Draw the multiline chart
        names.forEach((name) => {
            ctx.strokeStyle = colorScale(name);
            ctx.beginPath();
            line.context(ctx)(formattedData[name]);
            ctx.stroke();

            // Add markers at each data point
            ctx.fillStyle = colorScale(name);
            formattedData[name].forEach((d) => {
                ctx.beginPath();
                ctx.arc(xScale(locations.indexOf(d.location)), yScale(d.value), 4, 0, Math.PI * 2);
                ctx.fill();
                ctx.stroke();
            });
        });
    }

    // Draw axes
    const xAxis = d3.axisBottom(xScale).tickFormat((d, i) => locations[i]);
    const yAxis = d3.axisLeft(yScale);

    // ctx.strokeStyle = "#000";
    // ctx.beginPath();
    // ctx.moveTo(0, height);
    // ctx.lineTo(width, height);
    // ctx.stroke();

    // ctx.beginPath();
    // ctx.moveTo(0, 0);
    // ctx.lineTo(0, height);
    // ctx.stroke();

    // Render the axes
    // ctx.strokeStyle = "#000";
    // ctx.lineWidth = 1;
    // ctx.font = "10px sans-serif";
    // ctx.fillStyle = "#000";

    // ctx.beginPath();
    // xAxis(ctx);
    // ctx.stroke();

    // ctx.beginPath();
    // yAxis(ctx);
    // ctx.stroke();
};

module.exports = drawD3FCLineCharts;
