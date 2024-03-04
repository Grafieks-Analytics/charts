const CONSTANTS = require("../constants");
const drawD3FCLineCharts = (datas) => {
    console.log("datafrom d3fc line", grafieks.dataUtils.dataValues);
    // data = grafieks.dataUtils.dataValues;
    data = window.transformedDataValues;

    // Assuming you have the data for the multiline chart

   

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
        .domain([0, d3.max(Object.values(formattedData), (d) => d3.max(d, (v) => Number(
             v.value)))])
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
            .y1((d) => yScale( Number(d.value)));

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
                ctx.arc(xScale(locations.indexOf(d.location)), yScale(Number(d.value)), 4, 0, Math.PI * 2);
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
