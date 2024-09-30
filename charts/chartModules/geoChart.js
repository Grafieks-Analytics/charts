// Canvas Implementation
const d3 = require("d3");
const topojson = require("topojson-client");

const chartGeneration = () => {
    const width = 960;
    const height = 600;
    const canvas = d3.select("body")
        .append("canvas")
        .attr("width", width)
        .attr("height", height)
        .node();
    
    const context = canvas.getContext("2d");

    const projection = d3.geoMercator()
        .scale(140)
        .translate([width / 2, height / 1.4]);

    const path = d3.geoPath(projection).context(context);

    d3.json('https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json').then((data) => {
        const countries = topojson.feature(data, data.objects.countries).features;

        // Clear the canvas
        context.clearRect(0, 0, width, height);

        // Draw each country path
        countries.forEach((country) => {
            context.beginPath();
            path(country);
            context.fillStyle = "#ccc";
            context.fill();
            context.strokeStyle = "#333";
            context.stroke();
        });
    });
}

module.exports = chartGeneration;


//SVG implementation 
// const d3 = require("d3");
// const topojson = require("topojson-client");

// const chartGeneration = () => {
//     const width = 960;
//     const height = 600;
//     const svg = d3.select("body").append("svg").attr("width", width).attr("height", height);
//     const projection = d3.geoMercator().scale(140).translate([width / 2, height / 1.4]);
//     const path = d3.geoPath(projection);
//     const g = svg.append('g');
//     d3.json('https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json').then((data) => {
//         const countries = topojson.feature(data, data.objects.countries).features;
//         g.selectAll('path').data(countries).enter().append('path').attr('class', 'country').attr('d', path);
//     })
// }

// module.exports = chartGeneration;