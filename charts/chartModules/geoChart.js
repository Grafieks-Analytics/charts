const d3 = require("d3");

const chartGeneration = () => {
    const width = 960;
    const height = 600;
    const svg = d3.select("body").append("svg").attr("width", width).attr("height", height);
    const projection = d3.geoMercator().scale(140).translate([width / 2, height / 1.4]);
    const path = d3.geoPath(projection);
    const g = svg.append('g');
    d3.json('https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json').then((data) => {
        const countries = topojson.feature(data, data.objects.countries).features;
        g.selectAll('path').data(countries).enter().append('path').attr('class', 'country').attr('d', path);
    })
}

module.exports = chartGeneration;