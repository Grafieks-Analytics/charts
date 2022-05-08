const d3 = require("d3");
const { getNumberOfTicks, getAxisWidth } = require("../utils");

const makeYaxisGridLines = (scale) => {
    return d3.axisLeft(scale).ticks(getNumberOfTicks()).tickSize(-getAxisWidth()).tickFormat(d3.format(".2s"));
};

const setGrids = (svg) => {
    const grafieks = window.grafieks;
    const chartsMargins = grafieks.chartsConfig.margins;
    svg.append("g")
        .lower() // lower() Works like Prepend in jquery
        .attr("class", "grid")
        .attr("transform", `translate(${chartsMargins.left},0)`)
        .style("stroke-width", "1")
        .call(makeYaxisGridLines(grafieks.utils.yScale));
};

module.exports = {
    setGrids
};
